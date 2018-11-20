const fs = require("fs");
const fetch = require("node-fetch");
const emojiPatterns = require("emoji-patterns");
const sync = require("glob-gitignore").sync;

const emojiAllRegexp = new RegExp(emojiPatterns["Emoji_All"], "gu");

function emojiAliasDict(emojiData) {
  return emojiData.reduce(
    (dictionary, item) => (
      (dictionary[item.emoji] = `:${item.aliases[0]}:`), dictionary
    ),
    {}
  );
}

function aliasEmojiDict(emojiData) {
  return emojiData.reduce((dictionary, item) => {
    item.aliases.forEach(alias => {
      dictionary[`:${alias}:`] = item.emoji;
    });
    return dictionary;
  }, {});
}

console.log(process.argv);

fetch("https://www.gitcdn.xyz/repo/github/gemoji/master/db/emoji.json")
  .then(res => res.json())
  .then(json => {
    const textFilePaths = sync(["**/*.md", "**/*.txt"], {
      ignore: "node_modules/*"
    });
    console.log({ textFilePaths });

    const conversionDirection = process.argv[2];

    if (conversionDirection === "--colonify") {
      const dictionary = emojiAliasDict(json);

      textFilePaths.forEach(textFilePath => {
        const originalFile = fs.createReadStream(textFilePath, "utf8");
        let transformedContent = "";

        originalFile.on("data", chunk => {
          transformedContent += chunk
            .toString()
            .replace(emojiAllRegexp, emoji => {
              const alias = dictionary[emoji];
              if (alias) console.log(`${textFilePath} ${emoji} ${alias}`);
              const replacement = alias || emoji;

              return replacement;
            });
        });

        originalFile.on("end", () => {
          fs.writeFile(textFilePath, transformedContent, err => {
            if (err) {
              return console.log(err);
            }
          });
        });
      });
    } else if (conversionDirection === "--emojify") {
      const dictionary = aliasEmojiDict(json);
      const regexpString = "(" + Object.keys(dictionary).join("|") + ")";

      const aliasAllRegexp = new RegExp(regexpString, "g");

      textFilePaths.forEach(textFilePath => {
        const originalFile = fs.createReadStream(textFilePath, "utf8");
        let transformedContent = "";

        originalFile.on("data", chunk => {
          transformedContent += chunk
            .toString()
            .replace(aliasAllRegexp, alias => {
              const emoji = dictionary[alias];
              if (emoji) console.log(`${textFilePath} ${alias} ${emoji}`);
              const replacement = emoji || alias;

              return replacement;
            });
        });

        originalFile.on("end", () => {
          fs.writeFile(textFilePath, transformedContent, err => {
            if (err) {
              return console.log(err);
            }
          });
        });
      });
    }
  });
