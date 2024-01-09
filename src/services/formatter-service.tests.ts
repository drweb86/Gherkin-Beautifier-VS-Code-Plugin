import { FormatterService } from "./formatter-service";
import { Settings } from '../models/settings';

const settings: Settings = {
    docString: 3,
    indentChar: " ",
    startingSymbolToIndentsNumberMapping: [],
    tableAutoformat: false,
    validations: {
        complainIfThenTextDontHaveThisWord: "",
        tags: [],
    }
};

const sourceText = [
    "test",
    "\"\"\"",
    "test",
    "\"\"\"",
    "\"\"\"",
    " where",
    "\"\"\"",
    "  \"\"\"",
    "where",
    "  \"\"\"",
    "     \"\"\"",
    " where",
    "     \"\"\"",
    "     \"\"\"",
    "        where",
    "     \"\"\"",
];

const updatedText = FormatterService.getUpdatedText(settings, sourceText);
sourceText.forEach((x, i)  => console.info(`"${sourceText[i].padEnd(15)}"=>"${updatedText[i].padEnd(15)}"`));

// Executing the tests:
// nodemon --watch 'src/**/*.ts' --ignore 'src/**/*.spec.ts' --exec 'ts-node' ./src/services/formatter-service.tests.ts