export class PluginLog {
    static log(message?: string, ...optionalParams: any[]): void {
        console.log(`[Gherkin-Beautifier-VS-Code-Plugin] ${message}`, optionalParams);
    }
}