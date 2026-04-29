const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// make a folder to hold your videos
if (!fs.existsSync("videos")) fs.mkdirSync("videos");

// set up how files get saved
const storage = multer.diskStorage({
  destination: "videos/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// upload a video
app.post("/upload", upload.single("video"), (req, res) => {
  res.json({ success: true });
});

// list videos
app.get("/videos", (req, res) => {
  const files = fs.readdirSync("videos").map(name => ({ name }));
  res.json(files);
});

// play a video
app.get("/video/:name", (req, res) => {
  const filePath = "videos/" + req.params.name;
  if (!fs.existsSync(filePath)) return res.status(404).end();

  res.sendFile(filePath, { root: process.cwd() });
});

// start your cloud
app.listen(3000, () => console.log("Your cloud is running at http://localhost:3000"));
