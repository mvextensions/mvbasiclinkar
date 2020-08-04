import * as path from 'path';
import * as vscode from 'vscode';
import { LkNode } from './LkNode';
import * as fs from 'fs';
import { Utilities } from './Utilities';
import { LkData } from './lkdata';
import { FileExplorer } from './fileExplorer';

export class Connection {

    scheme: string;
    name: string;
    database: string;
    server: string;
    port: number;
    ssl: boolean;
    apikey: string;
    pluginref: string;
    customvars: string;
    freetext: string;
    language: string;
    autoconnect: boolean;
    ondemand: boolean;
    files: string;
    basiccmd: string;
    basicarg: string;
    catalogcmd: string;
    catalogarg: string;
    terminal: string;
    maxItemsPerFile: number;

    constructor() {
        this.scheme = "";
        this.name = "New Connection";
        this.database = "QM";
        this.server = "127.0.0.1";
        this.port = 11201;
        this.ssl = false;
        this.apikey = "";
        this.pluginref = "";
        this.customvars = "";
        this.freetext = "";
        this.language = "";
        this.autoconnect = false;
        this.ondemand = true;
        this.files = "";
        this.basiccmd = "BASIC";
        this.basicarg = "";
        this.catalogcmd = "CATALOG";
        this.catalogarg = "LOCAL";
        this.terminal = "";
        this.maxItemsPerFile = 5000;
    }

    public static Clone(originalConnection: Connection): Connection {
        var conn = new Connection();
        conn.scheme = originalConnection.scheme;
        conn.name = originalConnection.name;
        conn.database = originalConnection.database;
        conn.server = originalConnection.server;
        conn.port = originalConnection.port;
        conn.ssl = originalConnection.ssl;
        conn.apikey = originalConnection.apikey;
        conn.pluginref = originalConnection.pluginref;
        conn.customvars = originalConnection.customvars;
        conn.freetext = originalConnection.freetext;
        conn.language = originalConnection.language;
        conn.autoconnect = originalConnection.autoconnect;
        conn.ondemand = originalConnection.ondemand;
        conn.files = originalConnection.files;
        conn.basiccmd = originalConnection.basiccmd;
        conn.basicarg = originalConnection.basicarg;
        conn.catalogcmd = originalConnection.catalogcmd;
        conn.catalogarg = originalConnection.catalogarg;
        conn.terminal = originalConnection.terminal;
        conn.maxItemsPerFile = originalConnection.maxItemsPerFile;
        return conn;
    }

    public static newSchemeId(): string {
        return "sch" + 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    public GetURL(): string {
        var protocol = "http";
        if (this.ssl)
            protocol = "https";

        return protocol + "://" + this.server + ":" + this.port + "/api/";
    }

    public GetInfo(): string {
        var info = "";

        info += "Database: " + this.database;
        info += "\r\nServer: " + this.server;
        info += "\r\nPort: " + this.port;
        info += "\r\nSSL: " + (this.ssl ? "yes" : "no");
        info += "\r\nLoad automatically on start: " + (this.autoconnect ? "yes" : "no");
        info += "\r\nLoad only Itemids: " + (this.ondemand ? "yes" : "no");
        info += "\r\nIncluded Files: " + (this.files.length > 30 ? (this.files.substring(0, 30) + "...") : this.files);
        info += "\r\nMax. records per file: " + (this.maxItemsPerFile ? this.maxItemsPerFile.toString() : "unlimited");

        return info;
    }
}

export class ConnectionForm {
    constructor(private mainContext: vscode.ExtensionContext) {
    }

