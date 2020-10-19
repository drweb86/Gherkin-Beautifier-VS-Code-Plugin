import * as vscode from 'vscode';
import { FileHelper } from '../helpers/file-helper';
import { ScenarioExplorerNode } from '../models/scenario-explorer-node';

export class ScenariousExplorerProvider implements vscode.TreeDataProvider<ScenarioExplorerNode> {
    constructor(private workspaceRoots: readonly vscode.WorkspaceFolder[] | undefined) { }

    getTreeItem(element: ScenarioExplorerNode): vscode.TreeItem {
        return element;
    }

    public async getChildren(element?: ScenarioExplorerNode): Promise<ScenarioExplorerNode[]> {
        if (!this.workspaceRoots || !this.workspaceRoots.length) {
            vscode.window.showInformationMessage('Workspace is empty. Gherkin Beautifier Extension is looking for .feature files in all workspace folders and builds a tree.');
            return [];
        }

        if (!element) {
            vscode.window.showInformationMessage('Looking for scenarios...');

            const featureFiles: string[] = [];
            (await Promise.all(this.workspaceRoots
                .map(root => root.uri.fsPath)
                .map(FileHelper.getAllFiles)))
                .forEach(files => featureFiles.push(...files));

            // TODO: find folder roots and built-hierarchy from there.
            // folders \ subfolders \ files \ features \ scenarious
            // https://code.visualstudio.com/api/extension-guides/tree-view
            // TODO: traverse across trees

            // TODO: parse as needed
            return featureFiles
                .map(file => new ScenarioExplorerNode(file, '1', vscode.TreeItemCollapsibleState.None));
        }

        return [];

        // if (element) {
        //     return Promise.resolve(
        //         this.getDepsInPackageJson(
        //             path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')
        //         )
        //     );
        // } else {
        //     const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
        //     if (this.pathExists(packageJsonPath)) {
        //         return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
        //     } else {
        //         vscode.window.showInformationMessage('Workspace has no package.json');
        //         return Promise.resolve([]);
        //     }
        // }
    }
}
