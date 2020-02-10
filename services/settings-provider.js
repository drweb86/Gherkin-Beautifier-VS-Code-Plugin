
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
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.Feature'), indentChar)
            },
            {
                prefix: 'Rule',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.Rule'), indentChar)
            },
            {
                prefix: 'Scenario',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.Scenario'), indentChar)
            },
            {
                prefix: 'Examples',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.Examples'), indentChar)
            },
            {
                prefix: 'Background',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.Background'), indentChar)
            },
            {
                prefix: 'Scenario Outline',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.ScenarioOutline'), indentChar)
            },
            {
                prefix: 'Scenario Template',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.ScenarioTemplate'), indentChar)
            },
            {
                prefix: 'Given',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.Given'), indentChar)
            },
            {
                prefix: 'When',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.When'), indentChar)
            },
            {
                prefix: 'Then',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.Then'), indentChar)
            },
            {
                prefix: 'And',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.And'), indentChar)
            },
            {
                prefix: 'But',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.But'), indentChar)
            },
            {
                prefix: '@',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.At'), indentChar)
            },
            {
                prefix: '|',
                prefixIndents: StringUtil.createLine(+configuration.get('conf.view.identsBefore.Table'), indentChar)
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
            const items = fs.readFileSync(validateTagsFile).toString().split("\n");
            items.forEach(item => {
                let trimmedItem = StringUtil.trimAny(item, ['\r', ' ']);
                if (trimmedItem === '') {
                    return;
                }
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