const util = require("util");
const multer = require("multer");
var colors = require('colors');
const maxSize = 2 * 2048 * 2048;
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./content/uploads/temp");
  },
  filename: (req, file, cb) => {
    console.log("i ".cyan.bold+`Upload started: ${file.originalname}`.gray);
    cb(null, file.originalname);
  },
});
let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;