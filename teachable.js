const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const fp = require('lodash/fp');

const {
  buildDirAbsPath,
  fullHtmlAbsPath,
  pubRepoAbsPath,
  fullBookDataAbsPath,
  teachableAssetsAbsPath,
} = require('./config');

const {
  emojify,
  prettify,
  prettyJson,
  runShellCommand,
  writeFullManuscript,
  convertFullManuscriptToHtml,
  splitIntoSectionsAndLectures,
} = require('./util');

function postProcessFullHtml(fullHtmlAbsPath) {
  const fullHtmlBody = fs.readFileSync(fullHtmlAbsPath, {
    encoding: 'utf8',
  });

  const pipeline = fp.pipe(
    emojify,
    prettify('html')
  );

  const processedFullHtmlBody = pipeline(fullHtmlBody);
  fs.writeFileSync(fullHtmlAbsPath, processedFullHtmlBody);
}

function splitFullHtmlIntoPubRepo() {
  if (!fs.existsSync(pubRepoAbsPath)) {
    runShellCommand(
      `git clone git@github.com:hsribei/content.git ${pubRepoAbsPath}`,
      "Couldn't clone repo."
    );
  }
  const extension = '.html';

  // turn full html into structured json with sections and lectures
  const fullBody = fs.readFileSync(fullHtmlAbsPath, {
    encoding: 'utf8',
  });

  rimraf.sync(fullBookDataAbsPath, null, e => console.log(e));

  const fullBookData = splitIntoSectionsAndLectures(fullBody);
  fs.writeFileSync(fullBookDataAbsPath, prettyJson(fullBookData));

  // create section directories and lecture files
  rimraf.sync(teachableAssetsAbsPath, null, e => console.log(e));
  mkdirp.sync(teachableAssetsAbsPath);

  const sectionIndexes = fp.range(0, fullBookData.sections.length);
  const sectionDirAbsPaths = fp.map(
    fp.pipe(
      sectionIndex => `s${fp.padCharsStart('0')(2)(sectionIndex)}`,
      sectionDirAbsPath =>
        path.resolve(teachableAssetsAbsPath, sectionDirAbsPath),
      mkdirp.sync
    )
  )(sectionIndexes);

  let lectureIndex = 0;
  fullBookData.sections.map(({ lectures }, sectionIndex) => {
    lectures.map(({ lectureTitle, lectureLines }) => {
      const lectureFileName =
        's' +
        `${fp.padCharsStart('0')(2)(sectionIndex)}` +
        'e' +
        `${fp.padCharsStart('0')(2)(lectureIndex)}` +
        ` - ${lectureTitle}${extension}`;
      const lectureAbsPath = path.resolve(
        teachableAssetsAbsPath,
        sectionDirAbsPaths[sectionIndex],
        lectureFileName
      );

      const lectureBody = lectureLines.join('\n');
      fs.writeFileSync(lectureAbsPath, lectureBody);
      lectureIndex++;
    });
  });
}

function gitAddAllCommitAndPush(destRepoAbsolutePath) {
  // --ignore-removal is to be conservative and
  // avoid missing content while cdn propagates.
  const githubPushCommand = `
    cd ${destRepoAbsolutePath} &&
    git add --ignore-removal . `; // ` &&
  // git commit -m "Automated commit" &&
  // git push origin master && cd -`;
  // ^^^^^^^^^^^^^^^^^^^^^^^^^
  // Uncomment above to deploy

  console.log({ githubPushCommand });

  runShellCommand(
    githubPushCommand,
    "Probably because there weren't any changes."
  );
}

function main() {
  mkdirp.sync(buildDirAbsPath);

  writeFullManuscript();

  convertFullManuscriptToHtml();

  postProcessFullHtml(fullHtmlAbsPath);

  splitFullHtmlIntoPubRepo();

  gitAddAllCommitAndPush(pubRepoAbsPath);
}

main();
