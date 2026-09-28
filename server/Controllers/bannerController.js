const Banner     = require('../models/Banner');
const cloudinary = require('../config/cloudinary');

// ── GET /api/banners — all banners (admin) ───────────────────────────────────
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.getAll();
    res.json({ success: true, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/banners/position/:position — frontend ke liye ──────────────────
exports.getBannersByPosition = async (req, res) => {
  try {
    const banners = await Banner.getByPosition(req.params.position);
    res.json({ success: true, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/banners/:id ─────────────────────────────────────────────────────
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.getById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/banners — create ───────────────────────────────────────────────
exports.createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const { title, subtitle, link, position, is_active, sort_order } = req.body;

    const id = await Banner.create({
      title, subtitle, link, position, is_active, sort_order,
      image: req.file.filename,
    });

    const banner = await Banner.getById(id);
    res.status(201).json({ success: true, message: 'Banner created', data: banner });

  } catch (err) {
    console.error('Create Banner Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/banners/:id — update ────────────────────────────────────────────
exports.updateBanner = async (req, res) => {
  try {
    const existing = await Banner.getById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Banner not found' });

    const updateData = { ...req.body };

    if (req.file) {
      if (existing.image) {
        await cloudinary.uploader.destroy(existing.image).catch(() => {});
      }
      updateData.image = req.file.filename;
    }

    await Banner.update(req.params.id, updateData);
    const updated = await Banner.getById(req.params.id);
    res.json({ success: true, message: 'Banner updated', data: updated });

  } catch (err) {
    console.error('Update Banner Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/banners/:id ──────────────────────────────────────────────────
exports.deleteBanner = async (req, res) => {
  try {
    const existing = await Banner.getById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Banner not found' });

    if (existing.image) {
      await cloudinary.uploader.destroy(existing.image).catch(() => {});
    }

    await Banner.delete(req.params.id);
    res.json({ success: true, message: 'Banner deleted' });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PATCH /api/banners/:id/toggle — active/inactive ─────────────────────────
exports.toggleBanner = async (req, res) => {
  try {
    const existing = await Banner.getById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Banner not found' });

    const newStatus = await Banner.toggleStatus(req.params.id);
    res.json({
      success:   true,
      message:   newStatus ? 'Banner activated' : 'Banner deactivated',
      is_active: newStatus,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};