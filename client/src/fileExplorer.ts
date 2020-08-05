import * as vscode from 'vscode';
import * as path from 'path';

import { ConnectionsTree } from './ConnectionsTree';
import { LkNode } from './LkNode';

import { ConnectionForm, Connection } from './connection';
import { LkData } from './lkdata';
import { Utilities } from './Utilities';
import { LkFileSystemProvider, Entry, Directory } from './lkSystemProvider';
import { TextDecoder } from 'util';
import { DictionariesForm } from './dictionaries';

export class FileExplorer {

	private fileExplorer: vscode.TreeView<LkNode>;
	public static outputChannel = vscode.window.createOutputChannel("LINKAR");
	public static lkTerminal = vscode.window.createTerminal("LINKAR (TERMINAL)");

	constructor(context: vscode.ExtensionContext) {
		var models = this.LoadModels();
		const treeDataProvider = new ConnectionsTree(models);
		this.fileExplorer = vscode.window.createTreeView('fileExplorer', { treeDataProvider, showCollapseAll: true });
		vscode.commands.registerCommand('fileExplorer.openFile', (resource) => this.openResource(resource, treeDataProvider));

		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.unloadConnection', async (node: LkNode) => {
			var lkfsp = treeDataProvider.getModelFromUri(node.uri);
			if (lkfsp.initialized) {
				lkfsp.unload();
				treeDataProvider.refresh();
			}
		}));

		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.loadConnection', async (node: LkNode, fromEdit: boolean, needReload: boolean) => {
			if (fromEdit) {
				const connections = vscode.workspace.getConfiguration().get('linkar.connections') as [];
				var isInitialized = treeDataProvider.getModelFromUri(node.uri).initialized;
				var i = 0;
				for (i = 0; i < connections.length; i++) {
					var conn = connections[i] as Connection;
					if (conn.scheme == node.uri.scheme) {
						var lkfs = treeDataProvider.getModelFromUri(node.uri);
						lkfs.connection = Connection.Clone(conn);
						treeDataProvider.setModel(lkfs);

						if (isInitialized && needReload) {
							lkfs.load();
						}
						treeDataProvider.refresh();
						break;
					}
				}
			}
			else {
				var lkfsp = treeDataProvider.getModelFromUri(node.uri);
				lkfsp.load();
				treeDataProvider.refresh();
			}
		}));

		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.editConnection', (node: LkNode) => {
			var connectionForm = new ConnectionForm(context);
			connectionForm.load(node.uri);
		}));

		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.newConnection', _ => {
			var connectionForm = new ConnectionForm(context);
			connectionForm.load();
		}));

		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.addNewConnection', (conn: Connection) => {
			var lkfs = new LkFileSystemProvider(conn);
			models.push(lkfs);
			vscode.workspace.registerFileSystemProvider(lkfs.connection.scheme, lkfs, { isCaseSensitive: true });
			if (conn.autoconnect)
				lkfs.load();
			treeDataProvider.refresh();
		}));

		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.deleteConnection', (node: LkNode) => {
			vscode.window.showInformationMessage('Are you sure?', 'Delete', 'Cancel').then(selection => {
				if (selection == "Delete") {
					var lkfsp = treeDataProvider.getModelFromUri(node.uri);
					treeDataProvider.deleteModel(lkfsp);
					treeDataProvider.refresh();
				}
			});
		}));

		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.executeTCLCmd', async (node: LkNode) => {
			var lkfsp = treeDataProvider.getModelFromUri(node.uri);
			const cmd = await vscode.window.showInputBox({ prompt: 'Input your TCL Command' });
			if (cmd) {
				var error = "";
				var dataCmd = { STATEMENT: cmd, CUSTOM_VARS: "", OUTPUT_FORMAT: "MV" };
				var resp = Utilities.requestJson(lkfsp.connection.name, lkfsp.connection.GetURL(), lkfsp.connection.apikey, "execute", dataCmd);
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
					var capturing = lkdata.OutputDataElements.get(LkData.CAPTURING_KEY);
					if (capturing) {
						FileExplorer.outputChannel.clear();
						FileExplorer.outputChannel.appendLine(capturing.replace(new RegExp('\xFE', 'gi'), "\r\n"));
						FileExplorer.outputChannel.show();
					}
				}
			}
		}));

		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.sendTerminalCmd', async (node: LkNode) => {
			var cmd = "";
			var lkFs = treeDataProvider.getModelFromUri(node.uri);
			cmd = lkFs.connection.terminal;
			if (cmd) {
				FileExplorer.lkTerminal.sendText(cmd);
				FileExplorer.lkTerminal.show();
			}
			else {
				cmd = await vscode.window.showInputBox({ prompt: 'Command:' });

				if (cmd) {
					FileExplorer.lkTerminal.sendText(cmd);
					FileExplorer.lkTerminal.show();
				}
			}
		}));

		vscode.window.onDidCloseTerminal(t => {
			if (FileExplorer.lkTerminal.processId == t.processId) {
				FileExplorer.lkTerminal = vscode.window.createTerminal("LINKAR (TERMINAL)");
			}
		});

		//FILES
		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.newItem', async (node: LkNode) => {
			var item = await vscode.window.showInputBox({ prompt: 'Input new item name:' });

			if (item) {
				let fileName = path.posix.basename(node.uri.path);
				var lkFs = treeDataProvider.getModelFromUri(node.uri);
				var itemuri = vscode.Uri.parse(lkFs.connection.scheme + ":/" + lkFs.connection.name + "/" + fileName + "/" + item);
				lkFs.writeFile(itemuri, new Uint8Array(0), { create: true, overwrite: true, isNew: true, onDemand: lkFs.connection.ondemand });
				try {
					vscode.window.showTextDocument(itemuri);
				}
				catch (iternalerror) {
					vscode.window.showErrorMessage(iternalerror);
				}
				treeDataProvider.refresh();
			}
		}));

		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.refreshTree', _ => {
			treeDataProvider.refresh();
		}));

		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.refreshFile', async (node: LkNode) => {
			let fileName = path.posix.basename(node.uri.path);

			var lkFs = treeDataProvider.getModelFromUri(node.uri);
			if (lkFs) {
				lkFs.createDirectory(vscode.Uri.parse(lkFs.connection.scheme + ":/" + lkFs.connection.name + "/" + fileName + "/"));
				var dataSelect;
				var selectClause = "";
				switch (lkFs.connection.database) {
					case "Unidata":
						selectClause = "WITH @ID # \"_]\"";
						break;
					case "jBASE":
						selectClause = "WITH *A0 # \"$]\"";
						break;
				}
				var filePagination = "False";
				var fileRecPerPage = "5000";
				if (lkFs.connection.maxItemsPerFile) {
					var filePagination = "True";
					var fileRecPerPage = lkFs.connection.maxItemsPerFile.toString();
				}
				if (lkFs.connection.ondemand)
					dataSelect = { ORIGINAL_RECORDS: "False", CUSTOM_VARS: "", OUTPUT_FORMAT: "MV", ONLY_RECORD_ID: "True", FILE_NAME: fileName, SELECT_CLAUSE: selectClause, SORT_CLAUSE: "", DICT_CLAUSE: "", PRESELECT_CLAUSE: "", PAGINATION: filePagination, PAGE_NUMBER: "1", RECORDS_FOR_PAGE: fileRecPerPage };
				else
					dataSelect = { ORIGINAL_RECORDS: "False", CUSTOM_VARS: "", OUTPUT_FORMAT: "MV", ONLY_RECORD_ID: "False", FILE_NAME: fileName, SELECT_CLAUSE: selectClause, SORT_CLAUSE: "", DICT_CLAUSE: "", PRESELECT_CLAUSE: "", PAGINATION: filePagination, PAGE_NUMBER: "1", RECORDS_FOR_PAGE: fileRecPerPage };
				var respSelect = Utilities.requestJson(lkFs.connection.name, lkFs.connection.GetURL(), lkFs.connection.apikey, "select", dataSelect);
				if (respSelect && respSelect.COMMAND) {
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
									console.log("ERROR (" + lkFs.connection.name + "): Failer to write File: " + id + " in " + fileName)
								}
							}
							vscode.window.showInformationMessage(node.uri.fsPath + " READED");
						}
					}
				}
			}
			treeDataProvider.refresh();
		}));

		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.openItemList', async (node: LkNode) => {
			var list = await vscode.window.showInputBox({ prompt: 'Input your saved list name:' });
			if (list) {
				let fileName = path.posix.basename(node.uri.path);
				var lkFs = treeDataProvider.getModelFromUri(node.uri);
				if (lkFs) {
					var dataSelect = { ORIGINAL_RECORDS: "False", CUSTOM_VARS: "", OUTPUT_FORMAT: "MV", ONLY_RECORD_ID: "True", FILE_NAME: fileName, SELECT_CLAUSE: "", SORT_CLAUSE: "", DICT_CLAUSE: "", PRESELECT_CLAUSE: "GET.LIST " + list };
					var respSelect = Utilities.requestJson(lkFs.connection.scheme, lkFs.connection.GetURL(), lkFs.connection.apikey, "select", dataSelect);
					if (respSelect && respSelect.COMMAND) {
						var lkdataSelect = new LkData(respSelect.COMMAND);
						var errorSelect = lkdataSelect.OutputDataElements.get(LkData.ERRORS_KEY);
						if (errorSelect)
							vscode.window.showErrorMessage(errorSelect);
						else {
							var lstids = lkdataSelect.OutputDataElements.get(LkData.RECORD_ID_KEY);
							if (lstids) {
								var ids = lstids.split("\x1E");
								var j = 0;
								for (j = 0; j < ids.length; j++) {
									var id = ids[j];
									try {
										await this.openResource(vscode.Uri.parse(lkFs.connection.scheme + ":/" + lkFs.connection.name + "/" + fileName + "/" + id), treeDataProvider);
									}
									catch (error) {
										console.log("ERROR (" + lkFs.connection.name + "): Failer to open Item: " + id + " in " + fileName)
									}
								}
							}
						}
					}
				}
			}
		}));

		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.editDicts', (node: LkNode) => {
			var lkFs = treeDataProvider.getModelFromUri(node.uri);
			var dictionariesForm = new DictionariesForm(context, lkFs.connection);
			let fileName = path.posix.basename(node.uri.path);
			dictionariesForm.load(fileName);
		}));

		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.editDictsFrom', async (node: LkNode) => {
			var item = await vscode.window.showInputBox({ prompt: 'File name:' });
			if (item) {
				var lkFs = treeDataProvider.getModelFromUri(node.uri);
				var dictionariesForm = new DictionariesForm(context, lkFs.connection);
				dictionariesForm.load(item);
			}
		}));

		//ITEMS
		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.renameItem', async (node: LkNode) => {
			var finalError = undefined;
			var isDirty = false;
			for (var editor of vscode.window.visibleTextEditors) {
				if (editor.document.uri.scheme == node.uri.scheme && editor.document.uri.fsPath == node.uri.fsPath && editor.document.isDirty) {
					isDirty = true;
					break;
				}
			}
			if (isDirty) {
				vscode.window.showErrorMessage("You must save or revert file before rename");
			}
			else {
				var lkFs = treeDataProvider.getModelFromUri(node.uri);
				let basename = path.posix.basename(node.uri.path);
				let parent = lkFs._lookupParentDirectory(node.uri);
				//READ
				var readedrecord = "";
				if (lkFs.connection.ondemand) {
					var content = new Uint8Array(0);
					var dataReadRecs = Buffer.from(basename).toString('base64');
					var dataRead = { CALCULATED: "False", DICTIONARIES: "False", CONVERSION: "False", FORMAT_SPEC: "False", ORIGINAL_RECORDS: "False", CUSTOM_VARS: "", OUTPUT_FORMAT: "MV", FILE_NAME: parent.name, DICT_CLAUSE: "", RECORDS: dataReadRecs };
					var resp = Utilities.requestJson(lkFs.connection.name, lkFs.connection.GetURL(), lkFs.connection.apikey, "read", dataRead);
					if (resp && resp.COMMAND) {
						var lkdata = new LkData(resp.COMMAND);
						var error = lkdata.OutputDataElements.get(LkData.ERRORS_KEY);
						if (error) {
							finalError = error;
						}
						readedrecord = lkdata.OutputDataElements.get(LkData.RECORD_KEY);
					}
					else
						finalError = "Unexpected error";
				}
				else {
					var readedbuff = lkFs._lookupAsFile(node.uri, false).data;
					readedrecord = new TextDecoder("utf-8").decode(readedbuff);
					readedrecord = readedrecord.replace(new RegExp('\r\n', 'gi'), '\xFE');
					readedrecord = readedrecord.replace(new RegExp('\r', 'gi'), '\xFE');
					readedrecord = readedrecord.replace(new RegExp('\n', 'gi'), '\xFE');
				}

				if (finalError) {
					vscode.window.showErrorMessage(finalError);
					return;
				}
				var item = await vscode.window.showInputBox({ prompt: 'New name:' });

				if (item) {
					//WRITENEW					
					var dataNewRecs = Buffer.from(item + "\x1C" + readedrecord).toString('base64');
					var dataNew = { READ_AFTER: "False", CALCULATED: "False", DICTIONARIES: "False", CONVERSION: "False", FORMAT_SPEC: "False", ORIGINAL_RECORDS: "False", OPTIMISTIC_LOCK: "False", CUSTOM_VARS: "", INPUT_FORMAT: "MV", OUTPUT_FORMAT: "MV", FILE_NAME: parent.name, RECORD_IDS: dataNewRecs };
					var resp = Utilities.requestJson(lkFs.connection.name, lkFs.connection.GetURL(), lkFs.connection.apikey, "new", dataNew);
					if (resp && resp.COMMAND) {
						var lkdata = new LkData(resp.COMMAND);
						var error = lkdata.OutputDataElements.get(LkData.ERRORS_KEY);
						if (error) {
							vscode.window.showErrorMessage(error);
						}
						else {
							var itemuri = vscode.Uri.parse(lkFs.connection.scheme + ":/" + lkFs.connection.name + "/" + parent.name + "/" + item);
							if (lkFs.connection.ondemand) {
								lkFs.writeFile(itemuri, new Uint8Array(0), { create: true, overwrite: true, isNew: false, onDemand: lkFs.connection.ondemand });
							}
							else {
								var data = Buffer.from(readedrecord.replace(new RegExp('\xFE', 'gi'), "\r\n"));
								lkFs.writeFile(itemuri, data, { create: true, overwrite: true, isNew: false, onDemand: lkFs.connection.ondemand });
							}

							//DELETE
							await lkFs.delete(node.uri);
							for (var editor of vscode.window.visibleTextEditors) {
								if (editor.document.uri.scheme == node.uri.scheme && editor.document.uri.fsPath == node.uri.fsPath) {
									editor.hide()
									break;
								}
							}

							treeDataProvider.refresh();

							await this.openResource(itemuri, treeDataProvider);

						}
					}
					else
						vscode.window.showErrorMessage("Unexpected error");
				}
			}
		}));

		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.saveAsItem', async (nodeOrUri: LkNode | vscode.Uri) => {
			var uri: vscode.Uri;
			var fromTree = false;
			if (!nodeOrUri) {
				if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document)
					uri = vscode.window.activeTextEditor.document.uri;
			}
			else if (nodeOrUri instanceof vscode.Uri)
				uri = nodeOrUri;
			else {
				uri = nodeOrUri.uri;
				fromTree = true;
			}
			if (uri) {
				var item = await vscode.window.showInputBox({ prompt: 'Save as:' });

				if (item) {
					var lkFs = treeDataProvider.getModelFromUri(uri);
					let parent = lkFs._lookupParentDirectory(uri);

					var buffer;
					var record;
					var newRecord;
					var readError = "";

					var isOpened = false;
					for (var editor of vscode.window.visibleTextEditors) {
						if (editor.document.uri.scheme == uri.scheme && editor.document.uri.fsPath == uri.fsPath) {
							isOpened = true;
							break;
						}
					}

					if (isOpened) {
						record = vscode.window.activeTextEditor.document.getText();
						buffer = Buffer.from(record);
						newRecord = record.replace(new RegExp('\r\n', 'gi'), '\xFE');
						newRecord = newRecord.replace(new RegExp('\r', 'gi'), '\xFE');
						newRecord = newRecord.replace(new RegExp('\n', 'gi'), '\xFE');
					}
					else {
						if (lkFs.connection.ondemand) {
							let basename = path.posix.basename(uri.path);
							var dataReadRecs = Buffer.from(basename).toString('base64');
							var dataRead = { CALCULATED: "False", DICTIONARIES: "False", CONVERSION: "False", FORMAT_SPEC: "False", ORIGINAL_RECORDS: "False", CUSTOM_VARS: "", OUTPUT_FORMAT: "MV", FILE_NAME: parent.name, DICT_CLAUSE: "", RECORDS: dataReadRecs };
							var resp = Utilities.requestJson(lkFs.connection.name, lkFs.connection.GetURL(), lkFs.connection.apikey, "read", dataRead);
							if (resp && resp.COMMAND) {
								var lkdataRead = new LkData(resp.COMMAND);
								newRecord = lkdataRead.OutputDataElements.get(LkData.RECORD_KEY);
								record = newRecord.replace(new RegExp('\xFE', 'gi'), "\r\n")
								buffer = Buffer.from(record);
							} else {
								readError = "ERROR (" + uri.fsPath + "): Failed to read";
							}
						}
						else {
							buffer = lkFs._lookupAsFile(uri, false).data;
							record = new TextDecoder("utf-8").decode(buffer);
							newRecord = record.replace(new RegExp('\r\n', 'gi'), '\xFE');
							newRecord = newRecord.replace(new RegExp('\r', 'gi'), '\xFE');
							newRecord = newRecord.replace(new RegExp('\n', 'gi'), '\xFE');
						}
					}
					if (readError) {
						vscode.window.showErrorMessage(readError);
					}
					else {
						var fn = parent.name;
						var id = item;
						if (item.indexOf(" ") != -1) {
							fn = item.substring(0, item.lastIndexOf(" "));
							id = item.substring(item.lastIndexOf(" ") + 1);
						}
						var itemuri = vscode.Uri.parse(lkFs.connection.scheme + ":/" + lkFs.connection.name + "/" + fn + "/" + id);
						var dataNewRecs = Buffer.from(id + "\x1C" + newRecord).toString('base64');
						var dataNew = { READ_AFTER: "False", CALCULATED: "False", DICTIONARIES: "False", CONVERSION: "False", FORMAT_SPEC: "False", ORIGINAL_RECORDS: "False", OPTIMISTIC_LOCK: "False", CUSTOM_VARS: "", INPUT_FORMAT: "MV", OUTPUT_FORMAT: "MV", FILE_NAME: fn, RECORDS: dataNewRecs };
						var respWrite = Utilities.requestJson(lkFs.connection.name, lkFs.connection.GetURL(), lkFs.connection.apikey, "new", dataNew);
						if (respWrite && respWrite.COMMAND) {
							var lkdata = new LkData(respWrite.COMMAND);
							var error = lkdata.OutputDataElements.get(LkData.ERRORS_KEY);
							if (error) {
								vscode.window.showErrorMessage(error);
							}
							else {
								lkFs.writeFile(itemuri, buffer, { create: true, overwrite: true, isNew: false, onDemand: lkFs.connection.ondemand });
								vscode.window.showTextDocument(itemuri);
								treeDataProvider.refresh();
							}
						}
						else
							vscode.window.showErrorMessage("ERROR (" + itemuri.fsPath + "): Failed to write");
					}
				}
			}
		}));

		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.deleteItem', async (nodeOrUri: LkNode | vscode.Uri) => {
			var uri;
			var closeFile = false;
			if (!nodeOrUri) {
				if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document) {
					uri = vscode.window.activeTextEditor.document.uri;
					closeFile = true;
				}
			}
			else if (nodeOrUri instanceof vscode.Uri) {
				uri = nodeOrUri;
				closeFile = true;
			}
			else
				uri = nodeOrUri.uri;
			if (uri)
				vscode.window.showInformationMessage('Are you sure?', 'Delete', 'Cancel').then(async selection => {
					if (selection == "Delete") {
						var lkfsp = treeDataProvider.getModelFromUri(uri);
						await lkfsp.delete(uri);
						for (var editor of vscode.window.visibleTextEditors) {
							if (editor.document.uri.scheme == uri.scheme && editor.document.uri.fsPath == uri.fsPath) {
								editor.hide()
								break;
							}
						}
						treeDataProvider.refresh();
					}
				});
		}));

		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.writeBasicProgram', async (uri: vscode.Uri) => {
			var _uri;
			if (!uri) {
				if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document && vscode.window.activeTextEditor.document.languageId == "mvbasic") {
					_uri = vscode.window.activeTextEditor.document.uri;
					await vscode.window.activeTextEditor.document.save();
				}
			}
			else {
				for (var editor of vscode.window.visibleTextEditors) {
					if (editor.document.uri.scheme == uri.scheme && editor.document.uri.fsPath == uri.fsPath) {
						_uri = editor.document.uri;
						await editor.document.save();
						break;
					}
				}
			}

			if (_uri) {
				let basename = path.posix.basename(_uri.path);
				let dirname = _uri.with({ path: path.posix.dirname(_uri.path) });
				let filename = path.posix.basename(dirname.path);

				var linkarFs = treeDataProvider.getModelFromUri(_uri);
				if (linkarFs) {
					this.Compile(linkarFs, filename, basename);
				}
			}
		}));

		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.writeBasicCatalogProgram', async (uri: vscode.Uri) => {
			var _uri;
			if (!uri) {
				if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document && vscode.window.activeTextEditor.document.languageId == "mvbasic") {
					_uri = vscode.window.activeTextEditor.document.uri;
					await vscode.window.activeTextEditor.document.save();
				}
			}
			else {
				for (var editor of vscode.window.visibleTextEditors) {
					if (editor.document.uri.scheme == uri.scheme && editor.document.uri.fsPath == uri.fsPath) {
						_uri = editor.document.uri;
						await editor.document.save();
						break;
					}
				}
			}
			if (_uri) {
				let basename = path.posix.basename(_uri.path);
				let dirname = _uri.with({ path: path.posix.dirname(_uri.path) });
				let filename = path.posix.basename(dirname.path);

				var linkarFs = treeDataProvider.getModelFromUri(_uri);
				if (linkarFs) {
					if (this.Compile(linkarFs, filename, basename))
						this.Catalog(linkarFs, filename, basename);
				}
			}
		}));

		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.basicProgram', async (nodeOrUri: LkNode | vscode.Uri) => {
			var uri;
			if (!nodeOrUri) {
				if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document && vscode.window.activeTextEditor.document.languageId == "mvbasic")
					uri = vscode.window.activeTextEditor.document.uri;
			}
			else if (nodeOrUri instanceof vscode.Uri)
				uri = nodeOrUri;
			else
				uri = nodeOrUri.uri;
			if (uri) {
				let basename = path.posix.basename(uri.path);
				let dirname = uri.with({ path: path.posix.dirname(uri.path) });
				let filename = path.posix.basename(dirname.path);

				var linkarFs = treeDataProvider.getModelFromUri(uri);
				if (linkarFs) {
					this.Compile(linkarFs, filename, basename);
				}
			}
		}));
		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.catalogProgram', async (nodeOrUri: LkNode | vscode.Uri) => {
			var uri;
			if (!nodeOrUri) {
				if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document && vscode.window.activeTextEditor.document.languageId == "mvbasic")
					uri = vscode.window.activeTextEditor.document.uri;
			}
			else if (nodeOrUri instanceof vscode.Uri)
				uri = nodeOrUri;
			else if (nodeOrUri)
				uri = nodeOrUri.uri;
			if (uri) {
				let basename = path.posix.basename(uri.path);
				let dirname = uri.with({ path: path.posix.dirname(uri.path) });
				let filename = path.posix.basename(dirname.path);

				var linkarFs = treeDataProvider.getModelFromUri(uri);
				if (linkarFs) {
					this.Catalog(linkarFs, filename, basename);
				}
			}
		}));
		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.insertValueMark', async () => {
			if (vscode.window.activeTextEditor)
				vscode.window.activeTextEditor.insertSnippet(new vscode.SnippetString(String.fromCharCode(253)));
		}));
		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.insertSubvalueMark', async () => {
			if (vscode.window.activeTextEditor)
				vscode.window.activeTextEditor.insertSnippet(new vscode.SnippetString(String.fromCharCode(252)));
		}));
		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.insertTextMark', async () => {
			if (vscode.window.activeTextEditor)
				vscode.window.activeTextEditor.insertSnippet(new vscode.SnippetString(String.fromCharCode(251)));
		}));

		context.subscriptions.push(vscode.commands.registerCommand('fileExplorer.searchInOtherFile', async (uri: vscode.Uri) => {

			if (uri) {
				let basename = path.posix.basename(uri.path);
				let dirname = uri.with({ path: path.posix.dirname(uri.path) });
				let filename = path.posix.basename(dirname.path);

				var linkarFs = treeDataProvider.getModelFromUri(uri);
				if (linkarFs) {
					let parts = uri.path.split('/');
					let entry: Entry = linkarFs.root;
					var connnode = entry.entries.get(parts[1]) as Directory;
					let items: vscode.QuickPickItem[] = [];
					connnode.entries.forEach(child => {
						items.push({
							label: child.name,
							description: child.name
						});
					});
					vscode.window.showQuickPick(items, { canPickMany: false }).then(selection => {
						if (!selection) {
							return;
						}

						var newuri = vscode.Uri.parse(linkarFs.connection.scheme + ":/" + linkarFs.connection.name + "/" + selection.label + "/" + parts[3]);
						vscode.window.showTextDocument(newuri, { preview: false });
					});
				}
			}
		}));
	}

	private async openResource(resource: vscode.Uri, treeDataProvider: ConnectionsTree): Promise<void> {
		try {
			var lkfsp = treeDataProvider.getModelFromUri(resource);
			lkfsp.FillFile(resource, true);
			try {
				vscode.window.showTextDocument(resource, { preview: false });
			}
			catch (iternalerror) {
				vscode.window.showErrorMessage(iternalerror);
			}
		}
		catch (err) {
			vscode.window.showErrorMessage(err);
		}
	}

	private LoadModels(): LkFileSystemProvider[] {
		var models: LkFileSystemProvider[] = [];
		var config = vscode.workspace.getConfiguration();
		var connections = config.get('linkar.connections') as Connection[];

		var j = 0;
		for (j = 0; j < connections.length; j++) {
			var conn = connections[j];
			var lkfs = new LkFileSystemProvider(conn);
			models.push(lkfs);
			vscode.workspace.registerFileSystemProvider(lkfs.connection.scheme, lkfs, { isCaseSensitive: true });
			if (conn.autoconnect) {
				lkfs.load();
			}
		}
		return models;
	}

	private Compile(linkarFs: LkFileSystemProvider, filename: string, basename: string): boolean {
		var isOk: boolean = false;
		var cmd = linkarFs.connection.basiccmd + " " + filename + " " + basename + " " + linkarFs.connection.basicarg;
		var dataExecute = { STATEMENT: cmd, CUSTOM_VARS: "", OUTPUT_FORMAT: "MV" };
		var resp = Utilities.requestJson(linkarFs.connection.name, linkarFs.connection.GetURL(), linkarFs.connection.apikey, "execute", dataExecute);
		if (resp && resp.COMMAND) {
			var lkdata = new LkData(resp.COMMAND);
			var error = lkdata.OutputDataElements.get(LkData.ERRORS_KEY);
			if (error) {
				vscode.window.showErrorMessage(error);
			}
			else {
				var capturing = lkdata.OutputDataElements.get(LkData.CAPTURING_KEY);
				if (capturing) {
					FileExplorer.outputChannel.clear();
					FileExplorer.outputChannel.appendLine(capturing.replace(new RegExp('\xFE', 'gi'), "\r\n"));
					FileExplorer.outputChannel.show();
					isOk = true;
				}
			}
		}
		else
			vscode.window.showErrorMessage("Unexpected error");
		return isOk;
	}

	private Catalog(linkarFs: LkFileSystemProvider, filename: string, basename: string): boolean {
		var isOk: boolean = false;
		var cmd = linkarFs.connection.catalogcmd + " " + filename + " " + basename + " " + linkarFs.connection.catalogarg;
		var dataExecute = { STATEMENT: cmd, CUSTOM_VARS: "", OUTPUT_FORMAT: "MV" };
		var resp = Utilities.requestJson(linkarFs.connection.name, linkarFs.connection.GetURL(), linkarFs.connection.apikey, "execute", dataExecute);
		if (resp && resp.COMMAND) {
			var lkdata = new LkData(resp.COMMAND);
			var error = lkdata.OutputDataElements.get(LkData.ERRORS_KEY);
			if (error) {
				vscode.window.showErrorMessage(error);
			}
			else {
				var capturing = lkdata.OutputDataElements.get(LkData.CAPTURING_KEY);
				if (capturing) {
					FileExplorer.outputChannel.clear();
					FileExplorer.outputChannel.appendLine(capturing.replace(new RegExp('\xFE', 'gi'), "\r\n"));
					FileExplorer.outputChannel.show();
					isOk = true;
				}
			}
		}
		else
			vscode.window.showErrorMessage("Unexpected error");
		return isOk;
	}


}
