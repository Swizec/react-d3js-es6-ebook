const path = require("path");
const os = require("os");

const fse = require("fs-extra");
const globSync = require("glob-gitignore").sync;
const fp = require("lodash/fp");

const { pandocify } = require("./conversions");

const rmqDirAbsPath = path.resolve("remarq-template/");
const srcDirAbsPath = path.resolve("manuscript/");
const dstDirAbsPath = path.resolve(
  os.homedir(),
  "Dropbox/Apps/RemarqBooks/ReactDataviz/"
);

// ## pure-ish functions

function prependIndex(srcFileNames) {
  const indices = [...Array(srcFileNames.length).keys()];
  // using `i + 1` because remarq relies on 01-indexed .md files
  return fp.zipWith(
    (i, srcFileName) => fp.padCharsStart("0")(2)(i + 1) + "-" + srcFileName,
    indices,
    srcFileNames
  );
}

function getSrcFileNames() {
  const fileNames = fse
    .readFileSync(path.resolve(srcDirAbsPath, "Book.txt"), {
      encoding: "utf8"
    })
    .trim()
    .split("\n")
    .map(fp.trim);
  const frontMatter = fileNames.slice(0, 1);
  const chapters = fileNames.slice(1, -2);
  const backMatter = fileNames.slice(-2);
  return [frontMatter, chapters, backMatter];
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
function rmrf(path) {
  fse.removeSync(path, null, e => console.log(e));
}

function writeFile(dstFilePath, dstFileBody) {
  const dstFileAbsPath = path.resolve(dstDirAbsPath, dstFilePath);
  fse.writeFileSync(dstFileAbsPath, dstFileBody);
}

function resetDstDir() {
  rmrf(dstDirAbsPath);
  fse.ensureDirSync(dstDirAbsPath);
  fse.copySync(rmqDirAbsPath, dstDirAbsPath);
  const mdAbsFilePaths = globSync("**/*.md", {
    cwd: dstDirAbsPath,
    absolute: true
  });
  fp.map(rmrf)(mdAbsFilePaths);
}

function convertAndWrite(dstDirPath, srcFileNames) {
  const dstFilePaths = fp.map(dstFileName =>
    path.join(dstDirPath, dstFileName)
  )(prependIndex(srcFileNames));

  const dstFileBodies = fp.map(dstFileBody)(srcFileNames);

  fp.zipWith(writeFile, dstFilePaths, dstFileBodies);
  fp.zipWith(
    (..._args) => process.stdout.write("."),
    dstFilePaths,
    dstFileBodies
  );
  process.stdout.write("\n");
}

function main() {
  resetDstDir();
  console.log(`Saving files for Remarq at:\n${dstDirAbsPath}`);

  const [frontMatter, chapters, backMatter] = getSrcFileNames();
  console.log([frontMatter, chapters, backMatter]);

  convertAndWrite("1_front_matter", frontMatter);
  convertAndWrite("2_chapters", chapters);
  convertAndWrite("3_back_matter", backMatter);
}

main();
