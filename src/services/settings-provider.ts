import { Settings } from '../models/settings';
import { StringUtil } from '../utils/string-util';
import * as vscode from 'vscode';
import fs = require('fs');
import { KeywordIndent } from '../models/keyword-indent';

export class SettingsProvider {
    private readNumberSetting(configuration: vscode.WorkspaceConfiguration, settingName: string, defualtValue: number): number {
        return configuration.get<number>(settingName) ?? defualtValue;
    }

    getSettings(): Settings {
        const configuration = vscode.workspace.getConfiguration();
        const indentChar = configuration.get('conf.view.indentSymbol') === 'tab' ? '\t' : ' ';
        const startingSymbolToIndentsNumberMapping: KeywordIndent[] = [
            {
                prefix: 'Feature',
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.Feature', 0), indentChar),
                isRelative: false,
            },
            {
                prefix: 'Rule',
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.Rule', 4), indentChar),
                isRelative: false,
            },
            {
                prefix: 'Scenario',
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.Scenario', 8), indentChar),
                isRelative: false,
            },
            {
                prefix: 'Examples',
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.Examples', 8), indentChar),
                isRelative: false,
            },
            {
                prefix: 'Background',
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.Background', 8), indentChar),
                isRelative: false,
            },
            {
                prefix: 'Scenario Outline',
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.ScenarioOutline', 8), indentChar),
                isRelative: false,
            },
            {
                prefix: 'Scenario Template',
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.ScenarioTemplate', 8), indentChar),
                isRelative: false,
            },
            {
                prefix: 'Given',
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.Given', 12), indentChar),
                isRelative: false,
            },
            {
                prefix: 'When',
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.When', 13), indentChar),
                isRelative: false,
            },
            {
                prefix: 'Then',
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.Then', 13), indentChar),
                isRelative: false,
            },
            {
                prefix: 'And',
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.And', 14), indentChar),
                isRelative: false,
            },
            {
                prefix: 'But',
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.But', 14), indentChar),
                isRelative: false,
            },
            {
                prefix: '@',
                prefixIndents: isNaN(configuration.get<any>('conf.view.identsBefore.Tag') ?? '') ?
                    undefined :
                    StringUtil.createLine(
                        this.readNumberSetting(configuration, 'conf.view.identsBefore.Tag', 4), indentChar),
                isRelative: configuration.get('conf.view.identsBefore.Tag') == 'relative',
            },
            {
                prefix: '|',
                prefixIndents: StringUtil.createLine(
                    this.readNumberSetting(configuration, 'conf.view.identsBefore.Table', 18), indentChar),
                isRelative: false,
            },
        ];

        const validateTags = StringUtil.splitToTokens(configuration.get<string>('conf.view.validate.tags') ?? '');
        let validateTagsFile = StringUtil.trimAny(configuration.get<string>('conf.view.validate.tagsFile') ?? '', [' ']);
        if (validateTagsFile !== '') {
            validateTagsFile = vscode.workspace.rootPath + '/' + validateTagsFile;
            if (!fs.existsSync(validateTagsFile)) {
                const complaint = `File does not exist ${validateTagsFile}.`;
                vscode.window.showErrorMessage(complaint);
            }
            const items = fs.readFileSync(validateTagsFile).toString().split("\n");
            items.forEach(item => {
                let trimmedItem = StringUtil.trimAny(item, ['\r', ' ']);
                if (trimmedItem === '') {
                    return;
                }
                if (!trimmedItem.startsWith('@')) {
                    trimmedItem = `@${trimmedItem}`;
                }
                validateTags.push(trimmedItem);
            });
        }

        return {
            indentChar,
            startingSymbolToIndentsNumberMapping,
            validateTags: validateTags.length === 0 ? undefined : validateTags
        };
    }
}
