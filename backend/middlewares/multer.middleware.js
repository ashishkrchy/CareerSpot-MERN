import multer from 'multer';
import path from 'path';
import fs from 'fs';

const tempDir = './public/temp';

// Create temp directory if it doesn't exist
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Define storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// Define file filter
const fileFilter = (req, file, cb) => {
  try {
    if (file.fieldname === 'resume') {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      cb(null, allowedTypes.includes(file.mimetype));
    } else if (
      file.fieldname === 'profilePicture' ||
      file.fieldname === 'logo'
    ) {
      cb(null, file.mimetype.startsWith('image/'));
    } else {
      cb(new Error('Invalid file field'), false);
    }
  } catch (err) {
    cb(err, false);
  }
};

// Configure multer upload
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 3,
  },
});

// Middleware for multer errors
export const handleMulterError = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      message:
        err instanceof multer.MulterError ? err.message : 'File upload error',
      success: false,
    });
  }
  next();
};
