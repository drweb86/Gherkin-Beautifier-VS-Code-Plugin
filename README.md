# Gherkin Beautifier VS Code Plugin
The plugin for Visual Studio Code that beautifies the Gherkin / Cucumber .feature files on saving them. Located at https://marketplace.visualstudio.com/items?itemName=siarheikuchuk.gherkin-beautifier-vs-code-plugin.

![Demostration of using this extension](https://raw.githubusercontent.com/drweb86/Gherkin-Beautifier-VS-Code-Plugin/master/demo.gif)

## Usage
Plugin will be invoked upon saving the .feature file.

### Settings

You can put settings in the .workspace or .vscode file of your projects, so all your team will get them.

#### Indentation

| Setting                                  | Description                                                      | Default value  |
| ---------------------------------------- |:----------------------------------------------------------------:| --------------:|
| conf.view.indentSymbol                   | What identation symbol to use (tab or space)                     |          space |
| conf.view.identsBefore.Feature           | How many identation symbols to insert before 'Feature'           |              0 |
| conf.view.identsBefore.Rule              | How many identation symbols to insert before 'Rule'              |              4 |
| conf.view.identsBefore.Scenario          | How many identation symbols to insert before 'Scenario'          |              8 |
| conf.view.identsBefore.Examples          | How many identation symbols to insert before 'Examples'          |              8 |
| conf.view.identsBefore.Background        | How many identation symbols to insert before 'Background'        |              8 |
| conf.view.identsBefore.ScenarioOutline   | How many identation symbols to insert before 'Scenario Outline'  |              8 |
| conf.view.identsBefore.ScenarioTemplate  | How many identation symbols to insert before 'Scenario Template' |              8 |
| conf.view.identsBefore.Given             | How many identation symbols to insert before 'Given'             |             12 |
| conf.view.identsBefore.When              | How many identation symbols to insert before 'When'              |             13 |
| conf.view.identsBefore.Then              | How many identation symbols to insert before 'Then'              |             13 |
| conf.view.identsBefore.And               | How many identation symbols to insert before 'And'               |             14 |
| conf.view.identsBefore.But               | How many identation symbols to insert before 'But'               |             14 |
| conf.view.identsBefore.At                | How many identation symbols to insert before 'At'                |              8 |
| conf.view.identsBefore.Table             | How many identation symbols to insert before 'Table'             |             18 |

#### Validation

| Setting                     | Description                                                                                                                                                                                                                            | Default value  |
| ----------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:| --------------:|
| conf.view.validate.tags     | Validates if all tags are from allowed tags list and show warning messages upon saving feature files. How to specify tags? Example 1: @debug @important-component. Example 2: @debug, @important-component                             |                |
| conf.view.validate.tagsFile | Validates if all tags are from allowed tags list and show warning messages upon saving feature files. List of tags is specified by file. In a file tags should go one per line. Path to file is resolved relative to workspace folder  |                |

## Change log
* 3.0.0 (2020-02-10): 
Tags validation from file
* 2.0.0 (2020-02-08): 
Plugin settings are reloaded on save. So upon switching branch with different settings/loading other projects, tool will load them.
Full Gherkin language (en) support.
Tags validation
* 1.0.0 (2020-02-02): Initial release

## Contributions
Love this extension? [Star](https://github.com/drweb86/Gherkin-Beautifier-VS-Code-Plugin/stargazers) us!

Want to make this extension even more awesome? [Send us your wish](https://github.com/drweb86/Gherkin-Beautifier-VS-Code-Plugin/issues/new/).

Hate how it is working? [File an issue](https://github.com/drweb86/Gherkin-Beautifier-VS-Code-Plugin/issues/new/) to us.
