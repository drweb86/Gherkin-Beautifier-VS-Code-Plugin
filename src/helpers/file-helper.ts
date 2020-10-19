import * as vscode from 'vscode';
import { PluginLog } from '../services/plugin-log';
import { readdir, readdirSync, stat, Stats, statSync } from 'fs';
import { join } from 'path';

export class FileHelper {
    private static isFeatureFileString(name: string): boolean {
        return name.endsWith('.feature');
    }

    public static isFeatureFile(document: vscode.TextDocument): boolean {
        return FileHelper.isFeatureFileString(document.uri.fsPath);
    }

    private static async info(fileEntry: string): Promise<Stats> {
        return await new Promise((resolve, reject) => stat(fileEntry, (error, stats) => {
            if (error) {
                reject(error);
            } else {
                resolve(stats);
            }
        }));
    }

    private static async getEntries(fileEntry: string): Promise<string[]> {
        return await new Promise((resolve, reject) => readdir(fileEntry, (error, files) => {
            if (error) {
                reject(error);
            } else {
                resolve(files);
            }
        }));
    }

    public static async getAllFiles(fileEntry: string): Promise<string[]> {
        try {
            const stats = await FileHelper.info(fileEntry);

            if (stats.isFile()) {
                return FileHelper.isFeatureFileString(fileEntry) ? [fileEntry] : [];
            }

            if (stats.isDirectory()) {
                const entries = await FileHelper.getEntries(fileEntry);
                const files = [];
                for (let i = 0; i < entries.length; i++) {
                    files.push(...await FileHelper.getAllFiles(join(fileEntry, entries[i])));
                }
                return files;
            }

            return [];

        } catch (error) {
            PluginLog.error(`Can't access entry ${fileEntry}. Ignoring...`, error);
            return [];
        }
    }
}