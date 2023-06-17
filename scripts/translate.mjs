import 'dotenv/config';
import alfy from 'alfy';
import YandexDictionary from 'yandex-dictionary';
import YandexTranslate from './api/yandex-translate.mjs';

const argLang = process.argv.length === 4 ? process.argv.pop() : null;
const defaultLang = 'en-ru';
const configLang = alfy.config.get('lang');
const lang = argLang || configLang || defaultLang;

const oauthToken = process.env.YANDEX_OAUTH_TOKEN;
const folderId = process.env.YANDEX_FOLDER_ID;
const dictKey = process.env.YANDEX_DICT_API_KEY;

const yt = new YandexTranslate({ oauthToken, folderId });
const yd = YandexDictionary(dictKey);

const NoResults = Object.freeze({
  title: 'No results found ¯\\_(ツ)_/¯',
  arg: '',
});

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

const outputResults = output =>
  alfy.output(output && output.length > 0 ? output : [NoResults]);

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

    outputResults(output);
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
      outputResults(output);
    }
  });
};

if (dictKey) {
  dictTranslate();
} else {
  simpleTranslate();
}
