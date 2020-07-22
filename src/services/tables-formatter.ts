import { StringUtil } from '../utils/string-util';
import { PluginLog } from './plugin-log';

class Table {
    constructor(
        public readonly startsFromLineIndex: number,
        public readonly linesCount: number,
        public readonly markdown: string[],
    ) {
    }
}

export class TablesFormatter {
    public format(markdown: string[]): void {
        const tables = this.splitToTables(markdown);
        tables.forEach(TablesFormatter.tableFormat);
    }

    private static tableFormat(table: Table): void {
        const tableRows = table.markdown.slice(table.startsFromLineIndex, table.startsFromLineIndex + table.linesCount);

        const rows = tableRows
            .map(StringUtil.trim)
            .map(str => StringUtil.trimOnce(str, ['|']))
            .map(row => row
                .split('|')
                .map(StringUtil.trim));

        // check that each row has same amount of cells
        const isValidTable = rows.every(row => row.length == rows[0].length);

        // if not - complain
        if (!isValidTable) {
            PluginLog.log(`Table from index ${table.startsFromLineIndex} count ${table.linesCount} is invalid. Skipping.`);
            return;
        }

        // if yes - add 1 space before and 1 space after column title, cell according to spaces
        const columnsCount = rows[0].length;
        const desiredColumnWidths: number[] = [];
        const padLeft = 1;
        const padRightAtLeast = 1;
        const spacesToAdd = padLeft + padRightAtLeast;

        //   get desired widths
        for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
            let width = 0;
            for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                if (rows[rowIndex][columnIndex].length > width) {
                    width = rows[rowIndex][columnIndex].length;
                }
            }
            desiredColumnWidths.push(width + spacesToAdd);
        }

        //   append spaces to cells
        for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
            for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                rows[rowIndex][columnIndex] = StringUtil.addSpaces(rows[rowIndex][columnIndex], padLeft, desiredColumnWidths[columnIndex]);
            }
        }

        //   write them
        const firstTableOriginalRow = table.markdown[table.startsFromLineIndex];
        const rowSpacing = firstTableOriginalRow.substr(0, firstTableOriginalRow.indexOf('|'));

        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            table.markdown[table.startsFromLineIndex + rowIndex] = rowSpacing + '|' + rows[rowIndex].join('|') + '|';
        }
    }

    private splitToTables(markdown: string[]): Table[] {
        let isTableStarted = false;
        let tableStartIndex = -1;
        const tables: Table[] = [];

        for (let lineIndex = 0; lineIndex < markdown.length; lineIndex++) {
            const isTableRow = StringUtil.trimAny(markdown[lineIndex], ['\t', ' ']).startsWith('|');
            if (isTableRow) {
                if (!isTableStarted) {
                    isTableStarted = true;
                    tableStartIndex = lineIndex;
                }
            } else {
                if (isTableStarted) {
                    isTableStarted = false;
                    tables.push(new Table(tableStartIndex, lineIndex - tableStartIndex, markdown));
                }
            }
        }

        // handle case when table has ended in the EOF.
        if (isTableStarted) {
            tables.push(new Table(tableStartIndex, markdown.length - tableStartIndex, markdown));
        }

        return tables;
    }
}
