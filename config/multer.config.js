const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: function(req, file) {
    if (file.fieldname === 'avatar') {
      return {
        transformation: [
          {width: 400, height: 400, gravity: "face", radius: "max", crop: "crop"},
          {width: 200, crop: "scale"}
        ],
        folder: `storanized/${file.fieldname}/`,
        allowedFormats: ['jpeg','jpg', 'png'],
      }
    } else {
      return {
        folder: `storanized/attachments/`,
        allowedFormats: ['jpeg','jpg', 'png'],
      }
    }
  }
});
module.exports = multer({ storage })