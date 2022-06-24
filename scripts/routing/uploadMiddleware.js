require('dotenv').config({path:"__dirname/.env"});
const util = require("util");
const multer = require("multer");
var colors = require('colors');
const maxSize = process.env.maxSize * 1000 * 1000;
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