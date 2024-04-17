const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'assets');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueFileName = Date.now() + '-' + file.originalname;
    cb(null, uniqueFileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.includes('spreadsheetml') ||
    file.mimetype.includes('excel')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel files are allowed'), false);
  }
};

const excelUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = excelUpload;