const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { success, error } = require('../utils/apiResponse');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads/mous', req.user._id.toString());
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// POST /api/uploads/file
const uploadFile = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      const message = err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE'
        ? 'File size must be less than 10MB'
        : err.message || 'Upload failed';
      return error(res, message, 400);
    }

    if (!req.file) {
      return error(res, 'No file provided', 400);
    }

    const relativePath = `mous/${req.user._id}/${req.file.filename}`;
    const url = `/api/uploads/files/${relativePath}`;

    return success(res, { url, path: relativePath }, 'File uploaded');
  });
};

// Activity file upload: accepts PDF, JPEG, PNG
const activityStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads/activities', req.user._id.toString());
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const activityFileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPEG, and PNG files are allowed'), false);
  }
};

const uploadActivity = multer({
  storage: activityStorage,
  fileFilter: activityFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// POST /api/uploads/activity-file
const uploadActivityFile = (req, res, next) => {
  uploadActivity.single('file')(req, res, (err) => {
    if (err) {
      const message = err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE'
        ? 'File size must be less than 10MB'
        : err.message || 'Upload failed';
      return error(res, message, 400);
    }

    if (!req.file) {
      return error(res, 'No file provided', 400);
    }

    const relativePath = `activities/${req.user._id}/${req.file.filename}`;
    const url = `/api/uploads/files/${relativePath}`;

    return success(res, { url, path: relativePath }, 'File uploaded');
  });
};

module.exports = { uploadFile, uploadActivityFile };
