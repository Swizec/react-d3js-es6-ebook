const fse = require("fs-extra");
const path = require("path");
const os = require("os");

const fp = require("lodash/fp");

const { runShellCommand } = require("./util");
const { pandocify } = require("./conversions");

const rmqDirAbsPath = path.resolve("remarq-template/");
const srcDirAbsPath = path.resolve("manuscript/");
const dstDirAbsPath = path.resolve(
  os.homedir(),
  "Dropbox/Apps/RemarqBooks/ReactDataviz/"
);

// ## pure-ish functions

function prependIndex(srcFileNames) {
  const indices = [...Array(10).keys()];
  return fp.zipWith(
    (i, srcFileName) => fp.padCharsStart("0")(2)(i) + "-" + srcFileName,
    indices,
    srcFileNames
  );
}

function getSrcFileNames() {
  return fse
    .readFileSync(path.resolve(srcDirAbsPath, "Book.txt"), {
      encoding: "utf8"
    })
    .trim()
    .split("\n")
    .map(fp.trim);
}

function loadSrcFile(srcFileName) {
  return fse.readFileSync(path.resolve(srcDirAbsPath, srcFileName), {
    encoding: "utf8"
  });
}

const pandocifySrcFile = fp.curry(pandocify)(srcDirAbsPath);

const dstFileBody = fp.pipe(
  loadSrcFile,
  pandocifySrcFile
);

// ## effectful functions

function writeFile(dstFilePath, dstFileBody) {
  const dstFileAbsPath = path.resolve(dstDirAbsPath, dstFilePath);
  fse.writeFileSync(dstFileAbsPath, dstFileBody);
}

function resetDstDir() {
  fse.removeSync(dstDirAbsPath, null, e => console.log(e));
  fse.ensureDirSync(dstDirAbsPath);
  fse.copySync(rmqDirAbsPath, dstDirAbsPath);
}

function main() {
  resetDstDir();

  const srcFileNames = getSrcFileNames();
  const dstFilePaths = fp.map(dstFileName => "2_chapters/" + dstFileName)(
    prependIndex(srcFileNames)
  );
  console.log({ dstFilePaths });

  const dstFileBodies = fp.map(dstFileBody)(srcFileNames);

  fp.zipWith(writeFile, dstFilePaths, dstFileBodies);
}

main();
