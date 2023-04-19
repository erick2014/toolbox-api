const express = require("express");
const router = express.Router();
const { fetch, getRequestOptions } = require("../utils/fetch");
const cleanUpData = require("../utils/dataCleaner");

//get files from remote server
router.get("/files/data", async function (req, res, next) {
  console.log("files/data endpoint called");
  const dataCollected = {};
  const fileNameFromQueryParam = req.query.fileName;
  try {
    if (fileNameFromQueryParam) {
      const fileName = fileNameFromQueryParam.includes(".csv")
        ? fileNameFromQueryParam
        : `${fileNameFromQueryParam}.csv`;

      const options = getRequestOptions(`/v1/secret/file/${fileName}`);
      const response = await fetch(options);
      dataCollected[fileName] = response;
      const dataReady = cleanUpData(dataCollected);
      res.json(dataReady);
      return;
    }

    const options = getRequestOptions("/v1/secret/files");
    const response = await fetch(options);
    const data = JSON.parse(response);

    if (!data.files) {
      next(new Error("no files found to process"));
      return;
    }

    data.files.map((fileName) => (dataCollected[fileName] = null));
    const requestOptions = { ...options };

    for await (const file of data.files) {
      requestOptions.path = `/v1/secret/file/${file}`;
      const response = await fetch(requestOptions);
      if (!dataCollected[file]) {
        dataCollected[file] = response;
      }
    }
    const dataReady = cleanUpData(dataCollected);
    res.json(dataReady);
  } catch (error) {
    next(error);
  }
});

router.get("/files/list", async function (_, res, next) {
  const response = await fetch(getRequestOptions("/v1/secret/files"));
  const data = JSON.parse(response);
  res.json(data);
});

module.exports = router;
