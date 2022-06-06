const util = require("util");
const multer = require("multer");
const maxSize = 2 * 2048 * 2048;
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Filing-Saucer/uploads/temp");
  },
  filename: (req, file, cb) => {
    console.log(`--\nUpload started: ${file.originalname}\n--`);
    cb(null, file.originalname);
  },
});
let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;