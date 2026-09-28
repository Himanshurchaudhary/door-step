const { pool } = require('../config/db.js');

// NOTE: images column stores an array of Cloudinary public_ids (strings).
// The full URL is reconstructed on the frontend or via cloudinary.url().
// Example stored value: ["seva-mart/packages/abc123", "seva-mart/packages/xyz456"]

const Package = {

  // ── Create table + run safe migrations ───────────────────────────────────
  createTable: async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS packages (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        name         VARCHAR(100)   NOT NULL,
        price        DECIMAL(10,2)  NOT NULL,
        description  TEXT,
        features     JSON,
        images       JSON,
        is_active    TINYINT(1)     NOT NULL DEFAULT 1,
        sort_order   INT            NOT NULL DEFAULT 0,
        created_at   DATETIME       DEFAULT CURRENT_TIMESTAMP,
        updated_at   DATETIME       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Safe migrations — run every time, skip if column already exists
    const migrations = [
      "ALTER TABLE packages ADD COLUMN IF NOT EXISTS description  TEXT          AFTER price",
      "ALTER TABLE packages ADD COLUMN IF NOT EXISTS features     JSON          AFTER description",
      "ALTER TABLE packages ADD COLUMN IF NOT EXISTS images       JSON          AFTER features",
      "ALTER TABLE packages ADD COLUMN IF NOT EXISTS is_active    TINYINT(1)    NOT NULL DEFAULT 1 AFTER images",
      "ALTER TABLE packages ADD COLUMN IF NOT EXISTS sort_order   INT           NOT NULL DEFAULT 0 AFTER is_active",
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

    // Seed default packages only if table is empty
    const [existing] = await pool.query('SELECT COUNT(*) AS cnt FROM packages');
    if (existing[0].cnt === 0) {
      const defaults = [
        {
          name:        'Basic Wash',
          price:       399,
          description: 'Essential exterior cleaning at your doorstep',
          features:    JSON.stringify(['Exterior Wash', 'Tyre & Rim Cleaning', 'Door & Window Cleaning', 'Basic Vacuum']),
          sort_order:  1,
        },
        {
          name:        'Standard Wash',
          price:       499,
          description: 'Complete wash with interior care',
          features:    JSON.stringify(['Everything in Basic', 'Interior Vacuum Cleaning', 'Dashboard Cleaning', 'Glass Cleaning', 'Tyre Dressing']),
          sort_order:  2,
        },
        {
          name:        'Premium Wash',
          price:       799,
          description: 'Full detailing — inside & out',
          features:    JSON.stringify(['Everything in Standard', 'Premium Detailing', 'Interior Deep Cleaning', 'Polish (Exterior)', 'Air Freshener']),
          sort_order:  3,
        },
      ];

      for (const pkg of defaults) {
        await pool.query(
          `INSERT INTO packages (name, price, description, features, sort_order) VALUES (?, ?, ?, ?, ?)`,
          [pkg.name, pkg.price, pkg.description, pkg.features, pkg.sort_order]
        );
      }
      console.log('Default packages seeded');
    }

    console.log('packages table ready');
  },

  // ── Helper: parse JSON fields safely ─────────────────────────────────────
  _parse: (row) => ({
    ...row,
    features: typeof row.features === 'string' ? JSON.parse(row.features) : (row.features || []),
    images:   typeof row.images   === 'string' ? JSON.parse(row.images)   : (row.images   || []),
  }),

  // ── Get all packages (admin) ──────────────────────────────────────────────
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM packages ORDER BY sort_order ASC, created_at ASC');
    return rows.map(Package._parse);
  },

  // ── Get active packages only (for the public frontend) ───────────────────
  getActive: async () => {
    const [rows] = await pool.query('SELECT * FROM packages WHERE is_active = 1 ORDER BY sort_order ASC');
    return rows.map(Package._parse);
  },

  // ── Get single package by ID ──────────────────────────────────────────────
  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM packages WHERE id = ?', [id]);
    if (!rows[0]) return null;
    return Package._parse(rows[0]);
  },

  // ── Create new package ────────────────────────────────────────────────────
  // images: array of Cloudinary public_ids
  create: async (data) => {
    const { name, price, description, features, images, is_active, sort_order } = data;
    const [result] = await pool.query(
      `INSERT INTO packages (name, price, description, features, images, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        price,
        description || null,
        features   ? JSON.stringify(features) : null,
        images     ? JSON.stringify(images)   : null,
        is_active  ?? 1,
        sort_order || 0,
      ]
    );
    return result.insertId;
  },

  // ── Update (only the fields that are provided) ────────────────────────────
  update: async (id, data) => {
    const fields = [];
    const values = [];

    if (data.name        !== undefined) { fields.push('name = ?');        values.push(data.name); }
    if (data.price       !== undefined) { fields.push('price = ?');       values.push(data.price); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
    if (data.features    !== undefined) { fields.push('features = ?');    values.push(JSON.stringify(data.features)); }
    if (data.images      !== undefined) { fields.push('images = ?');      values.push(JSON.stringify(data.images)); }
    if (data.is_active   !== undefined) { fields.push('is_active = ?');   values.push(data.is_active); }
    if (data.sort_order  !== undefined) { fields.push('sort_order = ?');  values.push(data.sort_order); }

    if (fields.length === 0) return false;

    values.push(id);
    await pool.query(`UPDATE packages SET ${fields.join(', ')} WHERE id = ?`, values);
    return true;
  },

  // ── Delete package ────────────────────────────────────────────────────────
  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM packages WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // ── Toggle active / inactive ──────────────────────────────────────────────
  toggleStatus: async (id) => {
    await pool.query('UPDATE packages SET is_active = NOT is_active WHERE id = ?', [id]);
    const [rows] = await pool.query('SELECT is_active FROM packages WHERE id = ?', [id]);
    return rows[0]?.is_active;
  },
};

module.exports = Package;