const { v4: uuidv4 } = require("uuid");

// configure the file
// the params function receives a parameter called fileName, which this function will receive as an argument from the Express route.
const params = (fileName) => {
  const myFile = fileName.originalname.split(".");
  const fileType = myFile[myFile.length - 1];

  const imageParams = {
    Bucket: "user-images-0fea095c-590e-4979-ad67-c0912b7b11bd", //Bucket with the name of the S3 bucket we created previously
    Key: `${uuidv4()}.${fileType}`, //Key property, which is the name of this file
    Body: fileName.buffer, // Body property,temporary storage container of the image file. Once the buffer has been used, the temporary storage space is removed by multer.
    ACL: "public-read", // Allow read access to this file
  };

  return imageParams;
};

module.exports = params;
