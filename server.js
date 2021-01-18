require("dotenv").config();
const basicAuth = require("express-basic-auth");
const express = require("express");
const multer = require("multer");
const upload = multer({ dest: __dirname + "/uploads/images" });
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const app = express();
const PORT = 3000;

app.use(
  basicAuth({ challenge: true, users: { user: process.env.PASSWORD } }),
  express.static("public")
);

app.post("/upload", upload.single("photo"), async function (req, res) {
  if (req.file) {
    const { stdout, stderr } = await exec(
      `\"C:\\Program Files\\IrfanView\\i_view32.exe\" ${req.file.path} /print`
    );

    if (stderr) {
      console.error(`error: ${stderr}`);
    }

    console.log(`sent photo to printer`);

    res.json(req.file);
  } else throw "error";
});

app.listen(PORT, () => {
  console.log("Listening at " + PORT);
});
