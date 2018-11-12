const fs = require("fs");
const path = require("path");
const sync = require("glob-gitignore").sync;
const rimraf = require("rimraf");
const _ = require("lodash");
const fp = require("lodash/fp");

function json(obj) {
  return JSON.stringify(obj, null, 2);
}

function pandocifyMarkuaCodeBlocks(fileBody) {
  const isLoggingEnabled = false;
  const log = (...attrs) => conditionalLog(isLoggingEnabled, ...attrs);
  function replacer(match, attributes, language, code) {
    log("match")(json({ attributes, language, code }), null, 2);

    const idMatch = attributes.match(/(.*)#(\w+)(.*)/);
    log("idMatch")(json(idMatch));
    let discard, beforeIdAttr, idAttr, afterIdAttr;
    if (idMatch) {
      [discard, beforeIdAttr, idAttr, afterIdAttr] = idMatch;
      attributes = beforeIdAttr + afterIdAttr;
    }
    const attrRegExp = /\s*(.+): "(.*)"/;
    const srcAttrs = attributes.split(/\s*,\s*/).reduce((srcAttrs, chunk) => {
      const srcAttrMatches = chunk.match(attrRegExp);
      log("srcAttrMatches")(json(srcAttrMatches));
      const [key, value] = srcAttrMatches
        ? [srcAttrMatches[1], srcAttrMatches[2]]
        : [null, null];
      const result = Object.assign({}, srcAttrs);
      if (key !== null && value !== null) result[key] = value;
      return result;
    }, {});

    log("srcAttrs")(json(srcAttrs));

    let destAttrs = [];

    if (idAttr) destAttrs.push(`#${idAttr}`);

    const langClass = language || srcAttrs.language;
    if (langClass) destAttrs.push(`.${langClass}`);

    if (srcAttrs.caption) destAttrs.push(`caption="${srcAttrs.caption}"`);

    const replacement = `
\`\`\`{${destAttrs.join(" ")}}
${code}
\`\`\`
`;
    return log("replacement")(replacement);
  }

  const result = fileBody.replace(
    /\n{(.+)}\n```(.*)\n([\s\S]*?)\n```\n/g,
    replacer
  );
  return result;
}

function pandocifyLFMCodeBlocks(fileBody) {
  const isLoggingEnabled = false;
  const log = (...attrs) => conditionalLog(isLoggingEnabled, ...attrs);
  function replacer(match, g1, g2) {
    const attributes = fp.pipe(
      fp.trim,
      fp.trimChars(["{", "}"])
    )(g1);

    const code = g2;

    log("match")(json({ match, g1, g2, attributes, code }), null, 2);

    const idMatch = attributes.match(/(.*)#(\w+)(.*)/);
    log("idMatch")(json(idMatch));
    let discard, beforeIdAttr, idAttr, afterIdAttr;
    if (idMatch) {
      [discard, beforeIdAttr, idAttr, afterIdAttr] = idMatch;
      attributes = beforeIdAttr + afterIdAttr;
    }
    const attrRegExp = /\s*(.+)=(.+)/;
    const srcAttrs = attributes.split(/\s*,\s*/).reduce((srcAttrs, chunk) => {
      const srcAttrMatches = chunk.match(attrRegExp);
      log("srcAttrMatches")(json({ srcAttrs, srcAttrMatches }));
      const [key, value] = srcAttrMatches
        ? [srcAttrMatches[1], srcAttrMatches[2]]
        : [null, null];
      const result = Object.assign({}, srcAttrs);
      if (key !== null && value !== null) result[key] = value;
      return result;
    }, {});

    log("srcAttrs")(json(srcAttrs));

    let destAttrs = [];

    if (idAttr) destAttrs.push(`#${idAttr}`);

    // LFM source uses json, jsx, js, less
    const srcLang = srcAttrs.lang;
    // pandoc supports json, javascript, css
    const langClass = {
      json: "json",
      jsx: "javascript",
      js: "javascript",
      less: "css"
    }[srcLang];
    if (langClass) destAttrs.push(`.${langClass}`);

    if (srcAttrs.caption) destAttrs.push(`caption="${srcAttrs.caption}"`);

    const destAttrsStr = destAttrs.length > 0 ? `{${destAttrs.join(" ")}}` : "";

    const replacement = `
\`\`\`${destAttrsStr}
${code}
\`\`\`
`;
    return log("replacement")(replacement);
  }

  const result = fileBody.replace(
    /\n\n({.*}\n)?((?: {4}[\s\S]*?)+)\n\n/g,
    replacer
  );
  return result;
}

// TODO
function transcludeMarkuaCodeSamples(fileBody) {
  return fileBody;
}

// TODO
// LFM === "Leanpub-Flavored Markdown"
function transcludeLFMCodeSamples(fileBody) {
  return fileBody;
}

// TODO Turn this:
// {#animating-react-redux}
// # Animating with React, Redux, and d3
// Into this:
// # Animating with React, Redux, and d3 {#animating-react-redux}
function pandocifyHeaders(fileBody) {
  return fileBody;
}

function pandocify(sourceFileBody) {
  const pipeline = fp.pipe(
    transcludeMarkuaCodeSamples,
    transcludeLFMCodeSamples,
    pandocifyMarkuaCodeBlocks,
    pandocifyLFMCodeBlocks,
    pandocifyHeaders
  );
  return pipeline(sourceFileBody);
}

function id(value) {
  return value;
}

function conditionalLog(isLoggingEnabled, label) {
  let stackFramesInCurrentFile, indentationCount, indentation;
  if (isLoggingEnabled) {
    stackFramesInCurrentFile = new Error().stack
      .split("\n")
      .filter(line => line.match(__filename)).length;
    indentationCount = stackFramesInCurrentFile - 2;
    indentation = `${indentationCount}` + ">>".repeat(indentationCount);
  }

  return function(value) {
    if (isLoggingEnabled)
      console.log(
        `\n\n\n\n${indentation}${label ? label + ":" : ""}\n\n${value}`
      );
    return value;
  };
}

const buildDirAbsolutePathSegments = [
  process.env["HOME"],
  "Dropbox",
  "Apps",
  "RemarqDocuments"
];
const buildDirAbsolutePath = path.join(...buildDirAbsolutePathSegments);
// glob uses forward slashes regardless if on windows or not
const buildDirGlob = buildDirAbsolutePathSegments.join("/") + "/*.*";
rimraf.sync(buildDirGlob, null, e => console.log(e));

const mdFilePaths = sync(["manuscript/**/*.md"]);
console.log({ mdFilePaths });

const result = mdFilePaths
  .map(sourceFilePath => [
    sourceFilePath,
    fs.readFileSync(sourceFilePath, { encoding: "utf8" })
  ])
  .map(([sourceFilePath, sourceFileBody]) => {
    const destFilePath = sourceFilePath.replace(
      "manuscript",
      buildDirAbsolutePath
    );
    // const slice = b => b.slice(0, 20);
    const destFileBody = pandocify(sourceFileBody);
    return [destFilePath, destFileBody];
  })
  // .map(log())
  .map(destFile => fs.writeFileSync(...destFile))
  .map(id);

const log = (...attrs) => conditionalLog(true, ...attrs);
log("RESULT")(result);
