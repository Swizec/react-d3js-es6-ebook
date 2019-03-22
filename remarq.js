const path = require('path');

const fse = require('fs-extra');
const mkdirp = require('mkdirp');
const globSync = require('glob-gitignore').sync;

const chokidar = require('chokidar');
const ora = require('ora');

const _ = require('lodash');
const fp = require('lodash/fp');

const {
  writeFullManuscript,
  fpWriteFile,
  updateFullRemarqJson,
  conditionalLog,
} = require('./util');

const {
  buildDirAbsPath,
  remarqTemplateDirAbsPath,
  remarqInputDirAbsPath,
  remarqInputChaptersFileAbsPath,
  remarqOutputFileAbsPaths,
  pubRepoAbsPath,
} = require('./config');

// ## pure-ish functions
const fixSectionBody = ({ sectionTitle, lectures }) => {
  const sectionBody = fp.pipe(
    fp.map(fixLectureHeadings),
    fp.join('\n'),
    prependAsH1(sectionTitle)
  )(lectures);

  return sectionBody;
};

const fixLectureHeadings = fp.curry(({ lectureTitle, lectureLines }) => {
  const lectureBody = fp.pipe(
    fp.join('\n'),
    // delete starting heading
    fp.replace(/^\n+#+ .+?\n+/, ''),
    // make all headings at least h3
    normalizeHeadings(3),
    prependAsH2(lectureTitle)
  )(lectureLines);
  return lectureBody;
});

const prependAsH1 = fp.curry((title, str) => `\n# ${title}\n\n${str}`);
const prependAsH2 = fp.curry((title, str) => `\n## ${title}\n\n${str}`);

const normalizeHeadings = fp.curry((baseHeading, markdownString) => {
  if (markdownString.match(/\n#+ /g)) {
    const minHeading = fp.pipe(
      conditionalLog(false, 'headingMatch'),
      fp.map(fp.strip),
      fp.minBy(str => str.length),
      _.size
    )(markdownString.match(/\n#+ /g));

    return markdownString.replace(
      RegExp(`\n#{${minHeading}}`, 'g'),
      '\n' + fp.repeat(baseHeading)('#')
    );
  } else {
    return markdownString;
  }
});

// Add a LaTeX non-breaking space after the image so that it gets
// rendered where it appears in the manuscript instead of some odd
// position decided by LaTeX
const fixLatexImagePosition = fp.replace(
  /!\[.*?]\(.*?\.(?:png|jpg|gif)\)/g,
  '$&\\ '
);

// ## effectful functions
function writeOutSectionsAsRemarqChaptersFile(sections) {
  const fullRemarqBody = fp.pipe(
    fp.map(fixSectionBody),
    fp.join('\n\n'),
    fixLatexImagePosition,
    fpWriteFile(remarqInputChaptersFileAbsPath)
  )(sections);

  return fullRemarqBody;
}

function rmrf(rmrfPath) {
  fse.removeSync(rmrfPath, null, e => console.log(e));
}

const move = (source, destination) => {
  fse.moveSync(source, destination, { overwrite: true });
};

function resetRemarqDropboxDir() {
  rmrf(remarqInputDirAbsPath);
  fp.map(rmrf)(remarqOutputFileAbsPaths);
  fse.ensureDirSync(remarqInputDirAbsPath);
  fse.copySync(remarqTemplateDirAbsPath, remarqInputDirAbsPath);
  const mdAbsFilePaths = globSync('**/*.md', {
    cwd: remarqInputDirAbsPath,
    absolute: true,
  });
  fp.map(rmrf)(mdAbsFilePaths);
}

function saveRemarqOutput(buildName) {
  const destDir = path.resolve(pubRepoAbsPath, `ebook-${buildName}`);
  mkdirp.sync(destDir);
  const remarqPubFileAbsPaths = fp.map(
    outPath => `${destDir}/${path.basename(outPath)}`
  )(remarqOutputFileAbsPaths);

  fp.zipWith(move, remarqOutputFileAbsPaths, remarqPubFileAbsPaths);
}

function makeAll(fullRemarqData) {
  function processBuilds([currentBuild, ...remainingBuilds]) {
    if (!currentBuild) {
      console.log('Aaaand... done.');
    } else {
      const { name, allSections, sectionRangesInclusive } = currentBuild;
      let spinner = ora();
      spinner.start();

      resetRemarqDropboxDir();

      spinner.info(fp.repeat(50, '-'));
      spinner.info(`Building '${name}' ebooks now...`);

      if (allSections) {
        writeOutSectionsAsRemarqChaptersFile(fullRemarqData.sections);
      } else {
        const tieredSections = fp.flatMap(
          ({ first, last }) => fullRemarqData.sections.slice(first, last + 1),
          sectionRangesInclusive
        );
        writeOutSectionsAsRemarqChaptersFile(tieredSections);
      }

      spinner.succeed(
        `Building '${name}': Finished sending manuscript to Remarq.io`
      );
      const finishedOutputFileNames = [];

      const remainingFormats = () =>
        fp.pipe(
          fp.map(path.basename),
          fp.filter(fileName => !finishedOutputFileNames.includes(fileName)),
          fp.map(path.extname),
          fp.join(', ')
        )(remarqOutputFileAbsPaths);

      spinner.start(
        `Building '${name}': Waiting for ${remainingFormats()}...`
      );

      const watcher = chokidar.watch(remarqOutputFileAbsPaths, {
        awaitWriteFinish: true,
      });
      watcher.on('add', addedPath => {
        finishedOutputFileNames.push(path.basename(addedPath));
        spinner = spinner.succeed(
          `Building '${name}': Remarq.io finished generating ${path.basename(
            addedPath
          )}`
        );

        if (finishedOutputFileNames.length === 3) {
          watcher.close();

          spinner.start(`Building '${name}': Saving files`);
          saveRemarqOutput(name);
          spinner = spinner.succeed(
            `Building '${name}': Finished saving files into build directory.`
          );
          processBuilds(remainingBuilds);
        } else {
          spinner.start(
            `Building '${name}': Waiting for ${remainingFormats()}...`
          );
        }
      });
    }
  }

  processBuilds(fullRemarqData.builds);
}

function main() {
  mkdirp.sync(buildDirAbsPath);

  writeFullManuscript();
  const fullRemarqData = updateFullRemarqJson();

  makeAll(fullRemarqData);
}

main();
