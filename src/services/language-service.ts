import * as languages from '../data/gherkin-languages.json'; // Languages were taken from Cucumber project under MIT License https://raw.githubusercontent.com/cucumber/cucumber/master/gherkin/gherkin-languages.json
import { LanguageTerm } from '../models/keywords';

export class LanguageService {
    public getTranslations(keyword: LanguageTerm): string[] {
        const allTranslations: string[] = [];

        Object.entries(languages).forEach(([, language]) => {
            const translations: string[] = language[keyword];
            allTranslations.push(...translations);
        });

        const mask = '* ';
        return allTranslations
            .filter(item => item != mask)
            .map(item => item.trim());
    }
}