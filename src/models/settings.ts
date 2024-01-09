import { KeywordIndent } from "./keyword-indent";

export interface Settings {
    indentChar: string;
    startingSymbolToIndentsNumberMapping: KeywordIndent[];
    docString: number;
    tableAutoformat: boolean;
    validations: {
        tags: string[] | undefined;
        complainIfThenTextDontHaveThisWord: string | undefined;
    }
}
