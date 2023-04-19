const https = require("https");

const getRequestOptions = (path, method = "GET") => ({
  hostname: "echo-serv.tbxnet.com",
  path,
  method,
  headers: {
    "Content-Type": "application/json",
    authorization: "Bearer aSuperSecretKey",
  },
});

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

module.exports = { fetch, getRequestOptions };
