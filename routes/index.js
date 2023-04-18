const express = require("express");
const router = express.Router();
const fetch = require("../utils");

const processDataFound = async (dataCollected) => {
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

//get files from remote server
router.get("/files/data", async function (_, res, next) {
  try {
    const trackResponses = {};
    const options = {
      hostname: "echo-serv.tbxnet.com",
      path: "/v1/secret/files",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer aSuperSecretKey",
      },
    };
    const response = await fetch(options);
    const data = JSON.parse(response);

    if (!data.files) {
      next(new Error("no files found to process"));
      return;
    }

    data.files.map((fileName) => (trackResponses[fileName] = null));
    const requestOptions = { ...options };

    for await (const file of data.files) {
      requestOptions.path = `/v1/secret/file/${file}`;
      const response = await fetch(requestOptions);
      if (!trackResponses[file]) {
        trackResponses[file] = response;
      }
    }
    const dataReady = await processDataFound(trackResponses);
    res.send(dataReady);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
