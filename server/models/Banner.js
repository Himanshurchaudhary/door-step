const { pool } = require('../config/db.js');

const Banner = {

  // Create table + run migrations for any missing columns
  createTable: async () => {
    // Base table (only runs if not exists)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        title       VARCHAR(255),
        subtitle    VARCHAR(255),
        image       VARCHAR(500) NOT NULL,
        link        VARCHAR(500),
        position    VARCHAR(50)  NOT NULL DEFAULT 'home_top',
        is_active   TINYINT(1)   NOT NULL DEFAULT 1,
        sort_order  INT          NOT NULL DEFAULT 0,
        created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
        updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Migrations — safe to run every time (IF NOT EXISTS)
    const migrations = [
      "ALTER TABLE banners ADD COLUMN IF NOT EXISTS subtitle   VARCHAR(255) AFTER title",
      "ALTER TABLE banners ADD COLUMN IF NOT EXISTS link       VARCHAR(500) AFTER image",
      "ALTER TABLE banners ADD COLUMN IF NOT EXISTS position   VARCHAR(50)  NOT NULL DEFAULT 'home_top' AFTER link",
      "ALTER TABLE banners ADD COLUMN IF NOT EXISTS is_active  TINYINT(1)   NOT NULL DEFAULT 1          AFTER position",
      "ALTER TABLE banners ADD COLUMN IF NOT EXISTS sort_order INT          NOT NULL DEFAULT 0          AFTER is_active",
      "ALTER TABLE banners ADD COLUMN IF NOT EXISTS created_at DATETIME     DEFAULT CURRENT_TIMESTAMP   AFTER sort_order",
      "ALTER TABLE banners ADD COLUMN IF NOT EXISTS updated_at DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at",
    ];

    for (const sql of migrations) {
      try {
        await pool.query(sql);
      } catch (err) {
        // Column already exists — safe to ignore
        if (err.code !== 'ER_DUP_FIELDNAME') {
          console.warn('Migration warning:', err.message);
        }
      }
    }

    console.log('✅ banners table ready');
  },

  // Get all banners
  getAll: async () => {
    const [rows] = await pool.query(
      'SELECT * FROM banners ORDER BY sort_order ASC, created_at DESC'
    );
    return rows;
  },

  // Get active banners by position (for frontend)
  getByPosition: async (position) => {
    const [rows] = await pool.query(
      'SELECT * FROM banners WHERE position = ? AND is_active = 1 ORDER BY sort_order ASC',
      [position]
    );
    return rows;
  },

  // Get single banner by ID
  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM banners WHERE id = ?', [id]);
    return rows[0] || null;
  },

  // Create banner
  create: async (data) => {
    const { title, subtitle, image, link, position, is_active, sort_order } = data;
    const [result] = await pool.query(
      `INSERT INTO banners (title, subtitle, image, link, position, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title       || null,
        subtitle    || null,
        image,
        link        || null,
        position    || 'home_top',
        is_active   ?? 1,
        sort_order  || 0,
      ]
    );
    return result.insertId;
  },

  // Update banner (only provided fields)
  update: async (id, data) => {
    const fields = [];
    const values = [];

    if (data.title      !== undefined) { fields.push('title = ?');      values.push(data.title); }
    if (data.subtitle   !== undefined) { fields.push('subtitle = ?');   values.push(data.subtitle); }
    if (data.image      !== undefined) { fields.push('image = ?');      values.push(data.image); }
    if (data.link       !== undefined) { fields.push('link = ?');       values.push(data.link); }
    if (data.position   !== undefined) { fields.push('position = ?');   values.push(data.position); }
    if (data.is_active  !== undefined) { fields.push('is_active = ?');  values.push(data.is_active); }
    if (data.sort_order !== undefined) { fields.push('sort_order = ?'); values.push(data.sort_order); }

    if (fields.length === 0) return false;

    values.push(id);
    await pool.query(`UPDATE banners SET ${fields.join(', ')} WHERE id = ?`, values);
    return true;
  },

  // Delete banner
  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM banners WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Toggle active/inactive
  toggleStatus: async (id) => {
    await pool.query(
      'UPDATE banners SET is_active = NOT is_active WHERE id = ?', [id]
    );
    const [rows] = await pool.query('SELECT is_active FROM banners WHERE id = ?', [id]);
    return rows[0]?.is_active;
  },
};

module.exports = Banner;