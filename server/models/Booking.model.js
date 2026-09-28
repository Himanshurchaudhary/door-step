// models/booking.model.js
const { pool } = require("../config/db"); // your existing pool

// ── shape helper ─────────────────────────────────────────────────────────────
const shape = (row) => ({
  id:              row.id,
  customerName:    row.customer_name,
  customerNumber:  row.customer_number,
  email:           row.email || "",
  cityId:          row.city_id,
  cityName:        row.city_name,
  addressType:     row.address_type,              // 'full_address' | 'current_location'
  fullAddress:     row.full_address || "",
  latitude:        row.latitude !== null ? parseFloat(row.latitude) : null,
  longitude:       row.longitude !== null ? parseFloat(row.longitude) : null,
  packageId:       row.package_id,
  packageName:     row.package_name || "",
  packagePrice:    row.package_price !== null ? parseFloat(row.package_price) : 0,
  carTypeId:       row.car_type_id,
  carTypeName:     row.car_type_name,
  bookingDate:     row.booking_date,
  bookingTime:     row.booking_time,
  addons:          row.addons ? (typeof row.addons === "string" ? JSON.parse(row.addons) : row.addons) : [],
  totalPrice:      parseFloat(row.total_price),
  status:          row.status,
  notes:           row.notes || "",
  createdAt:       row.created_at,
  updatedAt:       row.updated_at,
  partnerId:   row.partner_id   ?? null,
partnerName: row.partner_name ?? "",
});

