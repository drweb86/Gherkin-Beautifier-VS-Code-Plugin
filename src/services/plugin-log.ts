export class PluginLog {
    static log(message?: string, ...optionalParams: any[]): void {
        console.log(`[Gherkin-Beautifier-VS-Code-Plugin] ${message}`, optionalParams);
    }

    static error(message?: string, ...optionalParams: any[]): void {
        console.error(`[Gherkin-Beautifier-VS-Code-Plugin] ${message}`, optionalParams);
    }
}