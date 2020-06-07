import { KeywordIndent } from "./keyword-indent";

export interface Settings {
    indentChar: string;
    startingSymbolToIndentsNumberMapping: KeywordIndent[];
    validateTags: string[] | undefined;
}