    load(uri?: vscode.Uri) {
        var data;
        var name: string = "New Connection";
        var title = "";
        if (uri) {
            title = "Edit Connection: ";
            const connections = vscode.workspace.getConfiguration().get('linkar.connections') as [];
            var i = 0;
            for (i = 0; i < connections.length; i++) {
                var conn = connections[i] as Connection;
                if (conn.scheme == uri.scheme) {
                    title += conn.name;
                    data = conn;
                    break;
                }
            }
        }
        else {
            data = new Connection();
            title = name;
        }

        const panel = vscode.window.createWebviewPanel(
            'connectionForm',
            title,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        const filePath: vscode.Uri = vscode.Uri.file(path.join(this.mainContext.extensionPath, 'html', 'connectionPage.html'));
        var str = fs.readFileSync(filePath.fsPath, 'utf8');
        panel.webview.html = str.replace("[%TITLE%]", title);
        panel.webview.postMessage(data);

        panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'save':
                        var postdata = JSON.parse(message.connection) as Connection;
                        var confs = vscode.workspace.getConfiguration();
                        var conf = confs.get('linkar.connections') as Connection[];
                        if (!uri) //NEW
                        {
                            postdata.scheme = Connection.newSchemeId();
                            conf.push(postdata);
                            confs.update("linkar.connections", conf, vscode.ConfigurationTarget.Global).then(() => {
                                vscode.commands.executeCommand("fileExplorer.addNewConnection", postdata);
                            });
                        }
                        else //EDIT
                        {
                            var i = 0;
                            for (i = 0; i < conf.length; i++) {
                                var readconn = conf[i] as Connection;
                                if (readconn.scheme == uri.scheme) {
                                    var needReload = false;
                                    if (readconn.name != postdata.name || readconn.database != postdata.database ||
                                        readconn.server != postdata.server || readconn.port != postdata.port ||
                                        readconn.ssl != postdata.ssl || readconn.apikey != postdata.apikey ||
                                        readconn.pluginref != postdata.pluginref || readconn.customvars != postdata.customvars ||
                                        readconn.freetext != postdata.freetext || readconn.language != postdata.language ||
                                        readconn.ondemand != postdata.ondemand || readconn.files != postdata.files || readconn.maxItemsPerFile != postdata.maxItemsPerFile)
                                        needReload = true;
                                    readconn.name = postdata.name;
                                    readconn.database = postdata.database;
                                    readconn.server = postdata.server;
                                    readconn.port = postdata.port;
                                    readconn.ssl = postdata.ssl;
                                    readconn.apikey = postdata.apikey;
                                    readconn.pluginref = postdata.pluginref;
                                    readconn.customvars = postdata.customvars;
                                    readconn.freetext = postdata.freetext;
                                    readconn.language = postdata.language;
                                    readconn.autoconnect = postdata.autoconnect;
                                    readconn.ondemand = postdata.ondemand;
                                    readconn.files = postdata.files;
                                    readconn.basiccmd = postdata.basiccmd;
                                    readconn.basicarg = postdata.basicarg;
                                    readconn.catalogcmd = postdata.catalogcmd;
                                    readconn.catalogarg = postdata.catalogarg;
                                    readconn.terminal = postdata.terminal;
                                    readconn.maxItemsPerFile = postdata.maxItemsPerFile;
                                    confs.update("linkar.connections", conf, vscode.ConfigurationTarget.Global).then(() => {
                                        vscode.commands.executeCommand("fileExplorer.loadConnection", { uri: uri } as LkNode, true, needReload);
                                    });
                                    break;
                                }
                            }
                        }
                        panel.dispose();
                        return;
                    case 'test':
                        var postdata = Connection.Clone(JSON.parse(message.connection) as Connection);
                        var error = "";
                        var resp = Utilities.requestJson(postdata.name, postdata.GetURL(), postdata.apikey, "getversion", { OUTPUT_FORMAT: "MV" });
                        if (resp && resp.COMMAND) {
                            var lkdata = new LkData(resp.COMMAND);
                            error = lkdata.OutputDataElements.get(LkData.ERRORS_KEY);
                        }
                        else
                            vscode.window.showErrorMessage("Unexpected error");
                        if (error) {
                            vscode.window.showErrorMessage(error);
                        }
                        else {
                            var versionResult = lkdata.OutputDataElements.get(LkData.RECORD_KEY);
                            if (versionResult) {
                                var arrVersion = versionResult.split('\xFE');
                                var versionOutput = "OK!\r\n";
                                versionOutput += "MV Components Version: " + arrVersion[0] + "\r\n";
                                versionOutput += "Linkar Server Version: " + arrVersion[1] + "\r\n";
                                versionOutput += "Linkar Client Version: " + arrVersion[2] + "\r\n";
                                versionOutput += "Database: " + arrVersion[3] + "\r\n";
                                versionOutput += "Operating System: " + arrVersion[4];
                                FileExplorer.outputChannel.clear();
                                FileExplorer.outputChannel.appendLine(versionOutput);
                                FileExplorer.outputChannel.show();
                            }
                        }
                        return;
                    case 'exit':
                        panel.dispose();
                        return;
                }
            },
            undefined,
            this.mainContext.subscriptions
        );
    }
}
