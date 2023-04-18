const express = require("express");
const router = express.Router();
const fetch = require("../utils/fetch");
const cleanUpData = require("../utils/dataCleaner");

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
    const dataReady = cleanUpData(trackResponses);
    res.send(dataReady);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
