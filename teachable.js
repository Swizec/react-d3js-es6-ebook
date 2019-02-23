const fs = require('fs');
const fse = require('fs-extra');
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

  // generate a table of contents to be used by remarq.js to generate book
  // files for each tier
  // the schema is:
  // sections = [
  //   {
  //     sectionTitle: '',
  //     sectionDirectoryName: '',
  //     lectures: [
  //       {
  //         lectureTitle: '',
  //         lectureFileName: '',
  //       },
  //     ],
  //   },
  // ];
  function newBook() {
    return { sections: [] };
  }
  function newSection() {
    return { sectionTitle: '', sectionDirectoryName: '', lectures: [] };
  }
  function newLecture() {
    return { lectureTitle: '', lectureFileName: '' };
  }
  let sections = [];
  let currentSection = newSection();
  let currentLecture = newLecture();

  let sectionIndex = 0;
  let lectureIndex = 0;
  let srcLineIndex = 0;
  let destLines = [];
  const srcLines = fullBody.split('\n');

  while (srcLineIndex < srcLines.length) {
    const srcLine = srcLines[srcLineIndex];
    if (
      currentSection.sectionDirectoryName &&
      currentLecture.lectureFileName &&
      !srcLine.includes('end-lecture')
    ) {
      destLines.push(srcLine);
    } else if (
      currentSection.sectionDirectoryName &&
      currentLecture.lectureFileName &&
      srcLine.includes('end-lecture')
    ) {
      fs.writeFileSync(
        path.resolve(
          destContentAbsolutePath,
          currentSection.sectionDirectoryName,
          currentLecture.lectureFileName
        ),
        destLines.join('\n')
      );
      currentSection.lectures.push(currentLecture);
      currentLecture = newLecture();
      lectureIndex++;
    } else if (
      currentSection.sectionDirectoryName &&
      !currentLecture.lectureFileName &&
      srcLine.includes('end-section')
    ) {
      sections.push(currentSection);
      currentSection = newSection();
      sectionIndex++;
    } else if (
      currentSection.sectionDirectoryName &&
      !currentLecture.lectureFileName &&
      srcLine.includes('begin-lecture')
    ) {
      currentLecture.lectureTitle = srcLine.match(/title="(.*)"/)[1];
      currentLecture.lectureFileName = `s${fp.padCharsStart('0')(2)(
        sectionIndex
      )}e${fp.padCharsStart('0')(2)(lectureIndex)} - ${
        currentLecture.lectureTitle
      }${extension}`;
      destLines = [];
    } else if (
      !currentSection.sectionDirectoryName &&
      !currentLecture.lectureFileName &&
      srcLine.includes('begin-section')
    ) {
      currentSection.sectionTitle = srcLine.match(/title="(.*)"/)[1];
      currentSection.sectionDirectoryName = `s${fp.padCharsStart('0')(2)(
        sectionIndex
      )}`;
      mkdirp.sync(
        path.resolve(
          destContentAbsolutePath,
          currentSection.sectionDirectoryName
        )
      );
    } else {
      // process.stdout.write(".");
    }

    srcLineIndex++;
  }
  const bookMetadataAbsPath = path.resolve(
    srcDirAbsolutePath,
    'book-full.json'
  );
  const bookMetadata =
    fse.readJsonSync(bookMetadataAbsPath, { throws: false }) || newBook();
  bookMetadata.sections = sections;
  fse.writeJsonSync(bookMetadataAbsPath, bookMetadata, { spaces: 2 });
  console.log({ bookMetadataAbsPath });
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
