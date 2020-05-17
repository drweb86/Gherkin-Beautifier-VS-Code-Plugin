
'use strict';

const vscode = require('vscode');
const fs = require('fs');
const { Settings } = require('../models/settings');
const { StringUtil } = require('../utils/string-util');

class SettingsProvider {

    /**
    * @returns {Settings}
    */
    getSettings() {
        const configuration = vscode.workspace.getConfiguration();
        const indentChar = configuration.get('conf.view.indentSymbol') === 'tab' ? '\t' : ' ';
        const startingSymbolToIndentsNumberMapping = [
            {
                prefix: 'Feature',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.Feature'), indentChar),
                isRelative: false,
            },
            {
                prefix: 'Rule',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.Rule'), indentChar),
                isRelative: false,
            },
            {
                prefix: 'Scenario',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.Scenario'), indentChar),
                isRelative: false,
            },
            {
                prefix: 'Examples',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.Examples'), indentChar),
                isRelative: false,
            },
            {
                prefix: 'Background',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.Background'), indentChar),
                isRelative: false,
            },
            {
                prefix: 'Scenario Outline',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.ScenarioOutline'), indentChar),
                isRelative: false,
            },
            {
                prefix: 'Scenario Template',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.ScenarioTemplate'), indentChar),
                isRelative: false,
            },
            {
                prefix: 'Given',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.Given'), indentChar),
                isRelative: false,
            },
            {
                prefix: 'When',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.When'), indentChar),
                isRelative: false,
            },
            {
                prefix: 'Then',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.Then'), indentChar),
                isRelative: false,
            },
            {
                prefix: 'And',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.And'), indentChar),
                isRelative: false,
            },
            {
                prefix: 'But',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.But'), indentChar),
                isRelative: false,
            },
            {
                prefix: '@',
                // @ts-ignore
                prefixIndents: isNaN(configuration.get('conf.view.identsBefore.Tag')) ?
                    undefined :
                    StringUtil.createLine(+configuration.get('conf.view.identsBefore.Tag'), indentChar),
                isRelative: configuration.get('conf.view.identsBefore.Tag') == 'relative',
            },
            {
                prefix: '|',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.Table'), indentChar),
                isRelative: false,
            },
        ];

        const validateTags = StringUtil.splitToTokens(configuration.get('conf.view.validate.tags'));
        let validateTagsFile = StringUtil.trimAny(configuration.get('conf.view.validate.tagsFile'), [' ']);
        if (validateTagsFile !== '') {
            validateTagsFile = vscode.workspace.rootPath + '/' + validateTagsFile;
            if (!fs.existsSync(validateTagsFile)) {
                const complaint = `File does not exist ${validateTagsFile}.`;
                vscode.window.showErrorMessage(complaint);
            }
            // @ts-ignore
            const items = fs.readFileSync(validateTagsFile).toString().split("\n");
            items.forEach(item => {
                let trimmedItem = StringUtil.trimAny(item, ['\r', ' ']);
                if (trimmedItem === '') {
                    return;
                }
                // @ts-ignore
                if (!trimmedItem.startsWith('@')) {
                    trimmedItem = `@${trimmedItem}`
                };
                validateTags.push(trimmedItem);
            })
        }

        return new Settings(
            indentChar,
            startingSymbolToIndentsNumberMapping,
            validateTags.length === 0 ? null : validateTags
        );
    }
}

module.exports.SettingsProvider = SettingsProvider;