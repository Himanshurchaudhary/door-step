// controllers/addon.controller.js
const AddonModel = require("../models/addon.model");

// ── Public ────────────────────────────────────────────────────────────────────

/** GET /api/addons/active  — website use karta hai */
exports.getActive = async (req, res) => {
  try {
    const addons = await AddonModel.findActive();
    res.json({ success: true, data: addons });
  } catch (err) {
    console.error("getActive addons:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Admin ─────────────────────────────────────────────────────────────────────

/** GET /api/addons  — all (admin) */
exports.getAll = async (req, res) => {
  try {
    const addons = await AddonModel.findAll();
    res.json({ success: true, data: addons });
  } catch (err) {
    console.error("getAll addons:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/** GET /api/addons/:id */
exports.getOne = async (req, res) => {
  try {
    const addon = await AddonModel.findById(req.params.id);
    if (!addon) return res.status(404).json({ success: false, message: "Addon not found" });
    res.json({ success: true, data: addon });
  } catch (err) {
    console.error("getOne addon:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/** POST /api/addons */
exports.create = async (req, res) => {
  try {
    const { name, description, price,  isActive } = req.body;

    if (!name || name.trim() === "")
      return res.status(400).json({ success: false, message: "Name is required" });
    if (price === undefined || isNaN(Number(price)))
      return res.status(400).json({ success: false, message: "Valid price is required" });

    const addon = await AddonModel.create({
      name:        name.trim(),
      description: description?.trim() || "",
      price:       Number(price),
      isActive:    isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({ success: true, data: addon, message: "Addon created" });
  } catch (err) {
    console.error("create addon:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/** PUT /api/addons/:id */
exports.update = async (req, res) => {
  try {
    const { name, description, price,  isActive } = req.body;
    const existing = await AddonModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Addon not found" });

    const updated = await AddonModel.update(req.params.id, {
      ...(name        !== undefined && { name: name.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(price       !== undefined && { price: Number(price) }),
      ...(isActive    !== undefined && { isActive: Boolean(isActive) }),
    });

    res.json({ success: true, data: updated, message: "Addon updated" });
  } catch (err) {
    console.error("update addon:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/** PATCH /api/addons/:id/toggle  — active/inactive flip */
exports.toggle = async (req, res) => {
  try {
    const existing = await AddonModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Addon not found" });

    const updated = await AddonModel.toggleActive(req.params.id);
    res.json({ success: true, data: updated, message: `Addon ${updated.isActive ? "activated" : "deactivated"}` });
  } catch (err) {
    console.error("toggle addon:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/** DELETE /api/addons/:id */
exports.remove = async (req, res) => {
  try {
    const existing = await AddonModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Addon not found" });

    await AddonModel.remove(req.params.id);
    res.json({ success: true, message: "Addon deleted" });
  } catch (err) {
    console.error("remove addon:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};