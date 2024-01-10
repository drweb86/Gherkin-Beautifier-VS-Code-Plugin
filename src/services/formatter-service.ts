import { Settings } from "../models/settings";
import { StringUtil } from "../utils/string-util";
import { TablesFormatter } from "./tables-formatter";

export class FormatterService {
    public static getUpdatedText(settings: Settings, lines: string[]): string[] {
        const textToReplace: string[] = [];
        const docStringMarker = '"""';
        const docStringLines: number[] = [];
        const trimmedChars = ['\t', ' '];

        // populate
        let isInsideDocString = false;
        let docStringPositionDiff = 0;
        for (let lineNumber = 0, lineCount = lines.length; lineNumber < lineCount; lineNumber++) {
            const line = lines[lineNumber];

            textToReplace.push(line);
            const trimmedLine = StringUtil.trimAny(line, trimmedChars);

            const isDocStringMarkerLine = trimmedLine.startsWith(docStringMarker);
            if (isDocStringMarkerLine) {
                docStringLines.push(lineNumber);
                isInsideDocString = !isInsideDocString;
                if (isInsideDocString) {
                    docStringPositionDiff = settings.docString - (line.length - trimmedLine.length);
                }
            }

            if (isDocStringMarkerLine) {
                textToReplace[lineNumber] = StringUtil.createLine(settings.docString, settings.indentChar) + trimmedLine;
            } else if (isInsideDocString) {
                docStringLines.push(lineNumber);
                    if (docStringPositionDiff < 0) {
                        textToReplace[lineNumber] = StringUtil.trimStart(textToReplace[lineNumber], trimmedChars, -docStringPositionDiff);
                    } else if (docStringPositionDiff > 0) {
                        textToReplace[lineNumber] = StringUtil.createLine(docStringPositionDiff, settings.indentChar) + textToReplace[lineNumber];
                    }

                    if (textToReplace[lineNumber].indexOf(trimmedLine) < settings.docString) {
                        textToReplace[lineNumber] = StringUtil.createLine(settings.docString, settings.indentChar) + trimmedLine;
                    }
            } else {

                // trimming spaces for known prefixes.
                for (let i = 0; i < settings.startingSymbolToIndentsNumberMapping.length; i++) {
                    const replacement = settings.startingSymbolToIndentsNumberMapping[i];
                    
                    if (replacement.keywords.some(keyword => trimmedLine.startsWith(keyword))) {
                        textToReplace[lineNumber] = trimmedLine;
                        break;
                    }
                }
            }
        }

        // Basic Updates
        for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
            if (docStringLines.includes(lineNumber)) {
                continue;
            }

            textToReplace[lineNumber] = FormatterService.applyBasicFormatting(textToReplace[lineNumber], settings);
        }
        
        // Relative Updates
        for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
            if (docStringLines.includes(lineNumber)) {
                continue;
            }

            textToReplace[lineNumber] = FormatterService.applyRelativeFormatting(textToReplace, textToReplace[lineNumber], lineNumber, settings);
        }

        // Table Updates
        if (settings.tableAutoformat) {
            const tableFormatter = new TablesFormatter();
            tableFormatter.format(textToReplace);
        }

        return textToReplace;
    }

    private static applyRelativeFormatting(lines: string[], line: string, linePos: number, settings: Settings): string {
        const updatedLine = line;
        for (let i = 0; i < settings.startingSymbolToIndentsNumberMapping.length; i++) {
            const replacement = settings.startingSymbolToIndentsNumberMapping[i];
            if (!replacement.isRelative ||
                !replacement.keywords.some(keyword => updatedLine.startsWith(keyword))) {
                continue;
            }
    
            const relativeLine = this.findFirstDifferentLine(lines, linePos + 1, replacement.keywords);
            if (relativeLine == undefined) {
                continue;
            }
    
            const prefix = this.getPrefix(relativeLine);
            return prefix + line;
        }
    
        return line;
    }
    
    private static getPrefix(line: string): string {
        const trimmedLine = StringUtil.trimAny(line, ['\t', ' ']);
        return line.substr(0, line.length - trimmedLine.length);
    }
    
    private static findFirstDifferentLine(lines: string[], startIndex: number, prefixes: string[]): string | undefined {
        for (let j = startIndex; j < lines.length; j++) {
            if (lines[j] != '' &&
                !prefixes.some(keyword => lines[j].startsWith(keyword))) {
                return lines[j];
            }
        }
        return undefined;
    }
    
    private static applyBasicFormatting(line: string, settings: Settings): string {
        const updatedLine = line;
        for (let i = 0; i < settings.startingSymbolToIndentsNumberMapping.length; i++) {
            const replacement = settings.startingSymbolToIndentsNumberMapping[i];
            if (replacement.prefixIndents == undefined ||
                replacement.isRelative ||
                !replacement.keywords.some(keyword => updatedLine.startsWith(keyword))) {
                continue;
            }
    
            return replacement.prefixIndents + updatedLine;
        }
    
        return line;
    }
}