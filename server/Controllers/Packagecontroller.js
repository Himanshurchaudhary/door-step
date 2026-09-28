const Package    = require('../models/Package');
const cloudinary = require('../config/cloudinary');

// ── GET /api/packages — all packages (admin) ──────────────────────────────────
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.getAll();
    res.json({ success: true, data: packages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/packages/active — active packages (public frontend) ──────────────
exports.getActivePackages = async (req, res) => {
  try {
    const packages = await Package.getActive();
    res.json({ success: true, data: packages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/packages/:id ─────────────────────────────────────────────────────
exports.getPackageById = async (req, res) => {
  try {
    const pkg = await Package.getById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, data: pkg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/packages — create package (with optional image uploads) ─────────
// Accepts multipart/form-data so images can be uploaded during creation.
// images[] field: one or more image files.
// Text fields: name, price, description, features (newline-separated), is_active, sort_order.
exports.createPackage = async (req, res) => {
  try {
    const { name, price, description, features, is_active, sort_order } = req.body;

    // Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Package name is required' });
    }
    if (price === undefined || price === null || isNaN(price)) {
      return res.status(400).json({ success: false, message: 'Valid price is required' });
    }

    // Parse features: accept JSON array string OR newline-separated plain text
    let parsedFeatures = [];
    if (features) {
      try {
        const attempt = JSON.parse(features);
        parsedFeatures = Array.isArray(attempt) ? attempt : [];
      } catch {
        // Plain text with newlines
        parsedFeatures = features.split('\n').map(s => s.trim()).filter(Boolean);
      }
    }

    // Collect Cloudinary public_ids from uploaded files
    // multer-storage-cloudinary puts public_id in req.files[i].filename
    const imagePublicIds = Array.isArray(req.files)
      ? req.files.map(f => f.filename)
      : [];

    const id = await Package.create({
      name:        name.trim(),
      price:       parseFloat(price),
      description: description || null,
      features:    parsedFeatures,
      images:      imagePublicIds,
      is_active:   is_active !== undefined ? Number(is_active) : 1,
      sort_order:  sort_order ? parseInt(sort_order) : 0,
    });

    const pkg = await Package.getById(id);
    res.status(201).json({ success: true, message: 'Package created', data: pkg });

  } catch (err) {
    console.error('Create Package Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/packages/:id — update package ────────────────────────────────────
// Accepts JSON body (no file upload here — use the /images route for that).
exports.updatePackage = async (req, res) => {
  try {
    const existing = await Package.getById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Package not found' });

    const updateData = { ...req.body };

    // Validations (only for fields that were actually sent)
    if (updateData.price !== undefined && isNaN(updateData.price)) {
      return res.status(400).json({ success: false, message: 'Valid price is required' });
    }
    if (updateData.price     !== undefined) updateData.price     = parseFloat(updateData.price);
    if (updateData.sort_order !== undefined) updateData.sort_order = parseInt(updateData.sort_order) || 0;
    if (updateData.name      !== undefined) updateData.name      = updateData.name.trim();
    if (updateData.is_active !== undefined) updateData.is_active = Number(updateData.is_active);

    // features: accept JSON array string OR newline-separated plain text
    if (updateData.features !== undefined) {
      if (typeof updateData.features === 'string') {
        try {
          const attempt = JSON.parse(updateData.features);
          updateData.features = Array.isArray(attempt) ? attempt : [];
        } catch {
          updateData.features = updateData.features.split('\n').map(s => s.trim()).filter(Boolean);
        }
      } else if (!Array.isArray(updateData.features)) {
        return res.status(400).json({ success: false, message: 'Features must be an array or newline-separated string' });
      }
    }

    // images: if sent in body, must be an array of public_ids
    if (updateData.images !== undefined && !Array.isArray(updateData.images)) {
      return res.status(400).json({ success: false, message: 'Images must be an array of public_ids' });
    }

    await Package.update(req.params.id, updateData);
    const updated = await Package.getById(req.params.id);
    res.json({ success: true, message: 'Package updated', data: updated });

  } catch (err) {
    console.error('Update Package Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/packages/:id — delete package + all its Cloudinary images ─────
exports.deletePackage = async (req, res) => {
  try {
    const existing = await Package.getById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Package not found' });

    // Delete all images from Cloudinary before removing DB record
    const images = Array.isArray(existing.images) ? existing.images : [];
    if (images.length > 0) {
      await Promise.allSettled(images.map(pid => cloudinary.uploader.destroy(pid)));
    }

    await Package.delete(req.params.id);
    res.json({ success: true, message: 'Package deleted' });

  } catch (err) {
    console.error('Delete Package Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PATCH /api/packages/:id/toggle — toggle active / inactive ─────────────────
exports.togglePackage = async (req, res) => {
  try {
    const existing = await Package.getById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Package not found' });

    const newStatus = await Package.toggleStatus(req.params.id);
    res.json({
      success:   true,
      message:   newStatus ? 'Package activated' : 'Package deactivated',
      is_active: newStatus,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/packages/:id/images — add one image to existing package ─────────
// multer-storage-cloudinary puts:
//   req.file.filename  → Cloudinary public_id  (e.g. "seva-mart/packages/abc123")
//   req.file.path      → Cloudinary secure_url (e.g. "https://res.cloudinary.com/...")
exports.uploadPackageImage = async (req, res) => {
  try {
    const pkg = await Package.getById(req.params.id);
    if (!pkg)      return res.status(404).json({ success: false, message: 'Package not found' });
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const currentImages = Array.isArray(pkg.images) ? pkg.images : [];
    const newImages     = [...currentImages, req.file.filename]; // store public_id

    await Package.update(req.params.id, { images: newImages });

    res.json({
      success:    true,
      message:    'Image uploaded',
      public_id:  req.file.filename,
      url:        req.file.path,            // Cloudinary secure URL
      images:     newImages,                // array of public_ids
    });

  } catch (err) {
    console.error('Upload Image Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/packages/:id/images/:publicId — remove one image ──────────────
// :publicId is URL-encoded because it contains slashes (e.g. seva-mart/packages/abc123)
exports.deletePackageImage = async (req, res) => {
  try {
    const pkg = await Package.getById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });

    // public_id arrives URL-encoded; decode it back
    const publicId = decodeURIComponent(req.params.publicId);

    // Remove from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Remove from DB
    const currentImages = Array.isArray(pkg.images) ? pkg.images : [];
    const newImages     = currentImages.filter(pid => pid !== publicId);
    await Package.update(req.params.id, { images: newImages });

    res.json({ success: true, message: 'Image deleted', images: newImages });

  } catch (err) {
    console.error('Delete Image Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};