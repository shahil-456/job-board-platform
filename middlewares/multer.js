import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the 'uploads' directory exists or create it
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Specify the folder to store files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Define file filter for file validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/; // Allowed file types
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    // You can throw an error, or you can pass a specific error message here
    cb(new Error('Only .jpeg, .jpg, and .png files are allowed!'), false);
  }
};

// Initialize multer with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // Max file size: 5MB
  },
});

// Export multer instance to use in routes
export { upload };
