const path = require("path");
const fs = require("fs");
const CryptoJS = require("crypto-js");

module.exports = function (source) {
  const options = this.getOptions();
  const imagePath = options.imagePath;
  const matches = [...source.matchAll(/src="(.*)"/g)];

  for (const match of matches) {
    const start = source.substring(0, match.index);
    let end = source.substring(match.index, source.length);

    const imageFilePath = path.join(imagePath, match[1]);
    const data  = fs.readFileSync(imageFilePath)
    const hash = CryptoJS.SHA256(data);
    const hash8Chars = hash.toString(CryptoJS.enc.Base64).slice(0, 8);

    // Replace src with src + hash
    const replaceString = `${match[1]}?v=${hash8Chars}`;
    end = end.replace(match[1], replaceString);
    source = start + end;
  }

  return source;
};
