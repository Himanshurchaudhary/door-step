const Banner = require('../models/Banner');
const fs     = require('fs');
const path   = require('path');

// ── Helper: Base64 image save karo disk pe ───────────────────────────────────
const saveBase64Image = (base64String, folder = 'banners') => {
  try {
    // "data:image/png;base64,xxxx" → split karo
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches) throw new Error('Invalid base64 string');

    const ext      = matches[1].split('/')[1];           // png/jpg/webp
    const data     = matches[2];
    const fileName = `${folder}_${Date.now()}.${ext}`;
    const uploadDir = path.join(__dirname, '../uploads', folder);

    // Folder exist nahi hai to banao
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(path.join(uploadDir, fileName), data, 'base64');
    return `/uploads/${folder}/${fileName}`;             // public URL
  } catch (err) {
    throw new Error('Image save failed: ' + err.message);
  }
};

// ── Delete old image from disk ───────────────────────────────────────────────
const deleteOldImage = (imagePath) => {
  try {
    if (!imagePath) return;
    const fullPath = path.join(__dirname, '..', imagePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  } catch (_) {}
};

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
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    res.json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/banners — create ───────────────────────────────────────────────
exports.createBanner = async (req, res) => {
  try {
    const { title, subtitle, image, link, position, is_active, sort_order } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    // Base64 hai to save karo, warna direct URL use karo
    let imagePath = image;
    if (image.startsWith('data:')) {
      imagePath = saveBase64Image(image, 'banners');
    }

    const id = await Banner.create({
      title, subtitle, link, position, is_active, sort_order,
      image: imagePath,
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
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    const updateData = { ...req.body };

    // Nai image aayi hai to purani delete karo
    if (updateData.image && updateData.image.startsWith('data:')) {
      deleteOldImage(existing.image);
      updateData.image = saveBase64Image(updateData.image, 'banners');
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
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    deleteOldImage(existing.image);
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
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    const newStatus = await Banner.toggleStatus(req.params.id);
    res.json({
      success: true,
      message: newStatus ? 'Banner activated' : 'Banner deactivated',
      is_active: newStatus,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};