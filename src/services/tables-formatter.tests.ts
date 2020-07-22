import { TablesFormatter } from "./tables-formatter";

const exampleData = [
    "   | table 1 - col 1 | table 1 - col 2| ",
    "   | val1 | val2| ",
    "",
    " | table 2 - col 1 | table 2 - col 2| ",
    " | val1 | val2| ",
    "",
    "| table 3 - col 1 | table 3 - col 2| ",
    "| val1 | val2| ",
];

const formatter = new TablesFormatter();
formatter.format(exampleData);
console.log(exampleData);

// Executing the tests:
// nodemon --watch 'src/**/*.ts' --ignore 'src/**/*.spec.ts' --exec 'ts-node' ./src/services/tables-formatter.tests.ts