const BookingModel = {
  /** create table if not exists */
  createTable: async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        customer_name    VARCHAR(150)  NOT NULL,
        customer_number  VARCHAR(20)   NOT NULL,
        email            VARCHAR(150)  NULL,
        city_id          INT           NULL,
        city_name        VARCHAR(150)  NULL,
        address_type     ENUM('full_address','current_location') NOT NULL DEFAULT 'full_address',
        full_address     TEXT          NULL,
        latitude         DECIMAL(10,7) NULL,
        longitude        DECIMAL(10,7) NULL,
        package_id       INT           NULL,
        package_name     VARCHAR(150)  NULL,
        package_price    DECIMAL(10,2) NULL,
        car_type_id      INT           NULL,
        car_type_name    VARCHAR(150)  NULL,
        booking_date     DATE          NOT NULL,
        booking_time     VARCHAR(10)   NOT NULL,
        addons           JSON          NULL,
        total_price      DECIMAL(10,2) NOT NULL DEFAULT 0,
        status           ENUM('pending','confirmed','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
        notes            TEXT          NULL,
        created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
        updated_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_booking_date (booking_date)
      )
    `);

    // ── migration safety net: agar table pehle se exist karti thi (bina package
    //    columns ke), to yahan add kar do. Fresh installs pe ye no-op rahega
    //    kyunki CREATE TABLE upar hi columns ke saath bana dega.
    const addColumnIfMissing = async (name, ddl) => {
      const [rows] = await pool.query(
        `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = ?`,
        [name]
      );
      if (rows[0].cnt === 0) {
        await pool.query(`ALTER TABLE bookings ADD COLUMN ${ddl}`);
      }
    };
    await addColumnIfMissing("package_id", "package_id INT NULL AFTER longitude");
    await addColumnIfMissing("package_name", "package_name VARCHAR(150) NULL AFTER package_id");
    await addColumnIfMissing("package_price", "package_price DECIMAL(10,2) NULL AFTER package_name");
    await addColumnIfMissing(
  "partner_id",
  "partner_id INT NULL REFERENCES partners(id) ON DELETE SET NULL AFTER status"
);
await addColumnIfMissing(
  "partner_name",
  "partner_name VARCHAR(150) NULL AFTER partner_id"
);
  },

  /** Create a booking (public, from website) */
  create: async (data) => {
    const [result] = await pool.query(
      `INSERT INTO bookings
        (customer_name, customer_number, email, city_id, city_name, address_type,
         full_address, latitude, longitude, package_id, package_name, package_price,
         car_type_id, car_type_name, booking_date, booking_time, addons, total_price, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.customerName,
        data.customerNumber,
        data.email || null,
        data.cityId || null,
        data.cityName || null,
        data.addressType,
        data.fullAddress || null,
        data.latitude ?? null,
        data.longitude ?? null,
        data.packageId || null,
        data.packageName || null,
        data.packagePrice ?? null,
        data.carTypeId || null,
        data.carTypeName || null,
        data.bookingDate,
        data.bookingTime,
        JSON.stringify(data.addons || []),
        data.totalPrice || 0,
        data.status || "pending",
        data.notes || null,
      ]
    );
    return BookingModel.findById(result.insertId);
  },

  /** All bookings (admin) with optional filters */
  findAll: async ({ status, from, to, search } = {}) => {
    const where = [];
    const vals  = [];

    if (status) { where.push("status = ?"); vals.push(status); }
    if (from)   { where.push("booking_date >= ?"); vals.push(from); }
    if (to)     { where.push("booking_date <= ?"); vals.push(to); }
    if (search) {
      where.push("(customer_name LIKE ? OR customer_number LIKE ? OR email LIKE ?)");
      const s = `%${search}%`;
      vals.push(s, s, s);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const [rows] = await pool.query(
      `SELECT * FROM bookings ${whereSql} ORDER BY created_at DESC`,
      vals
    );
    return rows.map(shape);
  },

  /** Single booking */
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM bookings WHERE id = ?", [id]);
    return rows[0] ? shape(rows[0]) : null;
  },

  /** Update status only */
  updateStatus: async (id, status) => {
    await pool.query("UPDATE bookings SET status = ? WHERE id = ?", [status, id]);
    return BookingModel.findById(id);
  },

  /** General update (admin edit) */
  update: async (id, data) => {
    const fields = [];
    const vals   = [];
    const map = {
      customerName:   "customer_name",
      customerNumber: "customer_number",
      email:          "email",
      cityId:         "city_id",
      cityName:       "city_name",
      addressType:    "address_type",
      fullAddress:    "full_address",
      latitude:       "latitude",
      longitude:      "longitude",
      packageId:      "package_id",
      packageName:    "package_name",
      packagePrice:   "package_price",
      carTypeId:      "car_type_id",
      carTypeName:    "car_type_name",
      bookingDate:    "booking_date",
      bookingTime:    "booking_time",
      totalPrice:     "total_price",
      status:         "status",
      notes:          "notes",
    };

    for (const key of Object.keys(map)) {
      if (data[key] !== undefined) {
        fields.push(`${map[key]} = ?`);
        vals.push(data[key]);
      }
    }
    if (data.addons !== undefined) {
      fields.push("addons = ?");
      vals.push(JSON.stringify(data.addons));
    }

    if (!fields.length) return BookingModel.findById(id);

    vals.push(id);
    await pool.query(`UPDATE bookings SET ${fields.join(", ")} WHERE id = ?`, vals);
    return BookingModel.findById(id);
  },

  /** Delete */
  remove: async (id) => {
    const [result] = await pool.query("DELETE FROM bookings WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  /** Simple dashboard stats */
  stats: async () => {
    const [[counts]] = await pool.query(`
      SELECT
        COUNT(*)                                              AS total,
        SUM(status = 'pending')                                AS pending,
        SUM(status = 'confirmed')                              AS confirmed,
        SUM(status = 'in_progress')                            AS inProgress,
        SUM(status = 'completed')                              AS completed,
        SUM(status = 'cancelled')                              AS cancelled,
        SUM(booking_date = CURDATE())                          AS today,
        SUM(IF(status = 'completed', total_price, 0))          AS revenue
      FROM bookings
    `);
    return counts;
  },

  assign: async (id, partnerId) => {
  if (partnerId) {
    const [rows] = await pool.query(
      "SELECT id, name FROM partners WHERE id = ? AND is_active = 1",
      [partnerId]
    );
    if (!rows[0]) throw new Error("Partner not found or inactive");
    await pool.query(
      "UPDATE bookings SET partner_id = ?, partner_name = ? WHERE id = ?",
      [rows[0].id, rows[0].name, id]
    );
  } else {
    // unassign
    await pool.query(
      "UPDATE bookings SET partner_id = NULL, partner_name = NULL WHERE id = ?",
      [id]
    );
  }
  return BookingModel.findById(id);
},
};

module.exports = BookingModel;