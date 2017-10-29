const alfy = require('alfy');
const langs = require('./data/langs');

const mapLangToOutput = lang => ({
  title: lang,
  arg: lang,
});

const matches = alfy.inputMatches(langs);
const output = matches.map(mapLangToOutput);

alfy.output(output);
