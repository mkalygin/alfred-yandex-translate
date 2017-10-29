const alfy = require('alfy');
const dotenv = require('dotenv');
const yandexTranslate = require('yandex-translate');

dotenv.load();

const argLang = process.argv.length === 4 ? process.argv.pop() : null;
const defaultLang = 'en-ru';
const configLang = alfy.config.get('lang');
const lang = argLang || configLang || defaultLang;

const key = process.env.YANDEX_API_KEY;
const yt = yandexTranslate(key);

const mapTextToOutput = text => ({
  title: text,
  arg: text,
});

yt.translate(alfy.input, { to: lang }, (err, res) => {
  if (res.code !== 200) {
    alfy.error(res.message);
  } else {
    const output = res.text.map(mapTextToOutput);
    alfy.output(output);
  }
});
