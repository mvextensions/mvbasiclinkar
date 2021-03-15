import * as path from 'path';
import * as vscode from 'vscode';
import { Connection } from './connection';
import { LkData } from './lkdata';
import { TextDecoder } from 'util';
import { Utilities } from './Utilities';

export class File implements vscode.FileStat {

    type: vscode.FileType;
    ctime: number;
    mtime: number;
    size: number;

    name: string;
    data?: Uint8Array;

    originalRecord: string | undefined;
    isNew: boolean;
    fromOpenResource: boolean;

    constructor(name: string) {
        this.type = vscode.FileType.File;
        this.ctime = Date.now();
        this.mtime = Date.now();
        this.size = 0;
        this.name = name;
        this.originalRecord = undefined;
        this.isNew = false;
        this.fromOpenResource = false;
    }
}

export class Directory implements vscode.FileStat {

    type: vscode.FileType;
    ctime: number;
    mtime: number;
    size: number;

    name: string;
    entries: Map<string, File | Directory>;

    constructor(name: string) {
        this.type = vscode.FileType.Directory;
        this.ctime = Date.now();
        this.mtime = Date.now();
        this.size = 0;
        this.name = name;
        this.entries = new Map();
    }
}

export type Entry = File | Directory;

export class LkFileSystemProvider implements vscode.FileSystemProvider {

    root = new Directory('');

    connection: Connection;
    initialized: boolean = false;

    constructor(conn: Connection) {

        this.connection = Connection.Clone(conn);


        vscode.workspace.onDidOpenTextDocument(event => {
            if (event.uri.scheme == this.connection.scheme) {
                let entry = this._lookup(event.uri, false);
                if (entry) {
                    if (event.languageId != "mvbasic" && event.languageId == "plaintext")
                        vscode.languages.setTextDocumentLanguage(event, "mvbasic");
                }
                
                var confs = vscode.workspace.getConfiguration();
                var conf = confs.get('linkar.history') as string[];
                var path = event.uri.scheme + ":" + event.uri.path;
                if (conf.length > 49)
                    conf.pop();
                if (conf.includes(path))
                {
                    conf.sort(function(x,y){ return x == path ? -1 : y == path ? 1 : 0; });
                }
                else
                {
                    conf.unshift(path);
                }                
                confs.update("linkar.history", conf, vscode.ConfigurationTarget.Global);
            }
            return event;
        });
    }

