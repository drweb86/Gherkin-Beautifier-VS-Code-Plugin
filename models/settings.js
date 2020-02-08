'use strict';

class Settings {
    constructor(indentChar, startingSymbolToIndentsNumberMapping, validateTags) {
        this.indentChar = indentChar;
        this.startingSymbolToIndentsNumberMapping = startingSymbolToIndentsNumberMapping;
        this.validateTags = validateTags;
    }
}

module.exports.Settings = Settings;