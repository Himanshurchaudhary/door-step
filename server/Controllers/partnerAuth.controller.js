const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const { pool } = require("../config/db");

const JWT_SECRET  = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES = "7d";

const ALLOWED_STATUSES = ["pending", "confirmed", "in_progress", "completed", "cancelled"];

exports.login = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password)
      return res.status(400).json({ success: false, message: "Mobile and password required" });

    const [rows] = await pool.query(
      "SELECT * FROM partners WHERE mobile = ? LIMIT 1", [mobile.trim()]
    );
    if (!rows.length)
      return res.status(404).json({ success: false, message: "Partner not found" });

    const partner = rows[0];
    if (!partner.is_active)
      return res.status(403).json({ success: false, message: "Account deactivated" });

    const valid = await bcrypt.compare(password, partner.password);
    if (!valid)
      return res.status(401).json({ success: false, message: "Invalid password" });

    const token = jwt.sign(
      { id: partner.id, mobile: partner.mobile, role: "partner" },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    const { password: _, ...safe } = partner;
    res.json({ success: true, token, partner: safe });
  } catch (err) {
    console.error("partner login:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.me = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, mobile, email, profile_pic, experience_years, is_active FROM partners WHERE id = ?",
      [req.partnerId]
    );
    if (!rows.length) return res.status(404).json({ success: false });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.myBookings = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM bookings WHERE partner_id = ? ORDER BY created_at DESC`,
      [req.partnerId]
    );

    const bookings = rows.map(row => ({
      id:             row.id,
      customerName:   row.customer_name,
      customerNumber: row.customer_number,
      email:          row.email || "",
      cityName:       row.city_name,
      carTypeName:    row.car_type_name,
      packageName:    row.package_name  || null,
      totalPrice:     parseFloat(row.total_price),
      status:         row.status,
      bookingDate:    row.booking_date,
      bookingTime:    row.booking_time,
      addressType:    row.address_type,
      fullAddress:    row.full_address  || "",
      latitude:       row.latitude  !== null ? parseFloat(row.latitude)  : null,
      longitude:      row.longitude !== null ? parseFloat(row.longitude) : null,
      notes:          row.notes || "",
      addons:         row.addons ? (typeof row.addons === "string" ? JSON.parse(row.addons) : row.addons) : [],
      createdAt:      row.created_at,
    }));

    const stats = {
      total:      bookings.length,
      pending:    bookings.filter(b => b.status === "pending").length,
      confirmed:  bookings.filter(b => b.status === "confirmed").length,
      inProgress: bookings.filter(b => b.status === "in_progress").length,
      completed:  bookings.filter(b => b.status === "completed").length,
      cancelled:  bookings.filter(b => b.status === "cancelled").length,
      earned:     bookings.filter(b => b.status === "completed").reduce((s, b) => s + b.totalPrice, 0),
    };

    res.json({ success: true, data: bookings, stats });
  } catch (err) {
    console.error("myBookings:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!ALLOWED_STATUSES.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const [rows] = await pool.query(
      "SELECT * FROM bookings WHERE id = ? AND partner_id = ?",
      [req.params.id, req.partnerId]
    );
    if (!rows.length)
      return res.status(404).json({ success: false, message: "Booking not found or not assigned to you" });

    await pool.query("UPDATE bookings SET status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ success: true, message: `Status updated to ${status}` });
  } catch (err) {
    console.error("updateBookingStatus:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};