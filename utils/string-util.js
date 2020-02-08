
'use strict';

class StringUtil {
    /**
    * @param {string} str
    * @returns {Array.<string>}
    */
    static splitToTokens(str) {
        return str
            .split(/[\s,]+/)
            .filter(z => z != '');
    }

    /**
    * @param {number} length
    * @param {string} indentChar
    * @returns {string}
    */
    static createLine(length, indentChar) {
        let str = '';
        while (length > 0) {
            str += indentChar;
            length--;
        }
        return str;
    }

    /**
    * @param {string} str
    * @param {Array.<string>} chars
    * @returns {string}
    */
    static trimAny(str, chars) {
        let start = 0;
        let end = str.length;

        while (start < end && chars.indexOf(str[start]) >= 0) {
            ++start;
        }

        while (end > start && chars.indexOf(str[end - 1]) >= 0) {
            --end;
        }

        return (start > 0 || end < str.length) ? str.substring(start, end) : str;
    }
}

module.exports.StringUtil = StringUtil;