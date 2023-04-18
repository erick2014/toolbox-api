const express = require("express");
const router = express.Router();
const fetch = require("../utils");

//get files from remote server
router.get("/files/data", async function (_, res, next) {
  try {
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
    console.log("response ", response);
    res.send("hello world");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
