import * as vscode from 'vscode';
import * as path from 'path';
import fs = require("fs");
import { workspace, ExtensionContext } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient';
import { FileExplorer } from './fileExplorer';

let client: LanguageClient;

var customWordColor: any;
var customWordlist: string;
var customWordPath: any;
var logLevel: string;

var margin: number;
var indent: number;
var formattingEnabled: boolean;

export function activate(context: ExtensionContext) {

	// Load config straight away
	loadServerConfig();

	// Function to pull user's configs into our local variables
	function loadServerConfig() {
		margin = vscode.workspace.getConfiguration("Linkar").get("margin");
		indent = vscode.workspace.getConfiguration("Linkar").get("indent");
		formattingEnabled = vscode.workspace.getConfiguration("Linkar").get("formattingEnabled");
		customWordColor = vscode.workspace.getConfiguration("Linkar").get("customWordColor");
		customWordlist = vscode.workspace.getConfiguration("Linkar").get("customWords");
		customWordPath = vscode.workspace.getConfiguration("Linkar").get("customWordPath");
		logLevel = vscode.workspace.getConfiguration("Linkar").get("trace.server", "off");
	}

	// Reload the config if changes are made
	vscode.workspace.onDidChangeConfiguration(event => {
		if (event.affectsConfiguration("Linkar")) {
			loadServerConfig();
		}
	});

	let timeout: NodeJS.Timer | null = null;
	var customWordDict = new Map();

	if (customWordPath != "") {
		var contents = fs.readFileSync(customWordPath, 'utf8')
		customWordlist = "(";
		var lines = contents.replace('\r', '').split('\n');
		for (let i = 0; i < lines.length; i++) {
			let parts = lines[i].split(':')
			if (parts.length >= 2) {
				customWordDict.set(parts[0].replace("\"", "").replace("\"", ""), parts[1].replace("\"", "").replace("\"", ""))
				customWordlist += parts[0].replace("\"", '').replace("\"", "") + "|";
			}
		}
		if (customWordlist.length > 1)
			customWordlist = customWordlist.substr(0, customWordlist.length - 1) + ")";

	}

	//========== LSP ===============

	// The server is implemented in node
	let serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [
			{ language: 'mvbasic' }
		],
		synchronize: {
			// Synchronize the setting section 'languageServerExample' to the server
			configurationSection: 'Linkar',
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'linkarbasic',
		'Linkar BASIC Server',
		serverOptions,
		clientOptions
	);

	//==============================

	new FileExplorer(context);

	// Start the client. This will also launch the server
	client.start();


	vscode.languages.registerDocumentFormattingEditProvider('mvbasic', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			// first work out indents
			// regex for statements that start a block
			var edits: vscode.TextEdit[] = []

			if (formattingEnabled) {
				let rBlockStart = new RegExp("^(begin case$|lock |key\\(|if |evaluate |commit |rollback |readnext |open |write |writeu |writev |writevu |read |readv |readu |readt |readvu |matreadu |locate |locate\\(|openseq |matread |create |readlist |openpath |find |findstr |bscan)", "i")
				let rBlockAlways = new RegExp("^(for |try|loop( |$))", "i")
				let rBlockContinue = new RegExp(" (then|else|case|on error|locked)$", "i")
				let rBlockEnd = new RegExp("^(end|end case|next|next\\s+.+|repeat)$| repeat$", "i")
				let rBlockCase = new RegExp("^begin case$", "i")
				let rBlockEndCase = new RegExp("^end case$", "i")
				let rBlockTransaction = new RegExp("^(begin transaction|begin work)", "i")
				let rBlockEndTransaction = new RegExp("^(end transaction|end work)", "i")
				let rElseEnd = new RegExp("^end else\\s+?.+?", "i")
				let rCatchEnd = new RegExp("^(catch( |$))", "i");
				let rLabel = new RegExp("^([\\w\\.\\$]+:(?!=)|[0-9\\.]+)");
				let rComment = new RegExp("^\\s*(\\*|!|REM\\s+?).*", "i")
				let tComment = new RegExp(";\\s*(\\*|!|REM\\s+?).*", "i");
				let lComment = new RegExp("^\\s*([\\w\\.]+:(?!=)|[0-9\\.]+)(\\s*(\\*|!|REM\\s+?).*)", "i") // a label with comments after
				let qStrings = new RegExp("'.*?'|\".*?\"|\\\\.*?\\\\", "g");
				let rParenthesis = new RegExp("\\(.*\\)", "g");
				if (indent === undefined) { indent = 3 }
				if (margin === undefined) { margin = 5 }

				// first build a list of labels in the program and indentation levels
				let Level = 0
				var RowLevel: number[] = []
				for (var i = 0; i < document.lineCount; i++) {

					let curLine = document.lineAt(i);
					let line = curLine.text;

					// replace comment line with blank line
					line = line.replace(rComment, "");

					// remove comments after label (no semi-colon)
					if (lComment.test(line)) {
						let comment = lComment.exec(line);
						line = comment![1];
					}

					// remove trailing comments with a semi-colon
					line = line.replace(tComment, "");

					// replace contents of parenthesis with spaces, maintaining original
					// character positions for intellisense error highlighting.
					let v = rParenthesis.exec(line);
					if (v !== null) {
						let value = "(" + " ".repeat(v[0].length - 2) + ")";
						line = line.replace(rParenthesis, value);
					}

					// replace contents of quoted strings with spaces, maintaining original
					// character positions for intellisense error highlighting.
					v = qStrings.exec(line);
					if (v !== null) {
						let value = "'" + " ".repeat(v[0].length - 2) + "'";
						line = line.replace(qStrings, value);
					}

					// Trim() leading & trailing spaces
					line = line.trim();

					// check opening and closing block for types
					// check block statements
					var position = i
					RowLevel[i] = Level

					if (rBlockStart.test(line)) {
						Level++
						if (!rBlockContinue.test(line)) {
							// single line statement
							Level--
						}
						position = i + 1
					}
					if (rBlockCase.test(line)) {
						// increment to cater for case statement
						Level++
						position = i + 1
					}
					if (rBlockEndCase.test(line)) {
						// decrement to cater for case statement
						Level--
					}
					if (rElseEnd.test(line)) {
						// decrement 1 to cater for end else stements
						Level--
					}
					if (rCatchEnd.test(line)) {
						// decrement 1 to cater for catch stements
						RowLevel[position] = Level -1;
						position = i + 1
					}
					if (rBlockTransaction.test(line)) {
						// increment for transaction statement
						Level++
						position = i + 1
					}
					if (rBlockEndTransaction.test(line)) {
						// decrement for transaction statement
						Level--
					}
					if (rBlockAlways.test(line.trim())) {
						Level++
						position = i + 1
					}
					if (rBlockEnd.test(line.trim())) {
						Level--
						position = i
					}
					RowLevel[position] = Level
				}

				// Output formatted lines
				for (var i = 0; i < document.lineCount; i++) {

					const line = document.lineAt(i);
					let lineText = line.text.trim();

					// ignore labels
					if (rLabel.test(lineText)) { continue }

					var indentation = 0

					if (RowLevel[i] === undefined) { continue; }

					indentation = (RowLevel[i] * indent) + margin
					if (new RegExp("(^case\\s)", "i").test(lineText)) {
						indentation -= indent
					}
					if (new RegExp("(^while\\s|^until\\s)", "i").test(lineText)) {
						indentation -= indent
					}

					// remove trailing comments with a semi-colon
					let tempLine = lineText.replace(tComment, "").trim();
					if (new RegExp("(^end else$)", "i").test(tempLine)) {
						indentation -= indent
					}

					var blankLine = lineText.replace(/\s/g, "")
					if (indentation < 1 || blankLine.length == 0) {
						edits.push(vscode.TextEdit.replace(line.range, lineText))
					}
					else {
						var formattedLine = " ".repeat(indentation) + lineText
						var formatted = vscode.TextEdit.replace(line.range, formattedLine)
						edits.push(formatted)
					}
				}
			}
			return edits
		}
	});

	// create a decorator type that we use to decorate large numbers
	const customDecoration = vscode.window.createTextEditorDecorationType({
		//cursor: 'crosshair',
		// use a themable color. See package.json for the declaration and default values.
		color: customWordColor
	});

	let activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	function triggerUpdateDecorations() {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(updateDecorations, 500);
	}

	function updateDecorations() {
		if (!activeEditor) {
			return;
		}
		if (customWordlist == "()") {
			return;
		}
		var regEx = new RegExp("\\b" + customWordlist + "\\b", "g");
		const text = activeEditor.document.getText();
		const customWords: vscode.DecorationOptions[] = [];
		let match;
		while (match = regEx.exec(text)) {
			const startPos = activeEditor.document.positionAt(match.index);
			const endPos = activeEditor.document.positionAt(match.index + match[0].length);
			var hover = customWordDict.get(match[0]);
			const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: hover };
			customWords.push(decoration)
		}
		activeEditor.setDecorations(customDecoration, customWords);
	}


}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}