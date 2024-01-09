// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Settings } from './models/settings';
import { SettingsProvider } from './services/settings-provider';
import { StringUtil } from './utils/string-util';
import { FileHelper } from './helpers/file-helper';
import { ValidationService } from './services/validation-service';
import { TablesFormatter } from './services/tables-formatter';
import { FormatterService } from './services/formatter-service';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.workspace.onWillSaveTextDocument(willSaveTextDocument));
}

function willSaveTextDocument(e: vscode.TextDocumentWillSaveEvent) {

	const textEditor = vscode.window.activeTextEditor;
	if (!textEditor) {
		return null;
	}

	const document = e.document;
	if (!FileHelper.isFeatureFile(document)) {
		return null;
	}

	if (textEditor.document.uri.toString() !== document.uri.toString()) {
		return null;
	}

	// settings could have been changed, so we gotta reread them.
	const settingsProvider = new SettingsProvider();
	const settings = settingsProvider.settings;
	const validationService = new ValidationService();

	textEditor.edit(editBuilder => {
		fixAll(document, editBuilder, settings);

		validationService.validate(document, settings);
	});
}

function fixAll(document: vscode.TextDocument, editBuilder: vscode.TextEditorEdit, settings: Settings): void {
	const lines: string[] = [];

	for (let i = 0; i < document.lineCount; i++) {
		lines.push(document.lineAt(i).text);
	}

	const updatedText = FormatterService.getUpdatedText(settings, lines);

	// update
	for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
		const line = lines[lineNumber];
		const fixedLine = updatedText[lineNumber];
		if (line != fixedLine) {
			editBuilder.replace(
				new vscode.Range(lineNumber, 0, lineNumber, line.length),
				fixedLine
			);
		}
	}
}
