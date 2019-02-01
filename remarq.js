const fs = require("fs");
const path = require("path");
const os = require("os");

const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
const fp = require("lodash/fp");

const { runShellCommand } = require("./util");
const { pandocify } = require("./conversions");

const srcDirAbsPath = path.resolve("manuscript");
const dstDirAbsPath = path.resolve(
  os.homedir(),
  "Dropbox/Apps/RemarqBooks/ReactDataviz/2_chapters"
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
  return fs
    .readFileSync(path.resolve(srcDirAbsPath, "Book.txt"), {
      encoding: "utf8"
    })
    .trim()
    .split("\n")
    .map(fp.trim);
}

function loadSrcFile(srcFileName) {
  return fs.readFileSync(path.resolve(srcDirAbsPath, srcFileName), {
    encoding: "utf8"
  });
}

const pandocifySrcFile = fp.curry(pandocify)(srcDirAbsPath);

const dstFileBody = fp.pipe(
  loadSrcFile,
  pandocifySrcFile
);

// ## effectful functions

function writeFile(dstFileName, dstFileBody) {
  const dstFileAbsPath = path.resolve(dstDirAbsPath, dstFileName);
  fs.writeFileSync(dstFileAbsPath, dstFileBody);
}

function resetDstDir() {
  rimraf.sync(dstDirAbsPath, null, e => console.log(e));
  mkdirp.sync(dstDirAbsPath);
}

function main() {
  resetDstDir();

  const srcFileNames = getSrcFileNames();
  const dstFileNames = prependIndex(srcFileNames);
  console.log({ dstFileNames });

  const dstFileBodies = fp.map(dstFileBody)(srcFileNames);

  fp.zipWith(writeFile, dstFileNames, dstFileBodies);
}

main();
