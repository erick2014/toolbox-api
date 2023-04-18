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
  return new Promise((resolve, reject) => {
    const finalData = Object.keys(dataCollected).map((fileName) => {
      let fileContent = dataCollected[fileName];

      if (fileContent.includes("{") || fileContent.includes("}")) {
        return null;
      }

      const lines = fileContent.split("\n");
      const EXPECTED_LENGTH = lines[0].split(",").length;
      const validLines = [];
      console.log("current lines ", lines);
      lines.map((line, index) => {
        const lineContent = line.split(",");

        if (lineContent.length === EXPECTED_LENGTH) {
          if (index === 0) {
            validLines.push(line);
            return;
          }
          [file, text, number, hex] = lineContent;
          if (file === fileName && Number(number)) {
            validLines.push(line);
          }
        }
      });
      console.log("valid lines ", validLines);
      return { [fileName]: validLines };
    });
    resolve(finalData);
  });
};

module.exports = { fetch, cleanUpData };
