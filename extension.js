'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const identSymbol = vscode.workspace.getConfiguration().get('conf.view.indentSymbol') === 'tab' ? '\t' : ' ';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "4to2" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(vscode.commands.registerTextEditorCommand('Gherkin-Beautifier-VS-Code-Plugin.beautify', function (textEditor, edit) {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    // vscode.window.showInformationMessage('Hello World!');
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

// this method is called when your extension is deactivated
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