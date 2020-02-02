'use strict';

const vscode = require('vscode');

const identSymbol = vscode.workspace.getConfiguration().get('conf.view.indentSymbol') === 'tab' ? '\t' : ' ';

function activate(context) {
  context.subscriptions.push(vscode.commands.registerTextEditorCommand('Gherkin-Beautifier-VS-Code-Plugin.beautify', function (textEditor, edit) {

    const fileName = vscode.window.activeTextEditor.document.uri.fsPath;
    if (!fileName.endsWith('.feature')) {
      return;
    }

    const document = textEditor.document;
    for (let lineNumber = 0, lineCount = document.lineCount; lineNumber < lineCount; lineNumber++) {
      const
        line = document.lineAt(lineNumber).text;

      edit.replace(
        new vscode.Range(lineNumber, 0, lineNumber, line.length),
        applyFormatting(line)
      );
    }
  }));
}

exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;

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
    prefix: 'When',
    prefixIndents: createLine(+vscode.workspace.getConfiguration().get('conf.view.identsBeforeWhen'))
  }
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