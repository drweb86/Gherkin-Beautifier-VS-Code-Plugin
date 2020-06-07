import * as vscode from 'vscode';

export class FileHelper {
    public static isFeatureFile(document: vscode.TextDocument): boolean {
        return document.uri.fsPath.endsWith('.feature');
    }
}