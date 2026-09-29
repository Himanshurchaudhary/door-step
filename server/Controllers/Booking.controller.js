const BookingModel     = require("../models/Booking.model");
const ServiceCityModel = require("../models/serviceCity.model");
const CarTypeModel     = require("../models/carType.model");
const AddonModel       = require("../models/addon.model");
const PackageModel     = require("../models/Package");
const { sendBookingAlert } = require("../utils/telegram");   // ← ye nayi line

const VALID_STATUSES = ["pending", "confirmed", "in_progress", "completed", "cancelled"];

// ── Public ────────────────────────────────────────────────────────────────────

exports.create = async (req, res) => {
  try {
    const {
      customerName,
      customerNumber,
      email,
      cityId,
      addressType,
      fullAddress,
      latitude,
      longitude,
      packageId,
      carTypeId,
      bookingDate,
      bookingTime,
      addonIds,
      notes,
    } = req.body;

    if (!customerName || customerName.trim() === "")
      return res.status(400).json({ success: false, message: "Customer name is required" });

    if (!customerNumber || !/^[0-9+\-\s]{7,15}$/.test(customerNumber.trim()))
      return res.status(400).json({ success: false, message: "Valid customer number is required" });

    if (!cityId)
      return res.status(400).json({ success: false, message: "City/District is required" });

    if (!["full_address", "current_location"].includes(addressType))
      return res.status(400).json({ success: false, message: "Invalid address type" });

    if (addressType === "full_address" && (!fullAddress || fullAddress.trim() === ""))
      return res.status(400).json({ success: false, message: "Full address is required" });

    if (addressType === "current_location" && (latitude === undefined || longitude === undefined))
      return res.status(400).json({ success: false, message: "Current location coordinates are required" });

    if (!carTypeId)
      return res.status(400).json({ success: false, message: "Car type is required" });

    if (!bookingDate || !bookingTime)
      return res.status(400).json({ success: false, message: "Booking date & time are required" });

    const city = await ServiceCityModel.findById(cityId);
    if (!city || !city.isActive)
      return res.status(400).json({ success: false, message: "Selected city is not available" });

    const carType = await CarTypeModel.findById(carTypeId);
    if (!carType || !carType.isActive)
      return res.status(400).json({ success: false, message: "Selected car type is not available" });

    let selectedPackage = null;
    if (packageId) {
      const pkg = await PackageModel.getById(packageId);
      if (!pkg || !pkg.is_active)
        return res.status(400).json({ success: false, message: "Selected package is not available" });
      selectedPackage = pkg;
    }

    let selectedAddons = [];
    let addonsTotal = 0;
    if (Array.isArray(addonIds) && addonIds.length) {
      for (const id of addonIds) {
        const addon = await AddonModel.findById(id);
        if (addon && addon.isActive) {
          selectedAddons.push({ id: addon.id, name: addon.name, price: addon.price });
          addonsTotal += addon.price;
        }
      }
    }

    // ── Car type ka price nahi jodna — sirf package + addons ──
    const packagePrice = selectedPackage ? Number(selectedPackage.price) : 0;
    const totalPrice   = (packagePrice || 0) + (addonsTotal || 0);

    const booking = await BookingModel.create({
      customerName:   customerName.trim(),
      customerNumber: customerNumber.trim(),
      email:          email ? email.trim() : null,
      cityId:         city.id,
      cityName:       city.name,
      addressType,
      fullAddress:    addressType === "full_address" ? fullAddress.trim() : null,
      latitude:       addressType === "current_location" ? Number(latitude) : null,
      longitude:      addressType === "current_location" ? Number(longitude) : null,
      packageId:      selectedPackage ? selectedPackage.id   : null,
      packageName:    selectedPackage ? selectedPackage.name : null,
      packagePrice:   selectedPackage ? packagePrice         : null,
      carTypeId:      carType.id,
      carTypeName:    carType.name,
      bookingDate,
      bookingTime,
      addons:         selectedAddons,
      totalPrice,
      status:         "pending",
      notes:          notes ? notes.trim() : null,
    });

     sendBookingAlert({
      customerName:   customerName.trim(),
      customerNumber: customerNumber.trim(),
      email:          email ? email.trim() : null,
      cityName:       city.name,
      addressType,
      fullAddress:    addressType === "full_address" ? fullAddress.trim() : null,
      latitude:       addressType === "current_location" ? Number(latitude) : null,
      longitude:      addressType === "current_location" ? Number(longitude) : null,
      packageName:    selectedPackage ? selectedPackage.name : null,
      carTypeName:    carType.name,
      addons:         selectedAddons,
      bookingDate,
      bookingTime,
      notes:          notes ? notes.trim() : null,
      totalPrice,
    }).catch((e) => console.error("Telegram alert error:", e));

    res.status(201).json({ success: true, data: booking, message: "Booking created successfully" });
  } catch (err) {
    console.error("create booking:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Admin ─────────────────────────────────────────────────────────────────────

exports.getAll = async (req, res) => {
  try {
    const { status, from, to, search } = req.query;
    const bookings = await BookingModel.findAll({ status, from, to, search });
    res.json({ success: true, data: bookings });
  } catch (err) {
    console.error("getAll bookings:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.stats = async (req, res) => {
  try {
    const stats = await BookingModel.stats();
    res.json({ success: true, data: stats });
  } catch (err) {
    console.error("booking stats:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const booking = await BookingModel.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, data: booking });
  } catch (err) {
    console.error("getOne booking:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const existing = await BookingModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Booking not found" });

    const updated = await BookingModel.updateStatus(req.params.id, status);
    res.json({ success: true, data: updated, message: `Booking marked as ${status}` });
  } catch (err) {
    console.error("updateStatus booking:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await BookingModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Booking not found" });

    const updated = await BookingModel.update(req.params.id, req.body);
    res.json({ success: true, data: updated, message: "Booking updated" });
  } catch (err) {
    console.error("update booking:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.remove = async (req, res) => {
  try {
    const existing = await BookingModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Booking not found" });

    await BookingModel.remove(req.params.id);
    res.json({ success: true, message: "Booking deleted" });
  } catch (err) {
    console.error("remove booking:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.assign = async (req, res) => {
  try {
    const { partnerId } = req.body; // null = unassign

    const existing = await BookingModel.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ success: false, message: "Booking not found" });

    const updated = await BookingModel.assign(req.params.id, partnerId || null);
    res.json({
      success: true,
      data:    updated,
      message: partnerId ? "Partner assigned" : "Partner unassigned",
    });
  } catch (err) {
    console.error("assign booking:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};