const Partner     = require('../models/Partner');
const cloudinary  = require('../config/cloudinary');
const { ALLOWED_IMAGE_FIELDS } = require('../middleware/Uploadpartner');

const EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[6-9]\d{9}$/; // 10-digit Indian mobile

// ── GET /api/partners — all partners (admin) ──────────────────────────────────
exports.getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.getAll();
    res.json({ success: true, data: partners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/partners/:id ──────────────────────────────────────────────────────
exports.getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.getById(req.params.id);
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
    res.json({ success: true, data: partner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/partners — create partner (multipart, all docs in one request) ──
// Text fields: name, dob, mobile, email, password, driving_license_no,
//              experience_years, is_active
// File fields: profile_pic, pan_pic, aadhar_front_pic, aadhar_back_pic,
//              driving_license_pic (optional)
exports.createPartner = async (req, res) => {
  try {
    const {
      name, dob, mobile, email, password,
      driving_license_no, experience_years, is_active,
    } = req.body;

    // ── Validation ──────────────────────────────────────────────────────────
    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Name (as per Aadhar) is required' });
    }
    if (!dob) {
      return res.status(400).json({ success: false, message: 'Date of birth is required' });
    }
    if (!mobile || !MOBILE_RE.test(mobile)) {
      return res.status(400).json({ success: false, message: 'Valid 10-digit mobile number is required' });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const dup = await Partner.findByEmailOrMobile(email.trim(), mobile.trim());
    if (dup) {
      return res.status(409).json({ success: false, message: 'A partner with this email or mobile already exists' });
    }

    // req.files comes from upload.fields() → { fieldName: [file] }
    const files = req.files || {};
    const getPublicId = (field) => files[field]?.[0]?.filename || null;

    const id = await Partner.create({
      name:                name.trim(),
      dob,
      mobile:              mobile.trim(),
      email:               email.trim().toLowerCase(),
      password,
      driving_license_no:  driving_license_no || null,
      experience_years:    experience_years !== undefined && experience_years !== '' ? parseInt(experience_years) : null,
      profile_pic:         getPublicId('profile_pic'),
      pan_pic:             getPublicId('pan_pic'),
      aadhar_front_pic:    getPublicId('aadhar_front_pic'),
      aadhar_back_pic:     getPublicId('aadhar_back_pic'),
      driving_license_pic: getPublicId('driving_license_pic'),
      is_active:           is_active !== undefined ? Number(is_active) : 1,
    });

    const partner = await Partner.getById(id);
    res.status(201).json({ success: true, message: 'Partner added', data: partner });

  } catch (err) {
    console.error('Create Partner Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/partners/:id — update partner (JSON body, no files here) ─────────
exports.updatePartner = async (req, res) => {
  try {
    const existing = await Partner.getById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Partner not found' });

    const updateData = { ...req.body };

    if (updateData.email !== undefined) {
      if (!EMAIL_RE.test(updateData.email)) {
        return res.status(400).json({ success: false, message: 'Valid email is required' });
      }
      updateData.email = updateData.email.trim().toLowerCase();
    }
    if (updateData.mobile !== undefined) {
      if (!MOBILE_RE.test(updateData.mobile)) {
        return res.status(400).json({ success: false, message: 'Valid 10-digit mobile number is required' });
      }
      updateData.mobile = updateData.mobile.trim();
    }
    if (updateData.name !== undefined) updateData.name = updateData.name.trim();
    if (updateData.is_active !== undefined) updateData.is_active = Number(updateData.is_active);
    if (updateData.experience_years !== undefined) {
      updateData.experience_years = updateData.experience_years === '' ? null : parseInt(updateData.experience_years);
    }
    if (updateData.password !== undefined && updateData.password.length > 0 && updateData.password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    if (updateData.password === '') delete updateData.password; // don't overwrite with blank

    // Uniqueness check if email/mobile changed
    if (updateData.email || updateData.mobile) {
      const dup = await Partner.findByEmailOrMobile(
        updateData.email || existing.email,
        updateData.mobile || existing.mobile
      );
      if (dup && dup.id !== existing.id) {
        return res.status(409).json({ success: false, message: 'Another partner already uses this email or mobile' });
      }
    }

    await Partner.update(req.params.id, updateData);
    const updated = await Partner.getById(req.params.id);
    res.json({ success: true, message: 'Partner updated', data: updated });

  } catch (err) {
    console.error('Update Partner Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/partners/:id — delete partner + all their Cloudinary images ───
exports.deletePartner = async (req, res) => {
  try {
    const existing = await Partner.getById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Partner not found' });

    const publicIds = ALLOWED_IMAGE_FIELDS.map(f => existing[f]).filter(Boolean);
    if (publicIds.length > 0) {
      await Promise.allSettled(publicIds.map(pid => cloudinary.uploader.destroy(pid)));
    }

    await Partner.delete(req.params.id);
    res.json({ success: true, message: 'Partner deleted' });

  } catch (err) {
    console.error('Delete Partner Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PATCH /api/partners/:id/toggle — activate / deactivate ────────────────────
exports.togglePartner = async (req, res) => {
  try {
    const existing = await Partner.getById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Partner not found' });

    const newStatus = await Partner.toggleStatus(req.params.id);
    res.json({
      success:   true,
      message:   newStatus ? 'Partner activated' : 'Partner deactivated',
      is_active: newStatus,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/partners/:id/image/:field — replace one image ───────────────────
// :field must be one of ALLOWED_IMAGE_FIELDS. Uses upload.any() so we can
// validate the field name ourselves and give a clean error otherwise.
exports.uploadPartnerImage = async (req, res) => {
  try {
    const { field } = req.params;
    if (!ALLOWED_IMAGE_FIELDS.includes(field)) {
      return res.status(400).json({ success: false, message: 'Invalid image field' });
    }

    const partner = await Partner.getById(req.params.id);
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });

    const file = (req.files || []).find(f => f.fieldname === field);
    if (!file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    // Remove old image from Cloudinary if one exists
    if (partner[field]) {
      await cloudinary.uploader.destroy(partner[field]).catch(() => {});
    }

    await Partner.update(req.params.id, { [field]: file.filename });

    res.json({
      success:   true,
      message:   'Image uploaded',
      field,
      public_id: file.filename,
      url:       file.path,
    });

  } catch (err) {
    console.error('Upload Partner Image Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/partners/:id/image/:field — remove one image ──────────────────
exports.deletePartnerImage = async (req, res) => {
  try {
    const { field } = req.params;
    if (!ALLOWED_IMAGE_FIELDS.includes(field)) {
      return res.status(400).json({ success: false, message: 'Invalid image field' });
    }

    const partner = await Partner.getById(req.params.id);
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });

    if (partner[field]) {
      await cloudinary.uploader.destroy(partner[field]).catch(() => {});
    }

    await Partner.update(req.params.id, { [field]: null });
    res.json({ success: true, message: 'Image removed' });

  } catch (err) {
    console.error('Delete Partner Image Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};