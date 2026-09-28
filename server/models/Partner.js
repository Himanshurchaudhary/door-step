const { pool } = require('../config/db.js');
const bcrypt   = require('bcryptjs');

// NOTE: profile_pic, pan_pic, aadhar_front_pic, aadhar_back_pic, driving_license_pic
// store Cloudinary public_ids (strings), same convention as packages.images.
// Full URL is reconstructed on the frontend: `${CDN}/${public_id}`

const Partner = {

  // ── Create table + run safe migrations ───────────────────────────────────
  createTable: async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS partners (
        id                  INT AUTO_INCREMENT PRIMARY KEY,
        name                VARCHAR(150)  NOT NULL,          -- as per Aadhar
        dob                 DATE          NOT NULL,
        mobile              VARCHAR(15)   NOT NULL UNIQUE,
        email               VARCHAR(150)  NOT NULL UNIQUE,
        password            VARCHAR(255)  NOT NULL,          -- bcrypt hash
        driving_license_no  VARCHAR(50)   NULL,               -- optional
        experience_years    INT           NULL,
        profile_pic         VARCHAR(255)  NULL,
        pan_pic             VARCHAR(255)  NULL,
        aadhar_front_pic    VARCHAR(255)  NULL,
        aadhar_back_pic     VARCHAR(255)  NULL,
        driving_license_pic VARCHAR(255)  NULL,               -- optional
        is_active           TINYINT(1)    NOT NULL DEFAULT 1,
        created_at          DATETIME      DEFAULT CURRENT_TIMESTAMP,
        updated_at          DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    const migrations = [
      "ALTER TABLE partners ADD COLUMN IF NOT EXISTS driving_license_no  VARCHAR(50)  NULL AFTER password",
      "ALTER TABLE partners ADD COLUMN IF NOT EXISTS experience_years    INT          NULL AFTER driving_license_no",
      "ALTER TABLE partners ADD COLUMN IF NOT EXISTS profile_pic         VARCHAR(255) NULL AFTER experience_years",
      "ALTER TABLE partners ADD COLUMN IF NOT EXISTS pan_pic             VARCHAR(255) NULL AFTER profile_pic",
      "ALTER TABLE partners ADD COLUMN IF NOT EXISTS aadhar_front_pic    VARCHAR(255) NULL AFTER pan_pic",
      "ALTER TABLE partners ADD COLUMN IF NOT EXISTS aadhar_back_pic     VARCHAR(255) NULL AFTER aadhar_front_pic",
      "ALTER TABLE partners ADD COLUMN IF NOT EXISTS driving_license_pic VARCHAR(255) NULL AFTER aadhar_back_pic",
      "ALTER TABLE partners ADD COLUMN IF NOT EXISTS is_active           TINYINT(1)   NOT NULL DEFAULT 1 AFTER driving_license_pic",
    ];

    for (const sql of migrations) {
      try {
        await pool.query(sql);
      } catch (err) {
        if (err.code !== 'ER_DUP_FIELDNAME') {
          console.warn('Migration warning:', err.message);
        }
      }
    }

    console.log('partners table ready');
  },

  // ── Helper: strip password before sending to frontend ────────────────────
  _parse: (row) => {
    const { password, ...safe } = row;
    return safe;
  },

  // ── Get all partners (admin) ──────────────────────────────────────────────
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM partners ORDER BY created_at DESC');
    return rows.map(Partner._parse);
  },

  // ── Get single partner by ID (safe — no password) ─────────────────────────
  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM partners WHERE id = ?', [id]);
    if (!rows[0]) return null;
    return Partner._parse(rows[0]);
  },

  // ── Get by email/mobile (used for uniqueness + login, includes password) ──
  findByEmailOrMobile: async (email, mobile) => {
    const [rows] = await pool.query(
      'SELECT * FROM partners WHERE email = ? OR mobile = ? LIMIT 1',
      [email, mobile]
    );
    return rows[0] || null;
  },

  // ── Create new partner ─────────────────────────────────────────────────────
  create: async (data) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const [result] = await pool.query(
      `INSERT INTO partners
        (name, dob, mobile, email, password, driving_license_no, experience_years,
         profile_pic, pan_pic, aadhar_front_pic, aadhar_back_pic, driving_license_pic, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.dob,
        data.mobile,
        data.email,
        hashedPassword,
        data.driving_license_no || null,
        data.experience_years ?? null,
        data.profile_pic || null,
        data.pan_pic || null,
        data.aadhar_front_pic || null,
        data.aadhar_back_pic || null,
        data.driving_license_pic || null,
        data.is_active ?? 1,
      ]
    );
    return result.insertId;
  },

  // ── Update (only fields that are provided) ─────────────────────────────────
  update: async (id, data) => {
    const fields = [];
    const values = [];

    const simpleFields = [
      'name', 'dob', 'mobile', 'email', 'driving_license_no', 'experience_years',
      'profile_pic', 'pan_pic', 'aadhar_front_pic', 'aadhar_back_pic',
      'driving_license_pic', 'is_active',
    ];

    for (const key of simpleFields) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    // Password changes go through a hashed update
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      fields.push('password = ?');
      values.push(hashedPassword);
    }

    if (fields.length === 0) return false;

    values.push(id);
    await pool.query(`UPDATE partners SET ${fields.join(', ')} WHERE id = ?`, values);
    return true;
  },

  // ── Delete partner ────────────────────────────────────────────────────────
  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM partners WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // ── Toggle active / inactive ──────────────────────────────────────────────
  toggleStatus: async (id) => {
    await pool.query('UPDATE partners SET is_active = NOT is_active WHERE id = ?', [id]);
    const [rows] = await pool.query('SELECT is_active FROM partners WHERE id = ?', [id]);
    return rows[0]?.is_active;
  },
};

module.exports = Partner;