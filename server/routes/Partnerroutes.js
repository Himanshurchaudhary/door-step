const express = require('express');
const router  = express.Router();

const {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
  togglePartner,
  uploadPartnerImage,
  deletePartnerImage,
} = require('../Controllers/Partnercontroller');

const { protect, isAdmin }              = require('../middleware/authMiddleware');
const { partnerImageFields, singlePartnerImage } = require('../middleware/Uploadpartner');
// ── Admin: list + single ──────────────────────────────────────────────────────
router.get('/',    protect, isAdmin, getAllPartners);
router.get('/:id', protect, isAdmin, getPartnerById);

// ── Admin: create (multipart — profile pic, PAN, Aadhar front/back, DL pic) ───
router.post('/', protect, isAdmin, partnerImageFields, createPartner);

// ── Admin: update (JSON body — text fields only) ───────────────────────────────
router.put('/:id', protect, isAdmin, updatePartner);

// ── Admin: delete + toggle ──────────────────────────────────────────────────────
router.delete('/:id',       protect, isAdmin, deletePartner);
router.patch('/:id/toggle', protect, isAdmin, togglePartner);

// ── Admin: replace / remove a single document image ────────────────────────────
// :field ∈ profile_pic | pan_pic | aadhar_front_pic | aadhar_back_pic | driving_license_pic
router.post(  '/:id/image/:field', protect, isAdmin, singlePartnerImage, uploadPartnerImage);
router.delete('/:id/image/:field', protect, isAdmin, deletePartnerImage);

module.exports = router;