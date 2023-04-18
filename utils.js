const https = require("https");

function fetch(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        resolve(data);
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}

const cleanUpData = async (dataCollected) => {
  console.log("data collected ", dataCollected);
  return new Promise((resolve) => {
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
          if (file === fileName && Number(number)) {
            validLines.push({ text, number, hex });
          }
        }
      });
      finalData.push({ file: fileName, lines: validLines });
    });
    resolve(finalData);
  });
};

module.exports = { fetch, cleanUpData };
