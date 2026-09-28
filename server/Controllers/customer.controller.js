// controllers/customer.controller.js
// Customers are derived from the bookings table — no separate customers table needed.

const { pool } = require("../config/db");

// ── helpers ───────────────────────────────────────────────────────────────────
const fmtBooking = (row) => ({
  id:            row.id,
  bookingDate:   row.booking_date,
  bookingTime:   row.booking_time,
  cityName:      row.city_name,
  packageName:   row.package_name   || null,
  packagePrice:  row.package_price  !== null ? parseFloat(row.package_price)  : 0,
  carTypeName:   row.car_type_name,
  addons:        row.addons
                   ? (typeof row.addons === "string" ? JSON.parse(row.addons) : row.addons)
                   : [],
  totalPrice:    parseFloat(row.total_price),
  status:        row.status,
  addressType:   row.address_type,
  fullAddress:   row.full_address   || "",
  latitude:      row.latitude  !== null ? parseFloat(row.latitude)  : null,
  longitude:     row.longitude !== null ? parseFloat(row.longitude) : null,
  partnerName:   row.partner_name   || null,
  notes:         row.notes          || "",
  createdAt:     row.created_at,
});

// ── GET /api/customers ────────────────────────────────────────────────────────
// Returns one row per unique customer_number with aggregated stats.
exports.getAll = async (req, res) => {
  try {
    const { search } = req.query;

    let where = "";
    const vals = [];
    if (search) {
      where = "WHERE customer_name LIKE ? OR customer_number LIKE ? OR email LIKE ?";
      const s = `%${search}%`;
      vals.push(s, s, s);
    }

    const [rows] = await pool.query(
      `SELECT
         customer_number                                   AS phone,
         MAX(customer_name)                                AS name,
         MAX(email)                                        AS email,
         COUNT(*)                                          AS totalBookings,
         SUM(status = 'completed')                         AS completedBookings,
         SUM(status = 'cancelled')                         AS cancelledBookings,
         SUM(status = 'pending')                           AS pendingBookings,
         SUM(IF(status = 'completed', total_price, 0))     AS totalSpent,
         MAX(created_at)                                   AS lastBookingAt,
         MIN(created_at)                                   AS firstBookingAt
       FROM bookings
       ${where}
       GROUP BY customer_number
       ORDER BY lastBookingAt DESC`,
      vals
    );

    const customers = rows.map((r) => ({
      phone:             r.phone,
      name:              r.name,
      email:             r.email || "",
      totalBookings:     Number(r.totalBookings),
      completedBookings: Number(r.completedBookings),
      cancelledBookings: Number(r.cancelledBookings),
      pendingBookings:   Number(r.pendingBookings),
      totalSpent:        parseFloat(r.totalSpent || 0),
      lastBookingAt:     r.lastBookingAt,
      firstBookingAt:    r.firstBookingAt,
    }));

    res.json({ success: true, data: customers, total: customers.length });
  } catch (err) {
    console.error("customers getAll:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/customers/:phone ─────────────────────────────────────────────────
// Returns customer profile + all their bookings.
exports.getOne = async (req, res) => {
  try {
    const { phone } = req.params;

    // All bookings for this phone
    const [bookingRows] = await pool.query(
      `SELECT * FROM bookings WHERE customer_number = ? ORDER BY created_at DESC`,
      [phone]
    );

    if (!bookingRows.length) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    const bookings = bookingRows.map(fmtBooking);

    // Aggregate stats
    const totalSpent      = bookings.filter(b => b.status === "completed").reduce((s, b) => s + b.totalPrice, 0);
    const totalBookings   = bookings.length;
    const completed       = bookings.filter(b => b.status === "completed").length;
    const cancelled       = bookings.filter(b => b.status === "cancelled").length;
    const pending         = bookings.filter(b => b.status === "pending").length;
    const inProgress      = bookings.filter(b => b.status === "in_progress").length;
    const confirmed       = bookings.filter(b => b.status === "confirmed").length;

    // Package usage breakdown
    const pkgMap = {};
    bookings.forEach(b => {
      if (b.packageName) {
        pkgMap[b.packageName] = (pkgMap[b.packageName] || 0) + 1;
      }
    });
    const packageBreakdown = Object.entries(pkgMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Addon usage
    const addonMap = {};
    bookings.forEach(b => {
      b.addons.forEach(a => {
        addonMap[a.name] = (addonMap[a.name] || 0) + 1;
      });
    });
    const addonBreakdown = Object.entries(addonMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Cities visited
    const citiesSet = [...new Set(bookings.map(b => b.cityName).filter(Boolean))];

    // Car types used
    const carSet = [...new Set(bookings.map(b => b.carTypeName).filter(Boolean))];

    const profile = {
      name:              bookingRows[0].customer_name,
      phone,
      email:             bookingRows[0].email || "",
      firstBookingAt:    bookings[bookings.length - 1].createdAt,
      lastBookingAt:     bookings[0].createdAt,
      stats: {
        totalBookings,
        completed,
        cancelled,
        pending,
        inProgress,
        confirmed,
        totalSpent,
      },
      packageBreakdown,
      addonBreakdown,
      cities:    citiesSet,
      carTypes:  carSet,
      bookings,
    };

    res.json({ success: true, data: profile });
  } catch (err) {
    console.error("customers getOne:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};