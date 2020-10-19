import * as vscode from 'vscode';

export class ScenarioExplorerNode extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        private version: string,
        collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label}-${this.version}`;
        this.description = this.version;
    }
}