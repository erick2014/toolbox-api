const isHex32 = (str) => /^([0-9A-Fa-f]{2}){16}$/.test(str);

const cleanUpData = (dataCollected) => {
  const finalData = [];
  Object.keys(dataCollected).forEach((fileName) => {
    const validLines = [];
    let fileContent = dataCollected[fileName];

    if (fileContent.includes("{") || fileContent.includes("}")) {
      finalData.push({ file: fileName, lines: validLines });
      return;
    }
    const lines = fileContent.split("\n");
    const EXPECTED_LENGTH = lines[0].split(",").length;

    lines.map((line, index) => {
      const lineContent = line.split(",");
      if (index > 0 && lineContent.length === EXPECTED_LENGTH) {
        [file, text, number, hex] = lineContent;

        if (file === fileName && Number(number) && isHex32(hex)) {
          validLines.push({ text, number, hex });
        }
      }
    });
    finalData.push({ file: fileName, lines: validLines });
  });
  return finalData;
};

module.exports = cleanUpData;
