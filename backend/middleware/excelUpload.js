const multer = require('multer');
const path = require('path');

// Define storage settings for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Construct the absolute path to the 'assets' directory within your backend
    const uploadDir = path.join(__dirname, 'assets');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Customize the filename (e.g., timestamp + original filename)
    const uniqueFileName = Date.now() + '-' + file.originalname;
    cb(null, uniqueFileName);
  },
});

// File filter function to accept only Excel files
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.includes('spreadsheetml') ||
    file.mimetype.includes('excel')
  ) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only Excel files are allowed'), false); // Reject the file
  }
};

// Initialize multer upload middleware
const excelUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = excelUpload;

// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadDir = path.join(__dirname, '..', 'assets');
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// module.exports = { upload };