import alfy from 'alfy';
import langs from './data/langs.mjs';

const mapLangToOutput = lang => ({
  title: lang,
  arg: lang,
});

const matches = alfy.inputMatches(langs);
const output = matches.map(mapLangToOutput);

alfy.output(output);
