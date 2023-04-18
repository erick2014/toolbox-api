const createError = require("http-errors");
const express = require("express");

const indexRouter = require("./routes/index");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(indexRouter);
app.get("/", (req, res) => {
  res.send("hello world!");
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
