const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// All partner KYC/profile images go into their own Cloudinary folder
const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'seva-mart/partners',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    resource_type: 'image',
  }),
});

const uploadLimits = { fileSize: 5 * 1024 * 1024 }; // 5MB per file

const upload = multer({ storage, limits: uploadLimits });

// Field names allowed anywhere a "single image" route is used
const ALLOWED_IMAGE_FIELDS = [
  'profile_pic',
  'pan_pic',
  'aadhar_front_pic',
  'aadhar_back_pic',
  'driving_license_pic',
];

// Used on CREATE — accepts all 5 possible images in one multipart request
const partnerImageFields = upload.fields([
  { name: 'profile_pic',         maxCount: 1 },
  { name: 'pan_pic',             maxCount: 1 },
  { name: 'aadhar_front_pic',    maxCount: 1 },
  { name: 'aadhar_back_pic',     maxCount: 1 },
  { name: 'driving_license_pic', maxCount: 1 },
]);

// Used on the "replace one image" route — field name is validated in the controller
const singlePartnerImage = upload.any();

module.exports = { upload, partnerImageFields, singlePartnerImage, ALLOWED_IMAGE_FIELDS };