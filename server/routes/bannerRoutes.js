const express = require('express');
const router  = express.Router();
const {
  getAllBanners,
  getBannersByPosition,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBanner,
} = require('../Controllers/bannerController');

const { protect, isAdmin } = require('../middleware/authMiddleware');
const { uploadBanner } = require('../middleware/upload'); // ← naya add kiya

// ── Public (frontend ke liye — no auth) ─────────────────────────────────────
router.get('/position/:position', getBannersByPosition);

// ── Protected Admin Routes ───────────────────────────────────────────────────
router.get('/',             protect, isAdmin, getAllBanners);
router.get('/:id',          protect, isAdmin, getBannerById);
router.post('/',            protect, isAdmin, uploadBanner.single('image'), createBanner);  // ← middleware add kiya
router.put('/:id',          protect, isAdmin, uploadBanner.single('image'), updateBanner);  // ← middleware add kiya
router.delete('/:id',       protect, isAdmin, deleteBanner);
router.patch('/:id/toggle', protect, isAdmin, toggleBanner);

module.exports = router;