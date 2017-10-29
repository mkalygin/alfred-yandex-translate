# alfred-yandex-translate

Yandex Translate workflow for Alfred
(powered by [Alfy](https://github.com/sindresorhus/alfy)).

## Install

```shell
$ npm install -g alfred-yandex-translate
```

In addition you need to set your Yandex API key in the workflow environment variables.

- Go to [Yandex Translate developers page](https://translate.yandex.ru/developers/keys) and generate new API key or use existing one. Copy it in the clipboard.
- Open Alfred preferences.
- Click on the Workflows tab.
- Select the Yandex Translate workflow.
- Open the environment variables panel.
- Paste your key in the `YANDEX_API_KEY` variable.

## Usage

There are two commands available:

- `ytc` - configures translation direction. Shows all available options to select from. Default is `en-ru`.
- `yt` - translates input query using current translation direction. Outputs translation. Use <kbd>Enter</kbd> to copy the translation in the clipboard. Use <kbd>⌘ Cmd</kbd> + <kbd>Enter</kbd> to enlarge the translation text.

You can also setup shortcuts for often used translators.

## License

MIT © [Michael Kalygin](https://about.me/michaelkalygin)
