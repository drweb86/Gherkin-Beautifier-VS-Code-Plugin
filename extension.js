'use strict';

const vscode = require('vscode');

function activate(context) {
  context.subscriptions.push(vscode.workspace.onWillSaveTextDocument(willSaveTextDocument));
}

function willSaveTextDocument(e) {
  if (!vscode.window.activeTextEditor) {
    return null;
  }

  const document = e.document;
  if (!isFeatureFile(document)) {
    return null;
  }

  const textEditor = vscode.window.activeTextEditor;
  if (!textEditor ||
    textEditor.document.uri.toString() !== document.uri.toString()) {
    return null;
  }

  textEditor.edit(editBuilder => {
    fixAll(document, editBuilder);
  });
}

function isFeatureFile(document) {
  return document.uri.fsPath.endsWith('.feature');
}

function fixAll(document, editBuilder) {
  for (let lineNumber = 0, lineCount = document.lineCount; lineNumber < lineCount; lineNumber++) {
    const line = document.lineAt(lineNumber).text;
    const fixedLine = applyFormatting(line);

    if (line != fixedLine) {
      editBuilder.replace(
        new vscode.Range(lineNumber, 0, lineNumber, line.length),
        applyFormatting(line)
      );
    }
  }
}

exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;

const identSymbol = vscode.workspace.getConfiguration().get('conf.view.indentSymbol') === 'tab' ? '\t' : ' ';
function createLine(length) {
  let str = '';
  while (length > 0) {
    str += identSymbol;
    length--;
  }
  return str;
}

const extensionStartingSymbolToIndentsNumberMapping = [
  {
    prefix: 'Feature',
    prefixIndents: createLine(+vscode.workspace.getConfiguration().get('conf.view.identsBefore.Feature'))
  },
  {
    prefix: 'Rule',
    prefixIndents: createLine(+vscode.workspace.getConfiguration().get('conf.view.identsBefore.Rule'))
  },
  {
    prefix: 'Scenario',
    prefixIndents: createLine(+vscode.workspace.getConfiguration().get('conf.view.identsBefore.Scenario'))
  },
  {
    prefix: 'Given',
    prefixIndents: createLine(+vscode.workspace.getConfiguration().get('conf.view.identsBefore.Given'))
  },
  {
    prefix: 'When',
    prefixIndents: createLine(+vscode.workspace.getConfiguration().get('conf.view.identsBefore.When'))
  },
  {
    prefix: 'Then',
    prefixIndents: createLine(+vscode.workspace.getConfiguration().get('conf.view.identsBefore.Then'))
  },
  {
    prefix: 'And',
    prefixIndents: createLine(+vscode.workspace.getConfiguration().get('conf.view.identsBefore.And'))
  },
  {
    prefix: 'But',
    prefixIndents: createLine(+vscode.workspace.getConfiguration().get('conf.view.identsBefore.But'))
  },
  {
    prefix: '@',
    prefixIndents: createLine(+vscode.workspace.getConfiguration().get('conf.view.identsBefore.At'))
  },
  {
    prefix: '|',
    prefixIndents: createLine(+vscode.workspace.getConfiguration().get('conf.view.identsBefore.Table'))
  },
];

function trimAny(str, chars) {
  var start = 0,
    end = str.length;

  while (start < end && chars.indexOf(str[start]) >= 0)
    ++start;

  while (end > start && chars.indexOf(str[end - 1]) >= 0)
    --end;

  return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}

function applyFormatting(line) {
  const updatedLine = trimAny(line, ['\t', ' ']);
  for (let i = 0; i < extensionStartingSymbolToIndentsNumberMapping.length; i++) {
    const replacement = extensionStartingSymbolToIndentsNumberMapping[i];
    if (updatedLine.startsWith(replacement.prefix)) {
      return replacement.prefixIndents + updatedLine;
    }
  }

  return line;
}

exports.applyFormatting = applyFormatting;