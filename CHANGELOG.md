# Changelog

### v3.0.0

- Upgrade the workflow for Alfred 5.
- Upgrade `alfy` and all dependencies.
- Update README instructions.

### v2.0.0

- Fix #2. Add support for translation with Yandex Translate API v2.
- Update README with new instructions on how to setup Yandex Translate API.

##### Breaking change

Yandex deprecated Yandex Translate API v1. Now Yandex Translate API is paid.
This update adds a support for API v2. See README for updated instructions on
how to setup new API keys.

### v1.1.0

Add support for translation with Dictionary API. Now it first looks for
translations in Dictionary API and fallbacks to Translation API. This allows
to see all possible translations, not the only one.

##### Breaking change

Now you need to use `YANDEX_TRNSL_API_KEY` variable for your
Yandex Translate API key instead of `YANDEX_API_KEY`. In addition you need
to setup Yandex Dictionary API key as described in Install instructions.

### v1.0.0

Initial version release.
