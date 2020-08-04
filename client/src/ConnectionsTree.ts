import * as vscode from 'vscode';
import * as path from 'path';

import { LkNode } from './LkNode';
import { LkFileSystemProvider } from './lkSystemProvider';
import { Connection } from './connection';


export class ConnectionsTree implements vscode.TreeDataProvider<LkNode> {
	constructor(public models: LkFileSystemProvider[]) {

	}

	public _onDidChangeTreeData: vscode.EventEmitter<LkNode> = new vscode.EventEmitter<LkNode>();
	public readonly onDidChangeTreeData: vscode.Event<LkNode> = this._onDidChangeTreeData.event;


	getTreeItem(element: LkNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
		var treeItem;
		if (element) {
			treeItem = new vscode.TreeItem(element.uri, element.type === vscode.FileType.Directory ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
			if (element.type === vscode.FileType.File) {
				treeItem.command = { command: 'fileExplorer.openFile', title: "Open File", arguments: [element.uri] };
				treeItem.contextValue = 'record';
				var lkfsp = this.getModelFromUri(element.uri);
				let entry = lkfsp._lookupAsFile(element.uri, false);
				if (entry.isNew) {
					treeItem.iconPath = {
						light: path.join(__filename, '..', '..', 'resources', 'light', 'string.svg'),
						dark: path.join(__filename, '..', '..', 'resources', 'dark', 'string.svg')
					};
				}
				else {
					treeItem.iconPath = {
						light: path.join(__filename, '..', '..', 'resources', 'light', 'document.svg'),
						dark: path.join(__filename, '..', '..', 'resources', 'dark', 'document.svg')
					};
				}
			}
			else if (element.nodeType === "c") {
				var model = this.getModelFromUri(element.uri);
				if (model.initialized) {
					treeItem.contextValue = 'connection-load';
					treeItem.iconPath = {
						light: path.join(__filename, '..', '..', 'resources', 'light', 'database-active.svg'),
						dark: path.join(__filename, '..', '..', 'resources', 'dark', 'database-active.svg')
					};
				}
				else {
					treeItem.contextValue = 'connection-unload';
					treeItem.iconPath = {
						light: path.join(__filename, '..', '..', 'resources', 'light', 'database.svg'),
						dark: path.join(__filename, '..', '..', 'resources', 'dark', 'database.svg')
					};
				}
				treeItem.tooltip = model.connection.GetInfo();
				treeItem.description = model.connection.database;
			}
			else if (element.nodeType === "f") {
				treeItem.contextValue = 'file';
				treeItem.iconPath = {
					light: path.join(__filename, '..', '..', 'resources', 'light', 'folder.svg'),
					dark: path.join(__filename, '..', '..', 'resources', 'dark', 'folder.svg')
				};
			}
		}
		else {
			treeItem = undefined
		}
		return treeItem;
	}
	async getChildren(element?: LkNode): Promise<LkNode[]> {
		if (element) {
			var lkfsp = this.getModelFromUri(element.uri);
			if (lkfsp) {
				if (element.nodeType === "c") {
					if (lkfsp.initialized) {
						var children = await lkfsp.readDirectory(element.uri);
						var outNode: LkNode[] = children.map(([name, type]) => (
							{
								uri: vscode.Uri.parse(element.uri.scheme + "://" + element.uri.path + "/" + name),
								type: type,
								nodeType: "f"
							}
						));
						return outNode;
					}
					else
						return [];
				}
				else {
					const children = await lkfsp.readDirectory(element.uri);
					var outNode: LkNode[] = children.map(([name, type]) => (
						{
							uri: vscode.Uri.parse(element.uri.scheme + "://" + element.uri.path + "/" + name),
							type: type,
							nodeType: "r"
						}
					));
					return outNode.sort(function (a, b) {
						var textA = path.posix.basename(a.uri.path).toUpperCase();
						var textB = path.posix.basename(b.uri.path).toUpperCase();
						return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
					});
				}
			}
		}
		else {
			var roots: LkNode[] = [];
			var i = 0;
			for (i = 0; i < this.models.length; i++) {
				var root: LkNode = { uri: vscode.Uri.parse(this.models[i].connection.scheme + ":///" + this.models[i].connection.name), nodeType: "c", type: vscode.FileType.Directory };
				roots.push(root);
			}
			return roots.sort(function (a, b) {
				var textA = path.posix.basename(a.uri.path).toUpperCase();
				var textB = path.posix.basename(b.uri.path).toUpperCase();
				return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
			});
		}
		return [];
	}

	public refresh(element?: LkNode): void {
		this._onDidChangeTreeData.fire(element);
	}

	getModelFromUri(uri: vscode.Uri): LkFileSystemProvider {
		var lkfsp: LkFileSystemProvider;
		var i = 0;
		for (i = 0; i < this.models.length; i++) {
			var modeluri = vscode.Uri.parse(this.models[i].connection.scheme + ":///" + this.models[i].connection.name);
			if (modeluri.scheme === uri.scheme) {
				lkfsp = this.models[i];
				break;
			}
		}
		return lkfsp;
	}

	setModel(model: LkFileSystemProvider): boolean {
		var isOk = false;
		var i = 0;
		for (i = 0; i < this.models.length; i++) {
			var modeluri = vscode.Uri.parse(this.models[i].connection.scheme + ":///" + this.models[i].connection.name);
			if (modeluri.scheme === model.connection.scheme) {
				this.models[i] = model;
				isOk = true;
				break;
			}
		}
		return isOk;
	}

	deleteModel(model: LkFileSystemProvider): boolean {
		var isOk = false;
		var confs = vscode.workspace.getConfiguration();
		var conf = confs.get('linkar.connections') as Connection[];
		var i = 0;
		for (i = 0; i < conf.length; i++) {
			if (conf[i].scheme === model.connection.scheme) {
				break;
			}
		}
		conf.splice(i, 1);
		confs.update("linkar.connections", conf, vscode.ConfigurationTarget.Global);
		i = 0;
		for (i = 0; i < this.models.length; i++) {
			var modeluri = vscode.Uri.parse(this.models[i].connection.scheme + ":///" + this.models[i].connection.name);
			if (modeluri.scheme === model.connection.scheme) {
				break;
			}
		}
		this.models.splice(i, 1);
		return isOk;
	}

}