    load() {
        var lkFs = this;
        lkFs.createDirectory(vscode.Uri.parse(lkFs.connection.scheme + ":/" + lkFs.connection.name + "/"));
        var selectClause = "";
        switch (this.connection.database) {
            case "Unidata":
                selectClause = "WITH @ID # \"_]\"";
                break;
            case "jBASE":
                selectClause = "WITH *A0 # \"$]\"";
                break;
            case "Reality":
                selectClause = "WITH A0 # \"$]\"";
                break;
        }
        var filePagination = "False";
        var fileRecPerPage = "5000";
        if (lkFs.connection.maxItemsPerFile) {
            var filePagination = "True";
            var fileRecPerPage = lkFs.connection.maxItemsPerFile.toString();
        }
        if (lkFs.connection.files && lkFs.connection.files != "") {
            var fileNames = lkFs.connection.files.split('|');
            var i = 0;
            for (i = 0; i < fileNames.length; i++) {
                var fileName = fileNames[i];

                var dataSelect;
                if (lkFs.connection.ondemand)
                    dataSelect = { ORIGINAL_RECORDS: "False", CUSTOM_VARS: "", OUTPUT_FORMAT: "MV", ONLY_RECORD_ID: "True", FILE_NAME: fileName, SELECT_CLAUSE: selectClause, SORT_CLAUSE: "", DICT_CLAUSE: "", PRESELECT_CLAUSE: "", PAGINATION: filePagination, PAGE_NUMBER: "1", RECORDS_FOR_PAGE: fileRecPerPage };
                else
                    dataSelect = { ORIGINAL_RECORDS: "False", CUSTOM_VARS: "", OUTPUT_FORMAT: "MV", ONLY_RECORD_ID: "False", FILE_NAME: fileName, SELECT_CLAUSE: selectClause, SORT_CLAUSE: "", DICT_CLAUSE: "", PRESELECT_CLAUSE: "", PAGINATION: filePagination, PAGE_NUMBER: "1", RECORDS_FOR_PAGE: fileRecPerPage };

                var respSelect = Utilities.requestJson(lkFs.connection.name, lkFs.connection.GetURL(), lkFs.connection.apikey, "select", dataSelect);
                if (respSelect && respSelect.COMMAND) {
                    lkFs.createDirectory(vscode.Uri.parse(lkFs.connection.scheme + ":/" + lkFs.connection.name + "/" + fileName + "/"));
                    var lkdataSelect = new LkData(respSelect.COMMAND);
                    var errorSelect = lkdataSelect.OutputDataElements.get(LkData.ERRORS_KEY);
                    if (errorSelect)
                        vscode.window.showErrorMessage(errorSelect);
                    else {
                        var lstids = lkdataSelect.OutputDataElements.get(LkData.RECORD_ID_KEY);
                        if (lstids) {
                            var ids = lstids.split("\x1E");
                            var lstrecords;
                            if (!lkFs.connection.ondemand)
                                lstrecords = lkdataSelect.OutputDataElements.get(LkData.RECORD_KEY).split("\x1E");
                            var j = 0;
                            for (j = 0; j < ids.length; j++) {
                                var id = ids[j];
                                try {
                                    if (lkFs.connection.ondemand)
                                        lkFs.writeFile(vscode.Uri.parse(lkFs.connection.scheme + ":/" + lkFs.connection.name + "/" + fileName + "/" + id), new Uint8Array(0), { create: true, overwrite: true, isNew: false, onDemand: lkFs.connection.ondemand });
                                    else {
                                        if (lstrecords && lstrecords[j] != undefined && lstrecords[j] != null) {
                                            var buff = Buffer.from(lstrecords[j].replace(new RegExp('\xFE', 'gi'), "\r\n"));
                                            lkFs.writeFile(vscode.Uri.parse(lkFs.connection.scheme + ":/" + lkFs.connection.name + "/" + fileName + "/" + id), buff, { create: true, overwrite: true, isNew: false, onDemand: lkFs.connection.ondemand });
                                        }
                                    }
                                }
                                catch (error) {
                                    console.log("ERROR (" + lkFs.connection.name + "): Failer to write File: " + id + " in " + fileName)
                                }
                            }
                        }
                    }
                }
            }
            vscode.window.showInformationMessage(lkFs.connection.name + " LOADED");
            lkFs.initialized = true;
        }
        else {
            var mainResponse;
            if (this.connection.database == "jBASE") {
                var dataLKSchemasDictionaries = { ROWHEADERS: "NONE", OUTPUT_FORMAT: "MV" };
                mainResponse = Utilities.requestJson(lkFs.connection.name, lkFs.connection.GetURL(), lkFs.connection.apikey, "LKSchemasDictionaries", dataLKSchemasDictionaries);
            }
            else {
                var mainFileName = "";
                var mainSelectClause = "";
                var mainSortClause = "";
                switch (this.connection.database) {
                    case "QM":
                        mainFileName = "VOC";
                        mainSelectClause = "WITH TYPE = \"F\"\"Q\" AND WITH @ID UNLIKE \"....OUT\"";
                        mainSortClause = "BY TYPE BY @ID";
                        break;
                    case "D3":
                        mainFileName = "MD";
                        mainSelectClause = "WITH A1 = \"D\"";
                        mainSortClause = "BY A1 BY A0";
                        break;
                    case "Unidata":
                        mainFileName = "VOC";
                        mainSelectClause = "WITH TYPE = \"F\"\"DIR\"";
                        mainSortClause = "BY @ID";
                        break;
                    case "Universe":
                        mainFileName = "VOC";
                        mainSelectClause = "WITH TYPE = \"F\"\"Q\" AND WITH @ID UNLIKE \"....O\"";
                        mainSortClause = "BY TYPE BY @ID";
                        break;
                    case "mvBASE":
                        mainFileName = "MD";
                        mainSelectClause = "WITH *A1 = \"D\"";
                        mainSortClause = "BY *A1 BY *A0";
                        break;
                    case "jBASE":
                        mainFileName = "";
                        mainSelectClause = "";
                        mainSortClause = "";
                        break;
                    case "Reality":
                        mainFileName = "MD";
                        mainSelectClause = "WITH A1 = \"D]\"";
                        mainSortClause = "BY A1 BY A0";
                        break;
                }
                var dataDBSelect = { ORIGINAL_RECORDS: "False", CUSTOM_VARS: "", OUTPUT_FORMAT: "MV", ONLY_RECORD_ID: "True", FILE_NAME: mainFileName, SELECT_CLAUSE: mainSelectClause, SORT_CLAUSE: mainSortClause, DICT_CLAUSE: "", PRESELECT_CLAUSE: "" };
                mainResponse = Utilities.requestJson(lkFs.connection.name, lkFs.connection.GetURL(), lkFs.connection.apikey, "select", dataDBSelect);
            }
            if (mainResponse && mainResponse.COMMAND) {
                var lkdataDB = new LkData(mainResponse.COMMAND);
                var errorDB = lkdataDB.OutputDataElements.get(LkData.ERRORS_KEY);
                if (errorDB) {
                    vscode.window.showErrorMessage(errorDB);
                    return;
                }
                var lstfilenames = lkdataDB.OutputDataElements.get(LkData.RECORD_ID_KEY);
                if (lstfilenames) {
                    var fileNames = lstfilenames.split("\x1E");
                    var i = 0;
                    for (i = 0; i < fileNames.length; i++) {
                        var fileName = fileNames[i];
                        var dataSelect;
                        if (lkFs.connection.ondemand)
                            dataSelect = { ORIGINAL_RECORDS: "False", CUSTOM_VARS: "", OUTPUT_FORMAT: "MV", ONLY_RECORD_ID: "True", FILE_NAME: fileName, SELECT_CLAUSE: selectClause, SORT_CLAUSE: "", DICT_CLAUSE: "", PRESELECT_CLAUSE: "", PAGINATION: filePagination, PAGE_NUMBER: "1", RECORDS_FOR_PAGE: fileRecPerPage };
                        else
                            dataSelect = { ORIGINAL_RECORDS: "False", CUSTOM_VARS: "", OUTPUT_FORMAT: "MV", ONLY_RECORD_ID: "False", FILE_NAME: fileName, SELECT_CLAUSE: selectClause, SORT_CLAUSE: "", DICT_CLAUSE: "", PRESELECT_CLAUSE: "", PAGINATION: filePagination, PAGE_NUMBER: "1", RECORDS_FOR_PAGE: fileRecPerPage };
                        var respSelect = Utilities.requestJson(lkFs.connection.name, lkFs.connection.GetURL(), lkFs.connection.apikey, "select", dataSelect);
                        if (respSelect && respSelect.COMMAND) {
                            var dirUri = vscode.Uri.parse(lkFs.connection.scheme + ":/" + lkFs.connection.name + "/" + fileName + "/");
                            lkFs.createDirectory(dirUri);
                            var lkdataSelect = new LkData(respSelect.COMMAND);
                            var errorSelect = lkdataSelect.OutputDataElements.get(LkData.ERRORS_KEY);
                            if (errorSelect)
                                vscode.window.showErrorMessage(errorSelect);
                            else {
                                var lstids = lkdataSelect.OutputDataElements.get(LkData.RECORD_ID_KEY);
                                if (lstids) {
                                    var ids = lstids.split("\x1E");
                                    var lstrecords;
                                    if (!lkFs.connection.ondemand)
                                        lstrecords = lkdataSelect.OutputDataElements.get(LkData.RECORD_KEY).split("\x1E");
                                    var j = 0;
                                    for (j = 0; j < ids.length; j++) {
                                        var id = ids[j];
                                        try {
                                            if (lkFs.connection.ondemand)
                                                lkFs.writeFile(vscode.Uri.parse(lkFs.connection.scheme + ":/" + lkFs.connection.name + "/" + fileName + "/" + id), new Uint8Array(0), { create: true, overwrite: true, isNew: false, onDemand: lkFs.connection.ondemand });
                                            else {
                                                if (lstrecords && lstrecords[j]) {
                                                    var buff = Buffer.from(lstrecords[j].replace(new RegExp('\xFE', 'gi'), "\r\n"));
                                                    lkFs.writeFile(vscode.Uri.parse(lkFs.connection.scheme + ":/" + lkFs.connection.name + "/" + fileName + "/" + id), buff, { create: true, overwrite: true, isNew: false, onDemand: lkFs.connection.ondemand });
                                                }
                                            }
                                        }
                                        catch (error) {
                                            vscode.window.showErrorMessage("ERROR (" + lkFs.connection.name + "): Failer to write item " + id + " in " + fileName + " file");
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            vscode.window.showInformationMessage(lkFs.connection.name + " LOADED");
            lkFs.initialized = true;
        }
    }

    unload() {
        var lkFs = this;
        lkFs.createDirectory(vscode.Uri.parse(lkFs.connection.scheme + ":/" + lkFs.connection.name + "/"));
        lkFs.initialized = false;
    }

    // --- manage file metadata

    stat(uri: vscode.Uri): vscode.FileStat {
        return this._lookup(uri, false);
    }

    readDirectory(uri: vscode.Uri): [string, vscode.FileType][] {
        const entry = this._lookupAsDirectory(uri, false);
        let result: [string, vscode.FileType][] = [];
        for (const [name, child] of entry.entries) {
            result.push([name, child.type]);
        }
        return result;
    }

    // --- manage file contents

    readFile(uri: vscode.Uri): Uint8Array {
        if (this.initialized == true) {
            var f;
            try {
                f = this._lookupAsFile(uri, false);
                var forceRead = this.connection.ondemand && !f.fromOpenResource;
                f.fromOpenResource = false;
                const data = f.data;
                if (data) {
                    if (forceRead) {
                        this.FillFile(uri, false);
                        return f.data;
                    }
                    return data;
                }
                throw vscode.FileSystemError.FileNotFound();
            }
            catch (err) {
                setTimeout(() => {
                    vscode.commands.executeCommand("fileExplorer.searchInOtherFile", uri);
                }, 100);
                throw vscode.FileSystemError.FileNotFound();
            }
        }
        else {
            throw vscode.FileSystemError.Unavailable();
        }
    }

    FillFile(uri: vscode.Uri, fromOpenResource: boolean): void {
        let basename = path.posix.basename(uri.path);
        let parent = this._lookupParentDirectory(uri);
        let entry = parent.entries.get(basename);

        if (entry instanceof Directory) {
            throw vscode.FileSystemError.FileIsADirectory(uri);
        }
        if (!entry) {
            entry = new File(basename);
            parent.entries.set(basename, entry);
            this._fireSoon({ type: vscode.FileChangeType.Created, uri });
        }

        if (!entry.isNew) {

            var content = new Uint8Array(0);
            entry.originalRecord = undefined;
            var dataReadRecs = Buffer.from(basename).toString('base64');
            var dataRead = { CALCULATED: "False", CONVERSION: "False", FORMAT_SPEC: "False", ORIGINAL_RECORDS: "False", CUSTOM_VARS: "", OUTPUT_FORMAT: "MV", FILE_NAME: parent.name, DICT_CLAUSE: "", RECORDS: dataReadRecs };
            var resp = Utilities.requestJson(this.connection.name, this.connection.GetURL(), this.connection.apikey, "read", dataRead);
            if (resp && resp.COMMAND) {
                var lkdata = new LkData(resp.COMMAND);
                var error = lkdata.OutputDataElements.get(LkData.ERRORS_KEY);
                if (error) {
                    throw vscode.FileSystemError.FileNotFound(error);
                }
                var txt = lkdata.OutputDataElements.get(LkData.RECORD_KEY);
                if (txt) {
                    entry.originalRecord = txt;
                    content = Buffer.from(txt.replace(new RegExp('\xFE', 'gi'), "\r\n"));
                }
            }
            else
                throw vscode.FileSystemError.FileNotFound("Unexpected error");

            entry.mtime = Date.now();
            entry.size = content.byteLength;
            entry.data = content;

            entry.fromOpenResource = fromOpenResource;

            if (fromOpenResource)
                this._fireSoon({ type: vscode.FileChangeType.Changed, uri });
        }
    }

    writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean, overwrite: boolean, isNew: boolean, onDemand: boolean }): void {
        var needRefresh = false;
        let basename = path.posix.basename(uri.path);
        let parent = this._lookupParentDirectory(uri);
        let entry = parent.entries.get(basename);
        if (entry instanceof Directory) {
            throw vscode.FileSystemError.FileIsADirectory(uri);
        }
        if (!entry && !options.create) {
            throw vscode.FileSystemError.FileNotFound(uri);
        }
        if (entry && options.create && !options.overwrite) {
            throw vscode.FileSystemError.FileExists(uri);
        }

        //WRITE
        var error;
        var lkdata = null;
        if (entry) {
            var record = new TextDecoder("utf-8").decode(content);
            record = record.replace(new RegExp('\r\n', 'gi'), '\xFE');
            record = record.replace(new RegExp('\r', 'gi'), '\xFE');
            record = record.replace(new RegExp('\n', 'gi'), '\xFE');

            if (entry.isNew) {
                var dataNewRecs = Buffer.from(basename + "\x1C" + record).toString('base64');
                var dataNew = { READ_AFTER: "True", CALCULATED: "False", CONVERSION: "False", FORMAT_SPEC: "False", ORIGINAL_RECORDS: "False", OPTIMISTIC_LOCK: "False", CUSTOM_VARS: "", INPUT_FORMAT: "MV", OUTPUT_FORMAT: "MV", FILE_NAME: parent.name, RECORDS: dataNewRecs };
                var resp = Utilities.requestJson(this.connection.name, this.connection.GetURL(), this.connection.apikey, "new", dataNew);
                if (resp && resp.COMMAND) {
                    lkdata = new LkData(resp.COMMAND);
                    error = lkdata.OutputDataElements.get(LkData.ERRORS_KEY);
                }
                else
                    error = "Unexpected error";
                if (!error) {
                    entry.originalRecord = lkdata.OutputDataElements.get(LkData.RECORD_KEY);
                    entry.isNew = false;
                    options.isNew = false;
                    needRefresh = true;
                    vscode.window.showInformationMessage(uri.fsPath + " WRITTEN");
                }
            }
            else {
                var originalRecord = entry.originalRecord;
                var dataWriteRecs = Buffer.from(basename + "\x1C" + record + "\x1C" + (originalRecord ? originalRecord : "")).toString('base64');
                var dataWrite = { READ_AFTER: "True", CALCULATED: "False", CONVERSION: "False", FORMAT_SPEC: "False", ORIGINAL_RECORDS: "False", OPTIMISTIC_LOCK: "True", CUSTOM_VARS: "", INPUT_FORMAT: "MV", OUTPUT_FORMAT: "MV", FILE_NAME: parent.name, RECORDS: dataWriteRecs };
                var resp = Utilities.requestJson(this.connection.name, this.connection.GetURL(), this.connection.apikey, "update", dataWrite);
                if (resp && resp.COMMAND) {
                    lkdata = new LkData(resp.COMMAND);
                    error = lkdata.OutputDataElements.get(LkData.ERRORS_KEY);
                }
                else
                    error = "Unexpected error";
                if (!error) {
                    entry.originalRecord = lkdata.OutputDataElements.get(LkData.RECORD_KEY);
                    entry.isNew = false;
                    options.isNew = false;
                    vscode.window.showInformationMessage(uri.fsPath + " WRITTEN");
                }
            }
        }

        if (error) {
            vscode.window.showErrorMessage(error);
        }
        else {
            // update local file cache with changed file
            if (!entry) {
                entry = new File(basename);
                parent.entries.set(basename, entry);
                this._fireSoon({ type: vscode.FileChangeType.Created, uri });
            }
            entry.mtime = Date.now();
            entry.size = content.byteLength;
            entry.data = content;
            entry.isNew = options.isNew;

            this._fireSoon({ type: vscode.FileChangeType.Changed, uri });
        }
        if (needRefresh)
            vscode.commands.executeCommand("fileExplorer.refreshTree");
    }

    // --- manage files/folders

    rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean }): void {

        if (!options.overwrite && this._lookup(newUri, true)) {
            throw vscode.FileSystemError.FileExists(newUri);
        }

        let entry = this._lookup(oldUri, false);
        let oldParent = this._lookupParentDirectory(oldUri);

        let newParent = this._lookupParentDirectory(newUri);
        let newName = path.posix.basename(newUri.path);

        oldParent.entries.delete(entry.name);
        entry.name = newName;
        newParent.entries.set(newName, entry);

        this._fireSoon(
            { type: vscode.FileChangeType.Deleted, uri: oldUri },
            { type: vscode.FileChangeType.Created, uri: newUri }
        );
    }

    delete(uri: vscode.Uri): void {
        let dirname = uri.with({ path: path.posix.dirname(uri.path) });
        let basename = path.posix.basename(uri.path);
        let parent = this._lookupAsDirectory(dirname, false);
        if (!parent.entries.has(basename)) {
            throw vscode.FileSystemError.FileNotFound(uri);
        }

        //DELETE
        var error = undefined;
        let entry = parent.entries.get(basename);
        if (entry instanceof File) {
            if (!entry.isNew) {
                var originalRecord = entry.originalRecord;

                var dataDeleteRecs = Buffer.from(basename + "\x1C" + (originalRecord ? originalRecord : "")).toString('base64');
                var dataDelete = { OPTIMISTIC_LOCK: (originalRecord ? "True" : "False"), RECOVER_RECORD_ID_TYPE: "NONE", CUSTOM_VARS: "", INPUT_FORMAT: "MV", OUTPUT_FORMAT: "MV", FILE_NAME: parent.name, RECORDS: dataDeleteRecs };
                var resp = Utilities.requestJson(this.connection.name, this.connection.GetURL(), this.connection.apikey, "delete", dataDelete);

                if (resp && resp.COMMAND) {
                    var lkdata = new LkData(resp.COMMAND);
                    error = lkdata.OutputDataElements.get(LkData.ERRORS_KEY);
                    if (!error)
                        vscode.window.showInformationMessage(uri.fsPath + " DELETED");
                }
                else
                    error = "Unexpected error";
            }
        }
        else
            error = "Cant delete this file";


        if (error) {
            vscode.window.showErrorMessage(error);
        }
        else {
            parent.entries.delete(basename);
            parent.mtime = Date.now();
            parent.size -= 1;
            this._fireSoon({ type: vscode.FileChangeType.Changed, uri: dirname }, { uri, type: vscode.FileChangeType.Deleted });
        }
    }

    createDirectory(uri: vscode.Uri): void {
        let basename = path.posix.basename(uri.path);
        let dirname = uri.with({ path: path.posix.dirname(uri.path) });
        let parent = this._lookupAsDirectory(dirname, false);

        let entry = new Directory(basename);
        parent.entries.set(entry.name, entry);
        parent.mtime = Date.now();
        parent.size += 1;
        this._fireSoon({ type: vscode.FileChangeType.Changed, uri: dirname }, { type: vscode.FileChangeType.Created, uri });
    }

    // --- lookup

    private _lookup(uri: vscode.Uri, silent: false): Entry;
    private _lookup(uri: vscode.Uri, silent: boolean): Entry | undefined;
    private _lookup(uri: vscode.Uri, silent: boolean): Entry | undefined {
        let parts = uri.path.split('/');
        let entry: Entry = this.root;
        for (const part of parts) {
            if (!part) {
                continue;
            }
            let child: Entry | undefined;
            if (entry instanceof Directory) {
                child = entry.entries.get(part);
            }
            if (!child) {
                if (!silent) {
                    throw vscode.FileSystemError.FileNotFound(uri);
                } else {
                    return undefined;
                }
            }
            entry = child;
        }
        return entry;
    }

    public _lookupAsDirectory(uri: vscode.Uri, silent: boolean): Directory {
        let entry = this._lookup(uri, silent);
        if (entry instanceof Directory) {
            return entry;
        }
        throw vscode.FileSystemError.FileNotADirectory(uri);
    }

    public _lookupAsFile(uri: vscode.Uri, silent: boolean): File {
        let entry = this._lookup(uri, silent);
        if (entry instanceof File) {
            return entry;
        }
        throw vscode.FileSystemError.FileIsADirectory(uri);
    }

    public _lookupParentDirectory(uri: vscode.Uri): Directory {
        const dirname = uri.with({ path: path.posix.dirname(uri.path) });
        return this._lookupAsDirectory(dirname, false);
    }

    // --- manage file events

    private _emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
    private _bufferedEvents: vscode.FileChangeEvent[] = [];
    private _fireSoonHandle?: NodeJS.Timer;

    readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this._emitter.event;

    watch(_resource: vscode.Uri): vscode.Disposable {
        // ignore, fires for all changes...
        return new vscode.Disposable(() => { });
    }

    private _fireSoon(...events: vscode.FileChangeEvent[]): void {
        this._bufferedEvents.push(...events);

        if (this._fireSoonHandle) {
            clearTimeout(this._fireSoonHandle);
        }

        this._fireSoonHandle = setTimeout(() => {
            this._emitter.fire(this._bufferedEvents);
            this._bufferedEvents.length = 0;
        }, 5);
    }
}
