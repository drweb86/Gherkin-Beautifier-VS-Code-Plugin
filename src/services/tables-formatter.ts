import { StringUtil } from '../utils/string-util';

class Table {
    constructor(
        public readonly startsFromLineIndex: number,
        public readonly linesCount: number,
        public readonly markdown: string[],
    ) {
    }

    public autoformat(): void {
        // calculate cell sizes for each row

        // check that each row has same amount of cells

        // if not - complain

        // if yes - add spaces before and after column title, cell according to spaces

        // and create replace mapping.

    }
}

export class TablesFormatter {
    public format(markdown: string[]): void {
        const tables = this.findTables(markdown);

        // format each table
    }

    private findTables(markdown: string[]): Table[] {
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

        return tables;
    }
}

const exampleData = [
    "   | table 1 - col 1 | table 1 - col 2| ",
    "   | val1 | val2| ",
    "",
    "   | table 2 - col 1 | table 2 - col 2| ",
    "   | val1 | val2| ",
    "",
    "   | table 3 - col 1 | table 3 - col 2| ",
    "   | val1 | val2| ",
];

const formatter = new TablesFormatter();
formatter.format(exampleData);

exampleData.forEach(console.log);