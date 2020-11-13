const alfy = require('alfy');
const dotenv = require('dotenv');
const YandexTranslate = require('./api/yandex-translate');
const yandexDictionary = require('yandex-dictionary');

dotenv.load();

const argLang = process.argv.length === 4 ? process.argv.pop() : null;
const defaultLang = 'en-ru';
const configLang = alfy.config.get('lang');
const lang = argLang || configLang || defaultLang;

const oauthToken = process.env.YANDEX_OAUTH_TOKEN;
const folderId = process.env.YANDEX_FOLDER_ID;
const dictKey = process.env.YANDEX_DICT_API_KEY;

const yt = new YandexTranslate({ oauthToken, folderId });
const yd = yandexDictionary(dictKey);

const translationSubtitle = ({ pos, gen, asp }) => (
  [pos, gen, asp].filter(Boolean).join(', ')
);

const mapTextToOutput = text => ({
  title: text,
  arg: text,
});

const mapTranslationsToOutput = tr => ({
  title: tr.text,
  subtitle: translationSubtitle(tr),
  arg: tr.text,
});

const mapDefToOutput = def => (
  def.map(item => item.tr.map(mapTranslationsToOutput))
    .reduce((acc, cur) => acc.concat(cur), [])
);

const simpleTranslate = async () => {
  try {
    const [source, target] = lang.split('-');
    const { data } = await yt.translate({
      texts: [alfy.input],
      targetLanguageCode: target,
    });

    const output = (data.translations || [])
      .filter(({ detectedLanguageCode }) => detectedLanguageCode === source)
      .map(({ text }) => mapTextToOutput(text));

    alfy.output(output);
  } catch (error) {
    const { message } = error.response.data || error;
    alfy.error(message);
  }
};

const dictTranslate = () => {
  yd.lookup(alfy.input, lang, (err, res) => {
    if (res.code && res.code !== 200) {
      alfy.error(res.message);
    } else if (!res.def || !res.def.length) {
      simpleTranslate();
    } else {
      const output = mapDefToOutput(res.def);
      alfy.output(output);
    }
  });
};

if (dictKey) {
  dictTranslate();
} else {
  simpleTranslate();
}
