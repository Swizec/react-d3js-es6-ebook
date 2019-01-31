const fs = require("fs");
const path = require("path");
const os = require("os");

const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
const fp = require("lodash/fp");

const { runShellCommand } = require("./util");
const { pandocify } = require("./conversions");

const srcDirAbsolutePath = path.resolve("manuscript");
const dstDirAbsolutePath = path.resolve(
  os.homedir(),
  "Dropbox/Apps/RemarqBooks/ReactDataviz/2_chapters"
);

// ## pure-ish functions

function getSrcFileNames() {
  return fs
    .readFileSync(path.resolve(srcDirAbsolutePath, "Book.txt"), {
      encoding: "utf8"
    })
    .trim()
    .split("\n")
    .map(fp.trim);
}

function loadSrcFile(srcFileName) {
  return fs.readFileSync(path.resolve(srcDirAbsolutePath, srcFileName), {
    encoding: "utf8"
  });
}

const pandocifySrcFile = fp.curry(pandocify)(srcDirAbsolutePath);

// ## effectful functions

function resetDestDir() {
  rimraf.sync(dstDirAbsolutePath, null, e => console.log(e));
  mkdirp.sync(dstDirAbsolutePath);
}

function main() {
  const srcFileNames = getSrcFileNames();
  resetDestDir();

  const dstFileBody = fp.pipe(
    loadSrcFile,
    pandocifySrcFile
  );

  console.log({ srcFileNames });
  const dstFileBodies = fp.map(dstFileBody)(srcFileNames);
  console.log(fp.map(f => f.length)(dstFileBodies));
}

main();
