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

// ── Public (frontend ke liye — no auth) ─────────────────────────────────────
router.get('/position/:position', getBannersByPosition);

// ── Protected Admin Routes ───────────────────────────────────────────────────
router.get('/',               protect, isAdmin, getAllBanners);
router.get('/:id',            protect, isAdmin, getBannerById);
router.post('/',              protect, isAdmin, createBanner);
router.put('/:id',            protect, isAdmin, updateBanner);
router.delete('/:id',         protect, isAdmin, deleteBanner);
router.patch('/:id/toggle',   protect, isAdmin, toggleBanner);

module.exports = router;