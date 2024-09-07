const multer=require("multer");

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
  }).single('image'); // The name of the field in the form

module.exports=productCoverUpload;