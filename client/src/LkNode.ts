import * as vscode from 'vscode';

export interface LkNode {

	uri: vscode.Uri;
	nodeType: string; //c - connection, f - file, r - register
	type: vscode.FileType;

}