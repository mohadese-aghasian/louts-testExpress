const multer=require("multer");
const path = require('path');

const productCoverUpload = multer({
    storage: multer.memoryStorage(), // Store the file in memory for processing
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|gif/;
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = fileTypes.test(file.mimetype);

  
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only images (jpeg, jpg, png, gif) are allowed!'));
      }
    }
  }).single('cover'); // The name of the field in the form

const uploadMiddleware = (req, res, next) => {
    productCoverUpload(req, res, (err) => {
      if (err) {
        // Handle file size limit error
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File size exceeds the 2MB limit.' });
        }

        return res.status(400).json({ message: err.message });
      }
  
      next();
    });
  };
  
  module.exports = uploadMiddleware;