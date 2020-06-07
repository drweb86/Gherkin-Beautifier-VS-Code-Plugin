
export class StringUtil {

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
}
