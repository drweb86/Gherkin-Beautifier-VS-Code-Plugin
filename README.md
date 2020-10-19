# Gherkin Beautifier VS Code Plugin
The multilingual plugin for Visual Studio Code that beautifies the Gherkin / Cucumber .feature files on saving them. Located at https://marketplace.visualstudio.com/items?itemName=siarheikuchuk.gherkin-beautifier-vs-code-plugin.

![Demostration of using this extension](https://raw.githubusercontent.com/drweb86/Gherkin-Beautifier-VS-Code-Plugin/master/demo.gif)

Shows explorer tree of scenarios files.

## Usage
Plugin will be invoked upon saving the .feature file.

### Settings

You can put settings in the .workspace or .vscode file of your projects, so all your team will get them.

#### Indentation

| Setting                                  | Description                                                                                                     | Default value  |
| ---------------------------------------- |:---------------------------------------------------------------------------------------------------------------:| --------------:|
| conf.view.indentSymbol                   | What identation symbol to use (tab or space)                                                                    |          space |
| conf.view.identsBefore.Feature           | How many identation symbols to insert before 'Feature'                                                          |              0 |
| conf.view.identsBefore.Rule              | How many identation symbols to insert before 'Rule'                                                             |              4 |
| conf.view.identsBefore.Scenario          | How many identation symbols to insert before 'Scenario'                                                         |              8 |
| conf.view.identsBefore.Examples          | How many identation symbols to insert before 'Examples'                                                         |              8 |
| conf.view.identsBefore.Background        | How many identation symbols to insert before 'Background'                                                       |              8 |
| conf.view.identsBefore.ScenarioOutline   | How many identation symbols to insert before 'Scenario Outline'                                                 |              8 |
| conf.view.identsBefore.Given             | How many identation symbols to insert before 'Given'                                                            |             12 |
| conf.view.identsBefore.When              | How many identation symbols to insert before 'When'                                                             |             13 |
| conf.view.identsBefore.Then              | How many identation symbols to insert before 'Then'                                                             |             13 |
| conf.view.identsBefore.And               | How many identation symbols to insert before 'And'                                                              |             14 |
| conf.view.identsBefore.But               | How many identation symbols to insert before 'But'                                                              |             14 |
| conf.view.identsBefore.Tag               | How many identation symbols to insert before @ tags. Allowed values: amount of indentation chars or 'relative'  |       relative |
| conf.view.identsBefore.Table             | How many identation symbols to insert before 'Table'                                                            |             18 |
| conf.view.table.autoformat               | Enables table autoformatting                                                                                    |           true |

#### Validation

| Setting                                                         | Description                                                                                                                                                                                                                            | Default value  |
| ----------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:| --------------:|
| conf.view.validate.tags                                         | Validates if all tags are from allowed tags list and show warning messages upon saving feature files. How to specify tags? Example 1: @debug @important-component. Example 2: @debug, @important-component                             |                |
| conf.view.validate.tagsFile                                     | Validates if all tags are from allowed tags list and show warning messages upon saving feature files. List of tags is specified by file. In a file tags should go one per line. Path to file is resolved relative to workspace folder  |                |
| gherkin-beautifier.validate.complainIfThenTextDontHaveThisWord  | Validates if phrase in 'then' part of script contains the specified keyword (for example 'should', like Then Apple should be eaten). If word is missing, a warning will be shown, but script will be saved                             |                |

## Change log

* 7.0.0 (2020-10-19)
Add Tree View of feature / rules / scenarios.
* 6.0.0 (2020-07-23)
Fix: Scnenario setting was outruling the Scenario Outline setting for English.
Table autoformatting was added, it is enabled by default (you can disable it with setting conf.view.table.autoformat).
* 5.0.0 (2020-06-07):
Migrate to TypeScript
Add support for languages. Languages were taken from Cucumber project under MIT License https://raw.githubusercontent.com/cucumber/cucumber/master/gherkin/gherkin-languages.json
conf.view.identsBefore.ScenarioTemplate was removed (it is a variant of English translation for conf.view.identsBefore.ScenarioOutline).
Setting 'gherkin-beautifier.validate.complainIfThenTextDontHaveThisWord' was added. It validates if phrase in 'then' part of script contains the specified keyword (for example 'should', like Then Apple should be eaten). If word is missing, a warning will be shown, but script will be saved. By default it is disabled.
* 4.0.0 (2020-05-17):
conf.view.identsBefore.At renamed to conf.view.identsBefore.Tags. Default value has changed to 'relative'.
* 3.0.0 (2020-02-10): 
Tags validation from file
* 2.0.0 (2020-02-08): 
Plugin settings are reloaded on save. So upon switching branch with different settings/loading other projects, tool will load them.
Full Gherkin language (en) support.
Tags validation
* 1.0.0 (2020-02-02): Initial release

## Development

Running extension
Press F5

Publishing
npm i -g vsce@latest
vsce package
vsce publish

PAT generation
1. https://dev.azure.com/SiarheiKuchuk/_usersSettings/tokens
2. Click New Token
3. Name should be 'gherkin-beautifier-vs-code-plugin'
4. Organization should be 'All accessible organizations'
4. Click Scopes \ Show all scopes \ Marketplace select Acquire+Publish, 
5. Click Create...
6. vsce login 'siarheikuchuk'

## Contributions
Love this extension? [Star](https://github.com/drweb86/Gherkin-Beautifier-VS-Code-Plugin/stargazers) us!

Want to make this extension even more awesome? [Send us your wish](https://github.com/drweb86/Gherkin-Beautifier-VS-Code-Plugin/issues/new/).

Hate how it is working? [File an issue](https://github.com/drweb86/Gherkin-Beautifier-VS-Code-Plugin/issues/new/) to us.
