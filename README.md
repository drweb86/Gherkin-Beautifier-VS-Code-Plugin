# Gherkin Beautifier VS Code Plugin
Beautifies the Gherkin / Cucumber files.

![Demostration of using this extension](https://raw.githubusercontent.com/drweb86/Gherkin-Beautifier-VS-Code-Plugin/master/demo.gif)

## Usage
You can use both command palette or keyboard shortcuts to converts indentation. We recommend bind to keyboard shortcuts if you need to convert indentation frequently.

### Run with Command Palette

* Press `F1` or `Ctrl+Shift+P` for Command Palette
* Type or find "Beautify Gherkin / Cucumber file"

### Binding to keyboard shortcuts

* File > Preferences > Keyboard Shortcuts
* Append the following into `keybindings.json`

```js
{
  "key": "ctrl+shift+2",
  "command": "Gherkin-Beautifier-VS-Code-Plugin.beautify",
  "when": "editorFocus"
}
```

### Autoformat on save

To enable auto fixing tslint errors on save, In VS Code set:

```js
"editor.codeActionsOnSave": {
    "source.Gherkin-Beautifier-VS-Code-Plugin.beautify": true
}
```

## Change log
* 0.0.1 (2020-02-02): Initial release (February 2020)

## Contributions
Love this extension? [Star](https://github.com/drweb86/Gherkin-Beautifier-VS-Code-Plugin/stargazers) us!

Want to make this extension even more awesome? [Send us your wish](https://github.com/drweb86/Gherkin-Beautifier-VS-Code-Plugin/issues/new/).

Hate how it is working? [File an issue](https://github.com/drweb86/Gherkin-Beautifier-VS-Code-Plugin/issues/new/) to us.
