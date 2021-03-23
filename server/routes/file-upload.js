const express = require("express");
const router = express.Router();
// provide the middleware for handling multipart/form-data, primarily used for uploading files
const multer = require("multer");
const AWS = require("aws-sdk");
const paramsConfig = require("../utils/params-config");

// create a temporary storage container that will hold the image files until it is ready to be uploaded to the S3 bucket
const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

// image is the key!
const upload = multer({ storage }).single("image");

// instantiate the service object, s3
//  locked the version number as a precautionary measure in case the default S3 version changes
const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
});

router.post("/file-upload", upload, (req, res) => {
  // set up params config
  const params = paramsConfig(req.file);
  // set up S3 service call
  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.json(data);
  });
});
module.exports = router;
