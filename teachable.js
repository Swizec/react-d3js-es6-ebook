const fs = require('fs');
const fp = require('lodash/fp');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const {
  buildDirAbsPath,
  fullHtmlAbsPath,
  pubRepoAbsPath,
  fullBookDataAbsPath,
} = require('./config');

const {
  emojify,
  prettify,
  prettyJson,
  runShellCommand,
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
  // runShellCommand(
  //   `git clone git@github.com:hsribei/content.git ${pubRepoAbsPath}`,
  //   "Couldn't clone repo. Probably because it's already cloned."
  // );

  // const destDirAbsPath = 'teachable-html';
  const destExtname = '.html';

  // rimraf.sync(destDirAbsPath, null, e => console.log(e));

  const fullBody = fs.readFileSync(fullHtmlAbsPath, {
    encoding: 'utf8',
  });

  rimraf.sync(fullBookDataAbsPath, null, e => console.log(e));

  const fullBookData = splitIntoSectionsAndLectures(fullBody);
  fs.writeFileSync(fullBookDataAbsPath, prettyJson(fullBookData));
}

function gitAddAllCommitAndPush(destRepoAbsolutePath) {
  // --ignore-removal is to be conservative and
  // avoid missing content while cdn propagates.
  const githubPushCommand = `
    cd ${destRepoAbsolutePath} &&
    git add --ignore-removal . &&
    git commit -m "Automated commit" &&
    git push origin master && cd -`;

  console.log({ githubPushCommand });

  // Uncomment to deploy
  // runShellCommand(
  //   githubPushCommand,
  //   "Probably because there weren't any changes."
  // );
}

function main() {
  // mkdirp.sync(buildDirAbsPath);

  // postProcessFullHtml(fullHtmlAbsPath);

  splitFullHtmlIntoPubRepo();

  // gitAddAllCommitAndPush(pubRepoAbsPath);
}

main();
