const CarTypeModel = require("../models/carType.model");

// ── Public ────────────────────────────────────────────────────────────────────

/** GET /api/car-types/active */
exports.getActive = async (req, res) => {
  try {
    const types = await CarTypeModel.findActive();
    res.json({ success: true, data: types });
  } catch (err) {
    console.error("getActive car types:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Admin ─────────────────────────────────────────────────────────────────────

/** GET /api/car-types */
exports.getAll = async (req, res) => {
  try {
    const types = await CarTypeModel.findAll();
    res.json({ success: true, data: types });
  } catch (err) {
    console.error("getAll car types:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/** GET /api/car-types/:id */
exports.getOne = async (req, res) => {
  try {
    const type = await CarTypeModel.findById(req.params.id);
    if (!type)
      return res.status(404).json({ success: false, message: "Car type not found" });
    res.json({ success: true, data: type });
  } catch (err) {
    console.error("getOne car type:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/** POST /api/car-types */
exports.create = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    if (!name || name.trim() === "")
      return res.status(400).json({ success: false, message: "Car type name is required" });

    const type = await CarTypeModel.create({
      name:        name.trim(),
      description: description ? description.trim() : null,
      isActive:    isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({ success: true, data: type, message: "Car type created" });
  } catch (err) {
    console.error("create car type:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/** PUT /api/car-types/:id */
exports.update = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    const existing = await CarTypeModel.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ success: false, message: "Car type not found" });

    const updated = await CarTypeModel.update(req.params.id, {
      ...(name        !== undefined && { name: name.trim() }),
      ...(description !== undefined && { description: description ? description.trim() : null }),
      ...(isActive    !== undefined && { isActive: Boolean(isActive) }),
    });

    res.json({ success: true, data: updated, message: "Car type updated" });
  } catch (err) {
    console.error("update car type:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/** PATCH /api/car-types/:id/toggle */
exports.toggle = async (req, res) => {
  try {
    const existing = await CarTypeModel.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ success: false, message: "Car type not found" });

    const updated = await CarTypeModel.toggleActive(req.params.id);
    res.json({
      success: true,
      data: updated,
      message: `Car type ${updated.isActive ? "activated" : "deactivated"}`,
    });
  } catch (err) {
    console.error("toggle car type:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/** DELETE /api/car-types/:id */
exports.remove = async (req, res) => {
  try {
    const existing = await CarTypeModel.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ success: false, message: "Car type not found" });

    await CarTypeModel.remove(req.params.id);
    res.json({ success: true, message: "Car type deleted" });
  } catch (err) {
    console.error("remove car type:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};