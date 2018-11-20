const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const _ = require("lodash");
const fp = require("lodash/fp");
const mkdirp = require("mkdirp");
const { execSync } = require("child_process");
const leftPad = require("left-pad");

function json(obj) {
  return JSON.stringify(obj, null, 2);
}

function pandocifyMarkuaCodeBlocks(fileBody) {
  const isLoggingEnabled = false;
  // const isLoggingEnabled = true;
  const log = (...attrs) => conditionalLog(isLoggingEnabled, ...attrs);
  function replacer(match, attributes, language, code) {
    // log("match")(json({ attributes, language, code }), null, 2);

    const idMatch = attributes.match(/(.*)#(\w+)(.*)/);
    // log("idMatch")(json(idMatch));
    let discard, beforeIdAttr, idAttr, afterIdAttr;
    if (idMatch) {
      [discard, beforeIdAttr, idAttr, afterIdAttr] = idMatch;
      attributes = beforeIdAttr + afterIdAttr;
    }
    const attrRegExp = /\s*(.+): "(.*)"/;
    const srcAttrs = attributes.split(/\s*,\s*/).reduce((srcAttrs, chunk) => {
      const srcAttrMatches = chunk.match(attrRegExp);
      // log("srcAttrMatches")(json(srcAttrMatches));
      const [key, value] = srcAttrMatches
        ? [srcAttrMatches[1], srcAttrMatches[2]]
        : [null, null];
      const result = Object.assign({}, srcAttrs);
      if (key !== null && value !== null) result[key] = value;
      return result;
    }, {});

    // log("srcAttrs")(json(srcAttrs));

    let destAttrs = [];

    if (idAttr) destAttrs.push(`#${idAttr}`);

    const langClass = language || srcAttrs.format;
    log("markuaLanguage")(langClass);
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

    // Remove LFM's 4-space indentation from code blocks
    const code = g2
      .split("\n")
      .map(line => line.slice(4))
      .join("\n");

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

// Turn this:
// {crop-start: 5, crop-end: 48, format: javascript, line-numbers: false}
// ![Data parsing functions](code_samples/es6v2/DataHandling.js)
//
// Into a Markua code block (don't pandocify it here, that will be done by
// pandocifyMarkuaCodeBlocks)
function transcludeMarkuaCodeSamples(fileBody) {
  const isLoggingEnabled = false;
  const log = (...attrs) => conditionalLog(isLoggingEnabled, ...attrs);

  function replacer(match, g1, g2, g3) {
    const attributes = fp.pipe(
      fp.trim,
      fp.trimChars(["{", "}"])
    )(g1);

    const caption = g2;
    const relativePath = g3;
    const codeSampleAbsolutePath = path.join(
      srcDirAbsolutePath,
      "resources",
      relativePath
    );
    const codeSampleBody = fs.readFileSync(codeSampleAbsolutePath, {
      encoding: "utf8"
    });

    log("match")(
      json({
        match,
        g1,
        g2,
        g3,
        caption,
        relativePath,
        codeSampleBodyLength: codeSampleBody.length
      }),
      null,
      2
    );

    const idMatch = attributes.match(/(.*)#(\w+)(.*)/);
    log("idMatch")(json(idMatch));
    let discard, beforeIdAttr, idAttr, afterIdAttr;
    if (idMatch) {
      [discard, beforeIdAttr, idAttr, afterIdAttr] = idMatch;
      attributes = beforeIdAttr + afterIdAttr;
    }
    const attrRegExp = /\s*(.+):(.+)/;
    const srcAttrs = attributes.split(/\s*,\s*/).reduce((srcAttrs, chunk) => {
      const srcAttrMatches = chunk.match(attrRegExp);
      // log("srcAttrMatches")(json({ srcAttrs, srcAttrMatches }));
      const [key, value] = srcAttrMatches
        ? [srcAttrMatches[1], srcAttrMatches[2]]
        : [null, null];
      const result = Object.assign({}, srcAttrs);
      if (key !== null && value !== null) result[key] = value;
      return result;
    }, {});

    log("srcAttrs")(json(srcAttrs));

    let destAttrs = [];

    const id = idAttr || srcAttrs.id;
    if (id) {
      destAttrs.push(`#${id}`);
      delete srcAttrs.id;
    }

    const destCaption = fp.trimChars(' "')(caption || srcAttrs.caption);
    if (destCaption) {
      destAttrs.push(`caption: "${destCaption}"`);
    }
    delete srcAttrs.caption;

    const codeSampleLines = codeSampleBody.split("\n");
    // It seems like crop-start/end-line are inclusive and 1-indexed
    const cropStartLine = Number(srcAttrs["crop-start"]) - 1 || 0;
    const cropEndLine = Number(srcAttrs["crop-end"]) || codeSampleLines.length;
    delete srcAttrs["crop-start"];
    delete srcAttrs["crop-end"];
    const code = codeSampleLines.slice(cropStartLine, cropEndLine).join("\n");

    Object.keys(srcAttrs)
      .map(key => `${key}:${srcAttrs[key]}`)
      .forEach(destAttr => destAttrs.push(destAttr));

    const destAttrsStr =
      destAttrs.length > 0 ? `{${destAttrs.join(", ")}}` : "";

    const replacement = `
${destAttrsStr}
\`\`\`
${code}
\`\`\`\n
`;
    return log("replacement")(replacement);
  }

  const result = fileBody.replace(
    /\n({.*}\n)?!\[(.*)\]\((code_samples.+)\)\n\n/g,
    replacer
  );
  return result;
}

// LFM === "Leanpub-Flavored Markdown"
//
// Turn this:
// {crop-start-line=4,crop-end-line=17,linenos=on,starting-line-number=19}
//   <<[Add LESS loaders](code_samples/env/webpack.config.dev.js)
//
// Into an LFM code block (don't pandocify it here, that will be done by
// pandocifyLFMCodeBlocks)
function transcludeLFMCodeSamples(fileBody) {
  const isLoggingEnabled = false;
  const log = (...attrs) => conditionalLog(isLoggingEnabled, ...attrs);

  function replacer(match, g1, g2, g3) {
    const attributes = fp.pipe(
      fp.trim,
      fp.trimChars(["{", "}"])
    )(g1);

    const caption = g2;
    const relativePath = g3;
    const codeSampleAbsolutePath = path.join(
      srcDirAbsolutePath,
      "resources",
      relativePath
    );
    const codeSampleBody = fs.readFileSync(codeSampleAbsolutePath, {
      encoding: "utf8"
    });

    log("match")(
      json({
        match,
        g1,
        g2,
        g3,
        caption,
        relativePath,
        codeSampleBodyLength: codeSampleBody.length
      }),
      null,
      2
    );

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
      // log("srcAttrMatches")(json({ srcAttrs, srcAttrMatches }));
      const [key, value] = srcAttrMatches
        ? [srcAttrMatches[1], srcAttrMatches[2]]
        : [null, null];
      const result = Object.assign({}, srcAttrs);
      if (key !== null && value !== null) result[key] = value;
      return result;
    }, {});

    log("srcAttrs")(json(srcAttrs));

    let destAttrs = [];

    const id = idAttr || srcAttrs.id;
    if (id) {
      destAttrs.push(`#${id}`);
      delete srcAttrs.id;
    }

    const destCaption = fp.trimChars(' "')(caption || srcAttrs.caption);
    if (destCaption) {
      destAttrs.push(`caption="${destCaption}"`);
    }
    delete srcAttrs.caption;

    const codeSampleLines = codeSampleBody.split("\n");
    // It seems like crop-start/end-line are inclusive and 1-indexed
    const cropStartLine = Number(srcAttrs["crop-start-line"]) - 1 || 0;
    const cropEndLine =
      Number(srcAttrs["crop-end-line"]) || codeSampleLines.length;
    delete srcAttrs["crop-start-line"];
    delete srcAttrs["crop-end-line"];
    const code = codeSampleLines.slice(cropStartLine, cropEndLine).join("\n");

    Object.keys(srcAttrs)
      .map(key => `${key}=${srcAttrs[key]}`)
      .forEach(destAttr => destAttrs.push(destAttr));

    const destAttrsStr =
      destAttrs.length > 0 ? `{${destAttrs.join(", ")}}` : "";

    const replacement = `
\`\`\`${destAttrsStr}
${code}
\`\`\`
`;
    return log("replacement")(replacement);
  }

  const result = fileBody.replace(
    /\n\n({.*}\n)?<<\[(.*)\]\((.+)\)\n\n/g,
    replacer
  );
  return result;
}

// {#animating-react-redux}
// # Animating with React, Redux, and d3
// Into this:
// # Animating with React, Redux, and d3 {#animating-react-redux}
function pandocifyMarkuaHeaders(fileBody) {
  const isLoggingEnabled = false;
  // const isLoggingEnabled = true;
  const log = (...attrs) => conditionalLog(isLoggingEnabled, ...attrs);

  function replacer(match, newlinesBefore, attributes, header) {
    const replacement = `${newlinesBefore}${header.replace(
      /[ #]*$/,
      ""
    )} ${attributes}\n\n`;

    return log("replacement")(replacement);
    return replacement;
  }

  const result = fileBody.replace(/(^|\n\n)({.*})\n(#+.*)\n\n/g, replacer);
  return result;
}

// LFM and Markua have the same header attribute format.
// {#animating-react-redux}
// # Animating with React, Redux, and d3
// Into this:
// # Animating with React, Redux, and d3 {#animating-react-redux}
function pandocifyLFMHeaders(fileBody) {
  return pandocifyMarkuaHeaders(fileBody);
}

function pandocifyMarkua(sourceFileBody) {
  const pipeline = fp.pipe(
    transcludeMarkuaCodeSamples,
    pandocifyMarkuaCodeBlocks,
    pandocifyMarkuaHeaders
  );
  return pipeline(sourceFileBody);
}

function pandocifyLFM(sourceFileBody) {
  const pipeline = fp.pipe(
    transcludeLFMCodeSamples,
    pandocifyLFMCodeBlocks,
    pandocifyLFMHeaders
  );
  return pipeline(sourceFileBody);
}

function pandocify(sourceFileBody) {
  const convert = sourceFileBody.includes("\n```\n")
    ? pandocifyMarkua
    : pandocifyLFM;
  return convert(sourceFileBody);
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

const srcDirAbsolutePath = path.join(path.dirname(__filename), "manuscript");

const buildDirAbsolutePath = path.resolve("./build/pandoc-markdown");
rimraf.sync(buildDirAbsolutePath, null, e => console.log(e));
mkdirp.sync(buildDirAbsolutePath);

// const mdFilePaths = sync([srcDirAbsolutePath + "/**/*.md"]);
// const mdFilePaths = [path.resolve("manuscript/the-new-meat.md")];
const mdFileNames = fs
  .readFileSync(path.resolve(srcDirAbsolutePath, "Book.txt"), {
    encoding: "utf8"
  })
  .trim()
  .split("\n")
  .map(fp.trim);
console.log({ mdFileNames });

const log = (...attrs) => conditionalLog(true, ...attrs);

const fullPandocMarkdown = mdFileNames
  .map(mdFileName => [
    mdFileName,
    fs.readFileSync(path.resolve(srcDirAbsolutePath, mdFileName), {
      encoding: "utf8"
    })
  ])
  .map(([mdFileName, sourceFileBody], i) => {
    const destFilePath = leftPad(i, 2, "0") + "-" + mdFileName;
    console.log(destFilePath);
    const destFileBody = pandocify(sourceFileBody);
    return [destFilePath, destFileBody];
  })
  .map(([_, destFileBody]) => destFileBody)
  .join("\n\n");
// .map(([destFilePath, destFileBody]) => {
//   const destFileAbsolutePath = path.resolve(
//     buildDirAbsolutePath,
//     destFilePath
//   );
//   fs.writeFileSync(destFileAbsolutePath, destFileBody);
//   return destFileAbsolutePath;
// });
// .map(log());

// TODO change fullPandocMarkdown destination filename
fs.writeFileSync(
  path.resolve(buildDirAbsolutePath, "the-new-meat.md"),
  fullPandocMarkdown
);

function runShellCommand(commandString) {
  console.log("\n\nRunning:");
  console.log(commandString);
  let output;
  try {
    output = String(execSync(commandString));
  } catch (e) {
    console.log("ERROR: Probably because there weren't any changes.");
    output = String(e);
  }
  console.log("\noutput:", output);
}

const pandocCommand =
  "pandoc -f markdown -t gfm -o ./build/gfm/the-new-meat.md ./build/pandoc-markdown/the-new-meat.md";

runShellCommand(pandocCommand);

function splitIntoSectionsAndLectures() {
  const fullGfmBody = fs.readFileSync("./build/gfm/the-new-meat.md", {
    encoding: "utf8"
  });

  const gfmContentRepoAbsolutePath = path.resolve("./../content");
  const destContentAbsolutePath = path.resolve(
    gfmContentRepoAbsolutePath,
    "teachable-gfm-markdown"
  );

  rimraf.sync(destContentAbsolutePath, null, e => console.log(e));

  let sectionDirectoryName = "";
  let lectureFileName = "";
  let sectionIndex = 0;
  let lectureIndex = 0;
  let srcLineIndex = 0;
  let destLines = [];
  const srcLines = fullGfmBody.split("\n");

  while (srcLineIndex < srcLines.length) {
    const srcLine = srcLines[srcLineIndex];
    if (
      sectionDirectoryName &&
      lectureFileName &&
      !srcLine.includes("end-lecture")
    ) {
      destLines.push(srcLine);
    } else if (
      sectionDirectoryName &&
      lectureFileName &&
      srcLine.includes("end-lecture")
    ) {
      fs.writeFileSync(
        path.resolve(
          destContentAbsolutePath,
          sectionDirectoryName,
          lectureFileName
        ),
        destLines.join("\n")
      );
      lectureFileName = "";
    } else if (
      sectionDirectoryName &&
      !lectureFileName &&
      srcLine.includes("end-section")
    ) {
      sectionDirectoryName = "";
      sectionIndex++;
    } else if (
      sectionDirectoryName &&
      !lectureFileName &&
      srcLine.includes("begin-lecture")
    ) {
      const lectureTitle = srcLine.match(/title="(.*)"/)[1];
      lectureFileName = `s${leftPad(sectionIndex, 2, "0")}e${leftPad(
        lectureIndex,
        2,
        "0"
      )} - ${lectureTitle}.md`;
      lectureIndex++;
      destLines = [];
    } else if (
      !sectionDirectoryName &&
      !lectureFileName &&
      srcLine.includes("begin-section")
    ) {
      const sectionTitle = srcLine.match(/title="(.*)"/)[1];
      sectionDirectoryName = `s${leftPad(sectionIndex, 2, "0")}`;
      mkdirp.sync(path.resolve(destContentAbsolutePath, sectionDirectoryName));
    } else {
      // process.stdout.write(".");
    }

    srcLineIndex++;
  }

  const githubPushCommand = `cd ${gfmContentRepoAbsolutePath} && git add . && git commit -m "Automated commit" && git push origin master && cd -`;

  runShellCommand(githubPushCommand);
}

splitIntoSectionsAndLectures();
