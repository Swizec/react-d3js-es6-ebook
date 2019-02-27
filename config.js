const path = require('path');
const prettier = require('prettier');

const prettierConfig = prettier.resolveConfig.sync(process.cwd());

const srcDirAbsPath = path.resolve('manuscript');

const buildDirAbsPath = path.resolve('build');

const fullManuscriptAbsPath = path.resolve(
  buildDirAbsPath,
  'full-pandoc-markdown.md'
);

const fullHtmlAbsPath = path.resolve(buildDirAbsPath, 'full-html.html');

const fullBookDataAbsPath = path.resolve(srcDirAbsPath, 'book-full.json');

const pubRepoAbsPath = path.resolve(buildDirAbsPath, 'content');

const teachableAssetsAbsPath = path.resolve(pubRepoAbsPath, 'teachable-html');

module.exports = {
  prettierConfig,
  srcDirAbsPath,
  buildDirAbsPath,
  fullManuscriptAbsPath,
  fullHtmlAbsPath,
  fullBookDataAbsPath,
  pubRepoAbsPath,
  teachableAssetsAbsPath,
};
