import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Folder name in your Cloudinary account
    format: async (req, file) => 'png', // Optional: Set the format (e.g., png, jpg)
    public_id: (req, file) => Date.now(), // Optional: Set a unique identifier for the file
  },
});

// Initialize multer with Cloudinary storage
const upload = multer({ storage });

export default upload;
