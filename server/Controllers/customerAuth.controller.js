// controllers/customerAuth.controller.js
const { pool } = require("../config/db");
const jwt      = require("jsonwebtoken");

const JWT_SECRET  = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES = "7d";

// ── Helper: shape partner info for customer ───────────────────────────────────
const shapePartner = (row) => {
  if (!row.partner_id) return null;
  return {
    id:         row.partner_id,
    name:       row.partner_name   || "",
    mobile:     row.partner_mobile || "",
    profilePic: row.partner_profile_pic
                  ? `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${row.partner_profile_pic}`
                  : null,
  };
};

// ── Shape booking for customer response ──────────────────────────────────────
const shapeBooking = (row) => ({
  id:           row.id,
  bookingDate:  row.booking_date,
  bookingTime:  row.booking_time,
  cityName:     row.city_name,
  carTypeName:  row.car_type_name,
  packageName:  row.package_name  || null,
  packagePrice: row.package_price !== null ? parseFloat(row.package_price) : 0,
  addons:       row.addons
                  ? (typeof row.addons === "string" ? JSON.parse(row.addons) : row.addons)
                  : [],
  totalPrice:   parseFloat(row.total_price),
  status:       row.status,
  addressType:  row.address_type,
  fullAddress:  row.full_address  || "",
  latitude:     row.latitude  !== null ? parseFloat(row.latitude)  : null,
  longitude:    row.longitude !== null ? parseFloat(row.longitude) : null,
  notes:        row.notes         || "",
  createdAt:    row.created_at,
  partner:      shapePartner(row),
});

// ── POST /api/customer-auth/login ─────────────────────────────────────────────
// Body: { mobile }
// Agar is mobile se koi booking exist karti hai → login kar do
// Warna 404 — account nahi hai
exports.login = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || !/^[0-9+\-\s]{7,15}$/.test(mobile.trim())) {
      return res.status(400).json({ success: false, message: "Valid mobile number required" });
    }

    const cleanMobile = mobile.trim();

    // Check if any booking exists for this number
    const [rows] = await pool.query(
      `SELECT customer_name, customer_number, email
       FROM bookings
       WHERE customer_number = ?
       LIMIT 1`,
      [cleanMobile]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Koi booking nahi mili is number se. Pehle booking karein.",
      });
    }

    const customer = {
      name:   rows[0].customer_name,
      mobile: rows[0].customer_number,
      email:  rows[0].email || "",
    };

    const token = jwt.sign(
      { mobile: cleanMobile, role: "customer" },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      customer,
    });
  } catch (err) {
    console.error("customer login:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/customer-auth/bookings ──────────────────────────────────────────
// Header: Authorization: Bearer <token>
exports.myBookings = async (req, res) => {
  try {
    const mobile = req.customerMobile; // set by middleware

    const [rows] = await pool.query(
  `SELECT
     b.*,
     p.name          AS partner_name,
     p.mobile        AS partner_mobile,
     p.profile_pic   AS partner_profile_pic
   FROM bookings b
   LEFT JOIN partners p ON b.partner_id = p.id
   WHERE b.customer_number = ?
   ORDER BY b.created_at DESC`,
  [mobile]
);

    const bookings = rows.map(shapeBooking);

    // Basic stats
    const stats = {
      total:     bookings.length,
      pending:   bookings.filter(b => b.status === "pending").length,
      confirmed: bookings.filter(b => b.status === "confirmed").length,
      inProgress:bookings.filter(b => b.status === "in_progress").length,
      completed: bookings.filter(b => b.status === "completed").length,
      cancelled: bookings.filter(b => b.status === "cancelled").length,
      totalSpent:bookings.filter(b => b.status === "completed")
                         .reduce((s, b) => s + b.totalPrice, 0),
    };

    res.json({ success: true, data: bookings, stats });
  } catch (err) {
    console.error("myBookings:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/customer-auth/me ─────────────────────────────────────────────────
exports.me = async (req, res) => {
  try {
    const mobile = req.customerMobile;
    const [rows] = await pool.query(
      `SELECT customer_name AS name, customer_number AS mobile, email
       FROM bookings WHERE customer_number = ? LIMIT 1`,
      [mobile]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};