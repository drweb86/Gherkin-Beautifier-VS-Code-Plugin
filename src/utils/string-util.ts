import { PluginLog } from '../services/plugin-log';

export class StringUtil {
    static addSpaces(str: string, padLeft: number, desiredWidth: number): string {
        return new Array(padLeft + 1).join(' ') +
            str +
            new Array((desiredWidth - str.length - padLeft) + 1).join(' ');
    }

    static splitToTokens(str: string): string[] {
        return str
            .split(/[\s,]+/)
            .filter(z => z != '');
    }

    static createLine(length: number, indentChar: string): string {
        let str = '';
        while (length > 0) {
            str += indentChar;
            length--;
        }
        return str;
    }

    static trim(str: string): string {
        return StringUtil.trimAny(str, ['\t', ' ']);
    }

    static trimAny(str: string, chars: string[]): string {
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

    static trimOnce(str: string, chars: string[]): string {
        let start = 0;
        let end = str.length;

        if (start < end && chars.indexOf(str[start]) >= 0) {
            ++start;
        }

        if (end > start && chars.indexOf(str[end - 1]) >= 0) {
            --end;
        }

        return (start > 0 || end < str.length) ? str.substring(start, end) : str;
    }
}
