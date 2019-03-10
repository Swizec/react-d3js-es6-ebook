const os = require('os');
const path = require('path');
const prettier = require('prettier');

const prettierConfig = prettier.resolveConfig.sync(process.cwd());

const srcDirAbsPath = path.resolve('manuscript');

const buildDirAbsPath = path.resolve('build');

const fullManuscriptAbsPath = path.resolve(
  buildDirAbsPath,
  'full-pandoc-markdown.md'
);

const fullPandocMarkdownAbsPath = path.resolve(
  buildDirAbsPath,
  'full-pandoc-markdown.md'
);

const fullRemarqJsonAbsPath = path.resolve(
  buildDirAbsPath,
  'full-remarq.json'
);

const remarqTemplateDirAbsPath = path.resolve('remarq-template/');
const remarqDropboxDirAbsPath = path.resolve(
  os.homedir(),
  'Dropbox/Apps/RemarqBooks/'
);
const remarqInputDirAbsPath = path.resolve(
  remarqDropboxDirAbsPath,
  'ReactDataviz/'
);
const remarqOutputFileAbsPaths = ['epub', 'mobi', 'pdf'].map(ext =>
  path.resolve(remarqDropboxDirAbsPath, `ReactDataviz.${ext}`)
);
const remarqInputChaptersFileAbsPath = path.resolve(
  remarqInputDirAbsPath,
  '2_chapters/chapters.md'
);

const fullHtmlAbsPath = path.resolve(buildDirAbsPath, 'full-html.html');

const fullTeachableJsonAbsPath = path.resolve(
  srcDirAbsPath,
  'full-teachable.json'
);

const pubRepoAbsPath = path.resolve(buildDirAbsPath, 'content');

const teachableAssetsAbsPath = path.resolve(pubRepoAbsPath, 'teachable-html');

module.exports = {
  prettierConfig,
  srcDirAbsPath,
  buildDirAbsPath,
  fullManuscriptAbsPath,
  fullPandocMarkdownAbsPath,
  fullRemarqJsonAbsPath,
  remarqTemplateDirAbsPath,
  remarqInputDirAbsPath,
  remarqInputChaptersFileAbsPath,
  remarqOutputFileAbsPaths,
  fullHtmlAbsPath,
  fullTeachableJsonAbsPath,
  pubRepoAbsPath,
  teachableAssetsAbsPath,
};
