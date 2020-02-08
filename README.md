# Gherkin Beautifier VS Code Plugin
The plugin for Visual Studio Code that beautifies the Gherkin / Cucumber .feature files on saving them. Located at https://marketplace.visualstudio.com/items?itemName=siarheikuchuk.gherkin-beautifier-vs-code-plugin.

![Demostration of using this extension](https://raw.githubusercontent.com/drweb86/Gherkin-Beautifier-VS-Code-Plugin/master/demo.gif)

## Usage
Plugin will be invoked upon saving the .feature file.

### Settings

You can put settings in the .workspace or .vscode file of your projects, so all your team will get them.

| Setting                             | Description                                                 | Default value  |
| ----------------------------------- |:-----------------------------------------------------------:| --------------:|
| conf.view.indentSymbol              | What identation symbol to use (tab or space)                |          space |
| conf.view.identsBefore.Feature      | How many identation symbols to insert before 'Feature'      |              0 |
| conf.view.identsBefore.Rule         | How many identation symbols to insert before 'Rule'         |              4 |
| conf.view.identsBefore.Scenario     | How many identation symbols to insert before 'Scenario'     |              8 |
| conf.view.identsBefore.Given        | How many identation symbols to insert before 'Given'        |             12 |
| conf.view.identsBefore.When         | How many identation symbols to insert before 'When'         |             13 |
| conf.view.identsBefore.Then         | How many identation symbols to insert before 'Then'         |             13 |
| conf.view.identsBefore.And          | How many identation symbols to insert before 'And'          |             14 |
| conf.view.identsBefore.But          | How many identation symbols to insert before 'But'          |             14 |
| conf.view.identsBefore.At           | How many identation symbols to insert before 'At'           |              8 |
| conf.view.identsBefore.Table        | How many identation symbols to insert before 'Table'        |             18 |

## Change log
* 2.0.0 (2020-02-08): Plugin settings are reloaded on save. So upon switching branch with different settings/loading other projects, tool will load them.
* 1.0.0 (2020-02-02): Initial release

## Contributions
Love this extension? [Star](https://github.com/drweb86/Gherkin-Beautifier-VS-Code-Plugin/stargazers) us!

Want to make this extension even more awesome? [Send us your wish](https://github.com/drweb86/Gherkin-Beautifier-VS-Code-Plugin/issues/new/).

Hate how it is working? [File an issue](https://github.com/drweb86/Gherkin-Beautifier-VS-Code-Plugin/issues/new/) to us.
