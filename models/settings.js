'use strict';

class Settings {
    constructor(indentChar, startingSymbolToIndentsNumberMapping) {
        this.indentChar = indentChar;
        this.startingSymbolToIndentsNumberMapping = startingSymbolToIndentsNumberMapping;
    }
}

module.exports.Settings = Settings;