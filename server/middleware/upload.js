const multer          = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary      = require('../config/cloudinary'); // your existing cloudinary config

// Store directly to Cloudinary — no local disk
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'seva-mart/packages',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 900, crop: 'limit', quality: 'auto' }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPG, PNG, and WebP images are allowed'));
  },
});

module.exports = upload;