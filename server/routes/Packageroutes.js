const express = require('express');
const router  = express.Router();

const {
  getAllPackages,
  getActivePackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  togglePackage,
  uploadPackageImage,
  deletePackageImage,
} = require('../Controllers/Packagecontroller');

const { protect, isAdmin } = require('../middleware/authMiddleware');
const { upload  }             = require('../middleware/upload');

// ── Public ────────────────────────────────────────────────────────────────────
router.get('/active', getActivePackages);
router.get('/user/:id',  getPackageById);


// ── Admin: list + single ──────────────────────────────────────────────────────
router.get('/',    protect, isAdmin, getAllPackages);
router.get('/:id', protect, isAdmin, getPackageById);

// ── Admin: create (multipart — up to 5 images at once) ───────────────────────
// Frontend must send multipart/form-data with field name "images" for files.
router.post('/', protect, isAdmin, upload.array('images', 5), createPackage);

// ── Admin: update (JSON body — no files) ─────────────────────────────────────
router.put('/:id', protect, isAdmin, updatePackage);

// ── Admin: delete + toggle ────────────────────────────────────────────────────
router.delete('/:id',         protect, isAdmin, deletePackage);
router.patch('/:id/toggle',   protect, isAdmin, togglePackage);

// ── Admin: image management (add / remove one image at a time) ────────────────
// :publicId must be URL-encoded when it contains slashes.
router.post(  '/:id/images',           protect, isAdmin, upload.single('image'), uploadPackageImage);
router.delete('/:id/images/:publicId', protect, isAdmin, deletePackageImage);

module.exports = router;