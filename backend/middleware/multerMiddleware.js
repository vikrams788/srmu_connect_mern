const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    resource_type: "auto",
    folder: 'uploads',
    allowedFormats: ['jpg', 'png', 'gif'],
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };