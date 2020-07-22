// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Settings } from './models/settings';
import { SettingsProvider } from './services/settings-provider';
import { StringUtil } from './utils/string-util';
import { FileHelper } from './helpers/file-helper';
import { ValidationService } from './services/validation-service';
import { TablesFormatter } from './services/tables-formatter';

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
	const text = [];
	const textToReplace = [];

	// populate
	for (let lineNumber = 0, lineCount = document.lineCount; lineNumber < lineCount; lineNumber++) {
		const line = document.lineAt(lineNumber).text;

		text.push(line);
		textToReplace.push(line);

		// trimming spaces for known prefixes.
		for (let i = 0; i < settings.startingSymbolToIndentsNumberMapping.length; i++) {
			const replacement = settings.startingSymbolToIndentsNumberMapping[i];

			const trimmedLine = StringUtil.trimAny(line, ['\t', ' ']);
			if (replacement.keywords.some(keyword => trimmedLine.startsWith(keyword))) {
				textToReplace[lineNumber] = trimmedLine;
				break;
			}
		}

	}

	// Basic Updates
	for (let lineNumber = 0; lineNumber < text.length; lineNumber++) {
		textToReplace[lineNumber] = applyBasicFormatting(textToReplace[lineNumber], settings);
	}

	// Relative Updates
	for (let lineNumber = 0; lineNumber < text.length; lineNumber++) {
		textToReplace[lineNumber] = applyRelativeFormatting(textToReplace, textToReplace[lineNumber], lineNumber, settings);
	}

	// Table Updates
	if (settings.tableAutoformat) {
		const tableFormatter = new TablesFormatter();
		tableFormatter.format(textToReplace);
	}

	// update
	for (let lineNumber = 0; lineNumber < text.length; lineNumber++) {
		const line = text[lineNumber];
		const fixedLine = textToReplace[lineNumber];
		if (line != fixedLine) {
			editBuilder.replace(
				new vscode.Range(lineNumber, 0, lineNumber, line.length),
				fixedLine
			);
		}
	}
}

function applyRelativeFormatting(lines: string[], line: string, linePos: number, settings: Settings): string {
	const updatedLine = line;
	for (let i = 0; i < settings.startingSymbolToIndentsNumberMapping.length; i++) {
		const replacement = settings.startingSymbolToIndentsNumberMapping[i];
		if (!replacement.isRelative ||
			!replacement.keywords.some(keyword => updatedLine.startsWith(keyword))) {
			continue;
		}

		const relativeLine = findFirstDifferentLine(lines, linePos + 1, replacement.keywords);
		if (relativeLine == undefined) {
			continue;
		}

		const prefix = getPrefix(relativeLine);
		return prefix + line;
	}

	return line;
}

function getPrefix(line: string): string {
	const trimmedLine = StringUtil.trimAny(line, ['\t', ' ']);
	return line.substr(0, line.length - trimmedLine.length);
}

function findFirstDifferentLine(lines: string[], startIndex: number, prefixes: string[]): string | undefined {
	for (let j = startIndex; j < lines.length; j++) {
		if (lines[j] != '' &&
			!prefixes.some(keyword => lines[j].startsWith(keyword))) {
			return lines[j];
		}
	}
	return undefined;
}

function applyBasicFormatting(line: string, settings: Settings): string {
	const updatedLine = line;
	for (let i = 0; i < settings.startingSymbolToIndentsNumberMapping.length; i++) {
		const replacement = settings.startingSymbolToIndentsNumberMapping[i];
		if (replacement.prefixIndents == undefined ||
			replacement.isRelative ||
			!replacement.keywords.some(keyword => updatedLine.startsWith(keyword))) {
			continue;
		}

		return replacement.prefixIndents + updatedLine;
	}

	return line;
}
