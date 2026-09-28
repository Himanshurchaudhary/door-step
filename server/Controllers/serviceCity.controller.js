const ServiceCityModel = require("../models/serviceCity.model");

// ── Public ────────────────────────────────────────────────────────────────────

/** GET /api/service-cities/active — website use */
exports.getActive = async (req, res) => {
  try {
    const cities = await ServiceCityModel.findActive();
    res.json({ success: true, data: cities });
  } catch (err) {
    console.error("getActive service cities:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Admin ─────────────────────────────────────────────────────────────────────

/** GET /api/service-cities — all (admin) */
exports.getAll = async (req, res) => {
  try {
    const cities = await ServiceCityModel.findAll();
    res.json({ success: true, data: cities });
  } catch (err) {
    console.error("getAll service cities:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/** GET /api/service-cities/:id */
exports.getOne = async (req, res) => {
  try {
    const city = await ServiceCityModel.findById(req.params.id);
    if (!city)
      return res.status(404).json({ success: false, message: "City not found" });
    res.json({ success: true, data: city });
  } catch (err) {
    console.error("getOne service city:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/** POST /api/service-cities */
exports.create = async (req, res) => {
  try {
    const { name, state, isActive } = req.body;

    if (!name || name.trim() === "")
      return res.status(400).json({ success: false, message: "City name is required" });
    if (!state || state.trim() === "")
      return res.status(400).json({ success: false, message: "State is required" });

    const city = await ServiceCityModel.create({
      name:     name.trim(),
      state:    state.trim(),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({ success: true, data: city, message: "City created" });
  } catch (err) {
    console.error("create service city:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/** PUT /api/service-cities/:id */
exports.update = async (req, res) => {
  try {
    const { name, state, isActive } = req.body;

    const existing = await ServiceCityModel.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ success: false, message: "City not found" });

    const updated = await ServiceCityModel.update(req.params.id, {
      ...(name     !== undefined && { name: name.trim() }),
      ...(state    !== undefined && { state: state.trim() }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
    });

    res.json({ success: true, data: updated, message: "City updated" });
  } catch (err) {
    console.error("update service city:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/** PATCH /api/service-cities/:id/toggle — active/inactive flip */
exports.toggle = async (req, res) => {
  try {
    const existing = await ServiceCityModel.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ success: false, message: "City not found" });

    const updated = await ServiceCityModel.toggleActive(req.params.id);
    res.json({
      success: true,
      data: updated,
      message: `City ${updated.isActive ? "activated" : "deactivated"}`,
    });
  } catch (err) {
    console.error("toggle service city:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/** DELETE /api/service-cities/:id */
exports.remove = async (req, res) => {
  try {
    const existing = await ServiceCityModel.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ success: false, message: "City not found" });

    await ServiceCityModel.remove(req.params.id);
    res.json({ success: true, message: "City deleted" });
  } catch (err) {
    console.error("remove service city:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};