import { Settings } from '../models/settings';
import * as vscode from 'vscode';
import { StringUtil } from '../utils/string-util';
import { LanguageService } from './language-service';

export class ValidationService {
    public validate(document: vscode.TextDocument, settings: Settings) {
        if (settings.validations.tags) {
            this.validateTags(document, settings.validations.tags);
        }

        if (settings.validations.complainIfThenTextDontHaveThisWord) {
            this.validateComplainIfThenTextDontHaveThisWord(document, settings.validations.complainIfThenTextDontHaveThisWord);
        }
    }

    private validateComplainIfThenTextDontHaveThisWord(document: vscode.TextDocument, expectedWord: string) {
        const languageService = new LanguageService();
        const thenKeywords = languageService.getTranslations('then');
        const invalidLines: number[] = [];

        for (let lineNumber = 0, lineCount = document.lineCount; lineNumber < lineCount; lineNumber++) {
            let line = document.lineAt(lineNumber).text;
            line = StringUtil.trimAny(line, ['\t', ' ']);
            if (thenKeywords.some(keyword => line.startsWith(keyword)) &&
                !line.includes(expectedWord)) {
                invalidLines.push(lineNumber + 1);
            }
        }

        if (invalidLines.length > 0) {
            const numbers = invalidLines.length === 1 ? 'line number' : 'lines numbers';
            const complaint = `At ${numbers} ${invalidLines.join(', ')} keyword '${expectedWord}' was not found. Then should have ${expectedWord} according to setting gherkin-beautifier.validate.complainIfThenTextDontHaveThisWord.`;
            vscode.window.showErrorMessage(complaint);
        }
    }

    private validateTags(document: vscode.TextDocument, allowedTags: string[]): void {
        const allTagsInFile = [];

        for (let lineNumber = 0, lineCount = document.lineCount; lineNumber < lineCount; lineNumber++) {
            let line = document.lineAt(lineNumber).text;
            line = StringUtil.trimAny(line, ['\t', ' ']);
            if (line.startsWith('@')) {
                allTagsInFile.push(...StringUtil.splitToTokens(line));
            }
        }

        const notAllowedTags = allTagsInFile.filter(z => allowedTags.indexOf(z) === -1);
        if (notAllowedTags.length === 0) {
            return;
        }
        const tagsString = notAllowedTags.length === 1 ? 'tag is' : 'tags are';
        const complaint = `${notAllowedTags.join(', ')} ${tagsString} not allowed. Allowed tags are ${allowedTags.join(', ')} (adjust setting conf.view.validate.tags / conf.view.validate.tagsFile).`;
        vscode.window.showErrorMessage(complaint);
    }
}