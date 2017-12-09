# Changelog

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
