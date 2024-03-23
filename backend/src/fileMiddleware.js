const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempFolderPath = path.join(__dirname, "../tempFiles");
    if (!fs.existsSync(tempFolderPath)) {
      fs.mkdirSync(tempFolderPath);
    }
    cb(null, tempFolderPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}_${Math.floor(Math.random() * 10000)}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });
const uploadMiddleware = upload.single("recfile");

module.exports = uploadMiddleware
