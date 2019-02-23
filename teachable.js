const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const fp = require('lodash/fp');
const mkdirp = require('mkdirp');
const retext = require('retext');
const emoji = require('retext-emoji');
const prettier = require('prettier');

const { runShellCommand } = require('./util');
// const { pandocify } = require("./conversions");

const emojify = fp.pipe(
  retext().use(emoji, { convert: 'encode' }).processSync,
  String
);

const prettierConfig = prettier.resolveConfig.sync(process.cwd());

function prettify(srcFileBody) {
  return prettier.format(
    srcFileBody,
    Object.assign({}, { parser: 'html' }, prettierConfig)
  );
}

const srcDirAbsolutePath = path.resolve('manuscript');

const buildDirAbsolutePath = path.resolve('build');
// rimraf.sync(buildDirAbsolutePath, null, e => console.log(e));
mkdirp.sync(buildDirAbsolutePath);

const srcFileNames = fs
  .readFileSync(path.resolve(srcDirAbsolutePath, 'Book.txt'), {
    encoding: 'utf8',
  })
  .trim()
  .split('\n')
  .map(fp.trim);
console.log({ srcFileNames });

const fullPandocMarkdownBody = srcFileNames
  .map(mdFileName => [
    mdFileName,
    fs.readFileSync(path.resolve(srcDirAbsolutePath, mdFileName), {
      encoding: 'utf8',
    }),
  ])
  .map(([mdFileName, sourceFileBody], i) => {
    const destFilePath = fp.padCharsStart('0')(2)(i) + '-' + mdFileName;
    console.log(destFilePath);
    const destFileBody = sourceFileBody; // pandocify(srcDirAbsolutePath, sourceFileBody);
    return [destFilePath, destFileBody];
  })
  .map(([_, destFileBody]) => destFileBody)
  .join('\n\n');

const fullPandocMarkdownAbsolutePath = path.resolve(
  buildDirAbsolutePath,
  'full-pandoc-markdown.md'
);
fs.writeFileSync(fullPandocMarkdownAbsolutePath, fullPandocMarkdownBody);

const fullHtmlAbsolutePath = path.resolve(
  buildDirAbsolutePath,
  'full-html.html'
);
const pandocToHtmlCommand = `pandoc -f markdown -t html -o ${fullHtmlAbsolutePath} -s ${fullPandocMarkdownAbsolutePath} && npx juice ${fullHtmlAbsolutePath} ${fullHtmlAbsolutePath}`;

runShellCommand(pandocToHtmlCommand);

function splitIntoSectionsAndLectures({
  fullBodyAbsolutePath,
  destRepoAbsolutePath,
  destRepoContentPath,
}) {
  runShellCommand(
    `git clone git@github.com:hsribei/content.git ${destRepoAbsolutePath}`,
    "Couldn't clone repo. Probably because it's already cloned."
  );

  const destContentAbsolutePath = path.join(
    destRepoAbsolutePath,
    destRepoContentPath
  );

  rimraf.sync(destContentAbsolutePath, null, e => console.log(e));

  const fullBody = fs.readFileSync(fullBodyAbsolutePath, {
    encoding: 'utf8',
  });

  const extension = path.extname(fullBodyAbsolutePath);

  let sectionDirectoryName = '';
  let lectureFileName = '';
  let sectionIndex = 0;
  let lectureIndex = 0;
  let srcLineIndex = 0;
  let destLines = [];
  const srcLines = fullBody.split('\n');

  while (srcLineIndex < srcLines.length) {
    const srcLine = srcLines[srcLineIndex];
    if (
      sectionDirectoryName &&
      lectureFileName &&
      !srcLine.includes('end-lecture')
    ) {
      destLines.push(srcLine);
    } else if (
      sectionDirectoryName &&
      lectureFileName &&
      srcLine.includes('end-lecture')
    ) {
      fs.writeFileSync(
        path.resolve(
          destContentAbsolutePath,
          sectionDirectoryName,
          lectureFileName
        ),
        destLines.join('\n')
      );
      lectureFileName = '';
    } else if (
      sectionDirectoryName &&
      !lectureFileName &&
      srcLine.includes('end-section')
    ) {
      sectionDirectoryName = '';
      sectionIndex++;
    } else if (
      sectionDirectoryName &&
      !lectureFileName &&
      srcLine.includes('begin-lecture')
    ) {
      const lectureTitle = srcLine.match(/title="(.*)"/)[1];
      lectureFileName = `s${fp.padCharsStart('0')(2)(
        sectionIndex
      )}e${fp.padCharsStart('0')(2)(
        lectureIndex
      )} - ${lectureTitle}${extension}`;
      lectureIndex++;
      destLines = [];
    } else if (
      !sectionDirectoryName &&
      !lectureFileName &&
      srcLine.includes('begin-section')
    ) {
      // const sectionTitle = srcLine.match(/title="(.*)"/)[1];
      sectionDirectoryName = `s${fp.padCharsStart('0')(2)(sectionIndex)}`;
      mkdirp.sync(path.resolve(destContentAbsolutePath, sectionDirectoryName));
    } else {
      // process.stdout.write(".");
    }

    srcLineIndex++;
  }
}

function postProcessFullHtml(fullHtmlAbsPath) {
  const fullHtmlBody = fs.readFileSync(fullHtmlAbsPath, {
    encoding: 'utf8',
  });

  const pipeline = fp.pipe(
    emojify,
    prettify
  );

  const processedFullHtmlBody = pipeline(fullHtmlBody);
  fs.writeFileSync(fullHtmlAbsPath, processedFullHtmlBody);
}

function deployHtmlFiles() {
  postProcessFullHtml(fullHtmlAbsolutePath);

  const fullBodyAbsolutePath = fullHtmlAbsolutePath;

  const destRepoAbsolutePath = path.resolve(buildDirAbsolutePath, 'content');
  const destRepoContentPath = 'teachable-html';

  splitIntoSectionsAndLectures({
    fullBodyAbsolutePath,
    destRepoAbsolutePath,
    destRepoContentPath,
  });

  gitAddAllCommitAndPush(destRepoAbsolutePath);
}

function gitAddAllCommitAndPush(destRepoAbsolutePath) {
  // --ignore-removal is to be conservative and avoid missing content while cdn propagates.
  const githubPushCommand = `cd ${destRepoAbsolutePath} && git add --ignore-removal . && git commit -m "Automated commit" && git push origin master && cd -`;

  console.log({ githubPushCommand });

  // Uncomment to deploy
  // runShellCommand(
  //   githubPushCommand,
  //   "Probably because there weren't any changes."
  // );
}

deployHtmlFiles();
