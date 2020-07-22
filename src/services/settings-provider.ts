import { Settings } from '../models/settings';
import { StringUtil } from '../utils/string-util';
import * as vscode from 'vscode';
import fs = require('fs');
import { KeywordIndent } from '../models/keyword-indent';
import { LanguageService } from './language-service';

export class SettingsProvider {
    get settings(): Settings {

        const languageService = new LanguageService();

        const configuration = vscode.workspace.getConfiguration();
        const indentChar = configuration.get('conf.view.indentSymbol') === 'tab' ? '\t' : ' ';
        const tableAutoformat = this.readBooleanSetting(configuration, 'conf.view.table.autoformat', true);

        const startingSymbolToIndentsNumberMapping: KeywordIndent[] = [
            {
                keywords: languageService.getTranslations('feature'),
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.Feature', 0), indentChar),
                isRelative: false,
            },
            {
                keywords: languageService.getTranslations('rule'),
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.Rule', 4), indentChar),
                isRelative: false,
            },
            {
                keywords: languageService.getTranslations('examples'),
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.Examples', 8), indentChar),
                isRelative: false,
            },
            {
                keywords: languageService.getTranslations('background'),
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.Background', 8), indentChar),
                isRelative: false,
            },
            {
                keywords: languageService.getTranslations('scenarioOutline'),
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.ScenarioOutline', 8), indentChar),
                isRelative: false,
            },
            {
                keywords: languageService.getTranslations('scenario'),
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.Scenario', 8), indentChar),
                isRelative: false,
            },
            {
                keywords: languageService.getTranslations('given'),
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.Given', 12), indentChar),
                isRelative: false,
            },
            {
                keywords: languageService.getTranslations('when'),
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.When', 13), indentChar),
                isRelative: false,
            },
            {
                keywords: languageService.getTranslations('then'),
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.Then', 13), indentChar),
                isRelative: false,
            },
            {
                keywords: languageService.getTranslations('and'),
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.And', 14), indentChar),
                isRelative: false,
            },
            {
                keywords: languageService.getTranslations('but'),
                prefixIndents: StringUtil.createLine(this.readNumberSetting(configuration, 'conf.view.identsBefore.But', 14), indentChar),
                isRelative: false,
            },
            {
                keywords: ['@'],
                prefixIndents: isNaN(configuration.get<any>('conf.view.identsBefore.Tag') ?? '') ?
                    undefined :
                    StringUtil.createLine(
                        this.readNumberSetting(configuration, 'conf.view.identsBefore.Tag', 4), indentChar),
                isRelative: configuration.get('conf.view.identsBefore.Tag') == 'relative',
            },
            {
                keywords: ['|'],
                prefixIndents: StringUtil.createLine(
                    this.readNumberSetting(configuration, 'conf.view.identsBefore.Table', 18), indentChar),
                isRelative: false,
            },
        ];

        return {
            indentChar,
            startingSymbolToIndentsNumberMapping,
            tableAutoformat,
            validations: {
                tags: this.getValidateTags(configuration),
                complainIfThenTextDontHaveThisWord: this.getComplainIfThenTextDontHaveThisWordSetting(configuration),
            },
        };
    }

    private getValidateTags(configuration: vscode.WorkspaceConfiguration): string[] | undefined {
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

        return validateTags.length === 0 ? undefined : validateTags;
    }

    private getComplainIfThenTextDontHaveThisWordSetting(configuration: vscode.WorkspaceConfiguration): string | undefined {
        let complainIfThenTextDontHaveThisWord: string | undefined = StringUtil.trimAny(configuration.get<string>('gherkin-beautifier.validate.complainIfThenTextDontHaveThisWord') ?? '', ['\t', ' ']);
        if (!complainIfThenTextDontHaveThisWord) {
            complainIfThenTextDontHaveThisWord = undefined;
        }
        return complainIfThenTextDontHaveThisWord;
    }

    private readNumberSetting(configuration: vscode.WorkspaceConfiguration, settingName: string, defualtValue: number): number {
        return configuration.get<number>(settingName) ?? defualtValue;
    }

    private readBooleanSetting(configuration: vscode.WorkspaceConfiguration, settingName: string, defualtValue: boolean): boolean {
        return configuration.get<boolean>(settingName) ?? defualtValue;
    }
}
