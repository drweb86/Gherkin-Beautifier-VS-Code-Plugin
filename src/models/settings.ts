import { KeywordIndent } from "./keyword-indent";

export interface Settings {
    indentChar: string;
    startingSymbolToIndentsNumberMapping: KeywordIndent[];
    validations: {
        tags: string[] | undefined;
        complainIfThenTextDontHaveThisWord: string | undefined;
    }
}
