const path = require("path");
const fs = require("fs");
const fp = require("lodash/fp");
const { conditionalLog, json } = require("./util");

function pandocifyMarkuaCodeBlocks(sourceFileBody) {
  const isLoggingEnabled = false;
  // const isLoggingEnabled = true;
  const log = (...attrs) => conditionalLog(isLoggingEnabled, ...attrs);
  function replacer(match, attributes, language, code) {
    // log("match")(json({ attributes, language, code }), null, 2);

    const idMatch = attributes.match(/(.*)#(\w+)(.*)/);
    // log("idMatch")(json(idMatch));
    let _discard, beforeIdAttr, idAttr, afterIdAttr;
    if (idMatch) {
      [_discard, beforeIdAttr, idAttr, afterIdAttr] = idMatch;
      attributes = beforeIdAttr + afterIdAttr;
    }
    const srcAttrs = attributes.split(/\s*,\s*/).reduce((srcAttrs, chunk) => {
      const [key, value] = chunk.split(/\s*:\s*/).map(fp.trimChars(' "'));
      const result = Object.assign({}, srcAttrs);
      if (key && value) result[key] = value;
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

    const destCode = code
      .replace(/markua-start-delete/g, "Delete the line(s) between here...")
      .replace(/markua-end-delete/g, "...and here.")
      .replace(/markua-start-insert/g, "Insert the line(s) between here...")
      .replace(/markua-end-insert/g, "...and here.");

    const replacement = `

\`\`\` ${destAttrsStr}
${destCode}
\`\`\`

`;
    return log("replacement")(replacement);
  }

  const result = sourceFileBody.replace(
    /\n\n{(.+)}\n```(.*)\n([\s\S]*?)\n```\n\n/g,
    replacer
  );
  return result;
}

function pandocifyLfmCodeBlocks(sourceFileBody) {
  const isLoggingEnabled = false;
  const log = (...attrs) => conditionalLog(isLoggingEnabled, ...attrs);
  function replacer(match, g1, g2) {
    let attributes = fp.pipe(
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
    let _discard, beforeIdAttr, idAttr, afterIdAttr;
    if (idMatch) {
      [_discard, beforeIdAttr, idAttr, afterIdAttr] = idMatch;
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

    const destAttrsStr =
      destAttrs.length > 0 ? ` {${destAttrs.join(" ")}}` : "";

    const destCode = code
      .replace(/leanpub-start-delete/g, "Delete the line(s) between here...")
      .replace(/leanpub-end-delete/g, "...and here.")
      .replace(/leanpub-start-insert/g, "Insert the line(s) between here...")
      .replace(/leanpub-end-insert/g, "...and here.");

    const replacement = `

\`\`\`${destAttrsStr}
${destCode}
\`\`\`

`;
    return log("replacement")(replacement);
  }

  const result = sourceFileBody.replace(
    /\n\n({.*}\n)?((?: {4}[\s\S]*?(?:\n\n {4}[\s\S]*?)?)+)\n\n/g,
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
function transcludeMarkuaCodeSamples(sourceFileBody) {
  const isLoggingEnabled = false;
  const log = (...attrs) => conditionalLog(isLoggingEnabled, ...attrs);

  function replacer(match, g1, g2, g3) {
    let attributes = fp.pipe(
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
    let _discard, beforeIdAttr, idAttr, afterIdAttr;
    if (idMatch) {
      [_discard, beforeIdAttr, idAttr, afterIdAttr] = idMatch;
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
      destAttrs.length > 0 ? `{${destAttrs.join(", ")}}\n` : "";

    const replacement = `

${destAttrsStr}\`\`\`
${code}
\`\`\`

`;
    return log("replacement")(replacement);
  }

  const result = sourceFileBody.replace(
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
// pandocifyLfmCodeBlocks)
function transcludeLfmCodeSamples(sourceFileBody) {
  const isLoggingEnabled = false;
  const log = (...attrs) => conditionalLog(isLoggingEnabled, ...attrs);

  function replacer(match, g1, g2, g3) {
    let attributes = fp.pipe(
      fp.trim,
      fp.trimChars(["{", "}"])
    )(g1);

    const title = g2;
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
        title,
        relativePath,
        codeSampleBodyLength: codeSampleBody.length
      }),
      null,
      2
    );

    const idMatch = attributes.match(/(.*)#(\w+)(.*)/);
    log("idMatch")(json(idMatch));
    let _discard, beforeIdAttr, idAttr, afterIdAttr;
    if (idMatch) {
      [_discard, beforeIdAttr, idAttr, afterIdAttr] = idMatch;
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

    const destTitle = fp.trimChars(' "')(title || srcAttrs.title);
    if (destTitle) {
      destAttrs.push(`title="${destTitle}"`);
    }
    delete srcAttrs.title;

    const codeSampleLines = codeSampleBody.split("\n");
    // It seems like crop-start/end-line are inclusive and 1-indexed
    const cropStartLine = Number(srcAttrs["crop-start-line"]) - 1 || 0;
    const cropEndLine =
      Number(srcAttrs["crop-end-line"]) || codeSampleLines.length;
    delete srcAttrs["crop-start-line"];
    delete srcAttrs["crop-end-line"];
    const code = codeSampleLines
      .slice(cropStartLine, cropEndLine)
      .map(line => " ".repeat(4) + line)
      .join("\n");

    Object.keys(srcAttrs)
      .map(key => `${key}=${srcAttrs[key]}`)
      .forEach(destAttr => destAttrs.push(destAttr));

    const destAttrsStr =
      destAttrs.length > 0 ? `{${destAttrs.join(", ")}}\n` : "";

    const replacement = `

${destAttrsStr}${code}

`;
    return log("replacement")(replacement);
  }

  const result = sourceFileBody.replace(
    /\n\n({.*}\n)?<<\[(.*)\]\((.+)\)\n\n/g,
    replacer
  );
  return result;
}

// {#animating-react-redux}
// # Animating with React, Redux, and d3
// Into this:
// # Animating with React, Redux, and d3 {#animating-react-redux}
function pandocifyMarkuaHeaders(sourceFileBody) {
  function replacer(match, newlinesBefore, attributes, header) {
    const replacement = `${newlinesBefore}${header.replace(
      /[ #]*$/,
      ""
    )} ${attributes}\n\n`;

    // log("replacement")(replacement);
    return replacement;
  }

  const result = sourceFileBody.replace(
    /(^|\n\n)({.*})\n(#+.*)\n\n/g,
    replacer
  );
  return result;
}

// LFM and Markua have the same header attribute format.
// {#animating-react-redux}
// # Animating with React, Redux, and d3
// Into this:
// # Animating with React, Redux, and d3 {#animating-react-redux}
function pandocifyLfmHeaders(sourceFileBody) {
  return pandocifyMarkuaHeaders(sourceFileBody);
}

function pandocifyMarkua(sourceFileBody) {
  const pipeline = fp.pipe(
    transcludeMarkuaCodeSamples,
    pandocifyMarkuaCodeBlocks,
    pandocifyMarkuaHeaders,
    deleteMarkuaSpecialNames
  );
  return pipeline(sourceFileBody);
}

function deleteLfmSpecialNames(sourceFileBody) {
  const isLoggingEnabled = false;
  // const isLoggingEnabled = true;
  const log = (...attrs) => conditionalLog(isLoggingEnabled, ...attrs);

  function replacer(match) {
    const replacement = "";

    log("replacement")(json({ match, replacement }));
    return replacement;
  }

  const result = sourceFileBody.replace(
    /(?:^|\n){(?:frontmatter|pagebreak|mainmatter|backmatter)}(?:\n|$)/g,
    replacer
  );
  return result;
}

function deleteMarkuaSpecialNames(sourceFileBody) {
  return deleteLfmSpecialNames(sourceFileBody);
}

function pandocifyLfm(sourceFileBody) {
  const pipeline = fp.pipe(
    transcludeLfmCodeSamples,
    pandocifyLfmCodeBlocks,
    pandocifyLfmHeaders,
    deleteLfmSpecialNames
  );
  return pipeline(sourceFileBody);
}

let srcDirAbsolutePath = null;

function pandocify(manuscriptAbsolutePath, sourceFileBody) {
  srcDirAbsolutePath = manuscriptAbsolutePath;
  const convert = sourceFileBody.includes("\n```\n")
    ? pandocifyMarkua
    : pandocifyLfm;
  return convert(sourceFileBody);
}

module.exports = { pandocify };
