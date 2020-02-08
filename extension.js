'use strict';

const vscode = require('vscode');
const { Settings } = require('./models/settings');
const { SettingsProvider } = require('./services/settings-provider');
const { StringUtil } = require('./utils/string-util');

function activate(context) {
  context.subscriptions.push(vscode.workspace.onWillSaveTextDocument(willSaveTextDocument));
}
exports.activate = activate;

function willSaveTextDocument(e) {
  const textEditor = vscode.window.activeTextEditor;
  if (!textEditor) {
    return null;
  }

  const document = e.document;
  if (!isFeatureFile(document)) {
    return null;
  }

  if (textEditor.document.uri.toString() !== document.uri.toString()) {
    return null;
  }

  // settings could have been changed, so we gotta reread them.
  const settingsProvider = new SettingsProvider();
  const settings = settingsProvider.getSettings();

  textEditor.edit(editBuilder => {
    fixAll(document, editBuilder, settings);
  });
}

function isFeatureFile(document) {
  return document.uri.fsPath.endsWith('.feature');
}

function fixAll(document, editBuilder, settings) {
  for (let lineNumber = 0, lineCount = document.lineCount; lineNumber < lineCount; lineNumber++) {
    const line = document.lineAt(lineNumber).text;
    const fixedLine = applyFormatting(line, settings);

    if (line != fixedLine) {
      editBuilder.replace(
        new vscode.Range(lineNumber, 0, lineNumber, line.length),
        fixedLine
      );
    }
  }
}

function deactivate() { };
exports.deactivate = deactivate;

/**
 * @param {string} line
 * @param {Settings} settings
 */
function applyFormatting(line, settings) {
  const updatedLine = StringUtil.trimAny(line, ['\t', ' ']);
  for (let i = 0; i < settings.startingSymbolToIndentsNumberMapping.length; i++) {
    const replacement = settings.startingSymbolToIndentsNumberMapping[i];
    if (updatedLine.startsWith(replacement.prefix)) {
      return replacement.prefixIndents + updatedLine;
    }
  }

  return line;
}
