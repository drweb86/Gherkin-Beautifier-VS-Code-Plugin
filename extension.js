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
    console.log(1);
    fixAll(document, editBuilder, settings);

    if (settings.validateTags) {
      validateTags(document, settings.validateTags);
    }
  });
}

function isFeatureFile(document) {
  return document.uri.fsPath.endsWith('.feature');
}

function fixAll(document, editBuilder, settings) {
  const text = [];
  const textToReplace = [];

  // populate
  for (let lineNumber = 0, lineCount = document.lineCount; lineNumber < lineCount; lineNumber++) {
    const line = document.lineAt(lineNumber).text;
    // @ts-ignore
    text.push(line);

    const trimmedLine = StringUtil.trimAny(line, ['\t', ' ']);
    // @ts-ignore
    textToReplace.push(trimmedLine);
  }

  // Basic Updates
  for (let lineNumber = 0; lineNumber < text.length; lineNumber++) {
    textToReplace[lineNumber] = applyBasicFormatting(textToReplace[lineNumber], settings);
  }

  // Relative Updates
  for (let lineNumber = 0; lineNumber < text.length; lineNumber++) {
    textToReplace[lineNumber] = applyRelativeFormatting(textToReplace, textToReplace[lineNumber], lineNumber, settings);
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

function validateTags(document, allowedTags) {
  const allTagsInFile = [];

  for (let lineNumber = 0, lineCount = document.lineCount; lineNumber < lineCount; lineNumber++) {
    let line = document.lineAt(lineNumber).text;
    line = StringUtil.trimAny(line, ['\t', ' ']);
    if (line.startsWith('@')) {
      allTagsInFile.push(...StringUtil.splitToTokens(line));
    }
  }

  const notAllowedTags = allTagsInFile.filter(z => allowedTags.indexOf(z) === -1);
  if (notAllowedTags.length === 0) {
    return;
  }
  const complaint = `${notAllowedTags.join(', ')} tag(s) are not allowed. Allowed tags are ${allowedTags.join(', ')} (adjust setting conf.view.validate.tags / conf.view.validate.tagsFile).`;
  vscode.window.showErrorMessage(complaint);
}

function deactivate() { };
exports.deactivate = deactivate;


/**
 * @param {string[]} lines
 * @param {string} line
 * @param {Settings} settings
 */
function applyRelativeFormatting(lines, line, linePos, settings) {
  const updatedLine = line;
  for (let i = 0; i < settings.startingSymbolToIndentsNumberMapping.length; i++) {
    const replacement = settings.startingSymbolToIndentsNumberMapping[i];
    if (!replacement.isRelative ||
      !updatedLine.startsWith(replacement.prefix)) {
      continue;
    }

    const relativeLine = findFirstDifferentLine(lines, linePos + 1, replacement.prefix);
    if (relativeLine == undefined) {
      continue;
    }

    const prefix = getPrefix(relativeLine);
    return prefix + line;
  }

  return line;
}

function getPrefix(line) {
  const trimmedLine = StringUtil.trimAny(line, ['\t', ' ']);
  return line.substr(0, line.length - trimmedLine.length);
}

function findFirstDifferentLine(lines, startIndex, prefix) {
  for (let j = startIndex; j < lines.length; j++) {
    if (lines[j] != '' &&
      !lines[j].startsWith(prefix)) {
      return lines[j];
    }
  }
  return undefined;
}

/**
 * @param {string} line
 * @param {Settings} settings
 */
function applyBasicFormatting(line, settings) {
  const updatedLine = line;
  for (let i = 0; i < settings.startingSymbolToIndentsNumberMapping.length; i++) {
    const replacement = settings.startingSymbolToIndentsNumberMapping[i];
    if (replacement.prefixIndents == undefined ||
      replacement.isRelative ||
      !updatedLine.startsWith(replacement.prefix)) {
      continue;
    }

    return replacement.prefixIndents + updatedLine;
  }

  return line;
}
