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
\`\`\`${destAttrsStr}
${code}
\`\`\`
`;
    return log("replacement")(replacement);
  }

  const result = fileBody.replace(
    /\n\n({.*}\n)?!\[(.*)\]\((code_samples.+)\)\n\n/g,
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
  const isLoggingEnabled = true;
  const log = (...attrs) => conditionalLog(isLoggingEnabled, ...attrs);

  function replacer(match, attributes, header) {
    const replacement = `${header} ${attributes}`;

    return log("replacement")(replacement);
    return replacement;
  }

  const result = fileBody.replace(/\n\n({.*})\n(#+.*)\n\n/g, replacer);
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

const mdFilePaths = sync([srcDirAbsolutePath + "/**/*.md"]);
console.log({ mdFilePaths });

const result = mdFilePaths
  .map(sourceFilePath => [
    sourceFilePath,
    fs.readFileSync(sourceFilePath, { encoding: "utf8" })
  ])
  .map(([sourceFilePath, sourceFileBody]) => {
    const destFilePath = sourceFilePath.replace(
      srcDirAbsolutePath,
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
