const path = require('path');

const fse = require('fs-extra');
const globSync = require('glob-gitignore').sync;
const fp = require('lodash/fp');

const stripSkinTone = require('strip-skin-tone');

const { runShellCommand, gemojify, prettify } = require('../util');
const { pandocify } = require('../conversions');

const manuscriptDirAbsPath = path.resolve('./manuscript/');

// Pure-ish functions
function fwdFileName(fn) {
  return ([fileName, ...args]) => [fileName, fn(...args)];
}

function loadFile(srcFileName) {
  return [
    srcFileName,
    fse.readFileSync(path.resolve(manuscriptDirAbsPath, srcFileName), {
      encoding: 'utf8',
    }),
  ];
}

function pandocifyBody(srcFileBody) {
  return pandocify(manuscriptDirAbsPath, srcFileBody);
}

// Effectful functions

function overWriteFile([srcFileName, dstFileBody]) {
  fse.writeFileSync(
    path.resolve(manuscriptDirAbsPath, srcFileName),
    dstFileBody
  );
}

const convertAndOverwrite = fp.pipe(
  loadFile,
  fwdFileName(pandocifyBody),
  fwdFileName(stripSkinTone),
  fwdFileName(gemojify),
  fwdFileName(prettify('markdown')),
  overWriteFile
);

function revertMigration() {
  runShellCommand(
    'git checkout 164cc01ad17ed8de8c44ab1e33d7e40d625af710 -- manuscript/'
  );
}

function applyMigration() {
  const mdAbsFilePaths = globSync('*.md', {
    cwd: manuscriptDirAbsPath,
    absolute: true,
  });

  fp.map(convertAndOverwrite)(mdAbsFilePaths);
}

function test() {
  console.log('hey cool huh!');

  revertMigration();

  applyMigration();
}

test();
