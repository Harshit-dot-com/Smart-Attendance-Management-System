const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log(`Server has started at port ${port}`);
});

app.post("/readPython", (req, res) => {
  var dataToSend;
  const python = spawn("python", ["UI.py"]);
  python.stdout.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  python.on("exit", (code) => {
    console.log(`child process exited with ${code}, ${dataToSend}`);
    res.sendFile(`${__dirname}/index.html`);
  });
});
