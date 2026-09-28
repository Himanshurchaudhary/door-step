const { pool } = require("../config/db");

// ── Shape helper ──────────────────────────────────────────────────────────────
const shape = (row) => ({
  id:        row.id,
  name:      row.name,
  state:     row.state,
  isActive:  row.is_active === 1,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// ── Queries ───────────────────────────────────────────────────────────────────
const ServiceCityModel = {

  /** All cities — admin */
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT * FROM service_cities ORDER BY created_at DESC"
    );
    return rows.map(shape);
  },

  /** Only active cities — public/website */
  findActive: async () => {
    const [rows] = await pool.query(
      "SELECT * FROM service_cities WHERE is_active = 1 ORDER BY name ASC"
    );
    return rows.map(shape);
  },

  /** Single city by id */
  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM service_cities WHERE id = ?",
      [id]
    );
    return rows[0] ? shape(rows[0]) : null;
  },

  /** Create */
  create: async ({ name, state, isActive = true }) => {
    const [result] = await pool.query(
      `INSERT INTO service_cities (name, state, is_active)
       VALUES (?, ?, ?)`,
      [name, state, isActive ? 1 : 0]
    );
    return ServiceCityModel.findById(result.insertId);
  },

  /** Update */
  update: async (id, { name, state, isActive }) => {
    const fields = [];
    const vals   = [];

    if (name     !== undefined) { fields.push("name = ?");      vals.push(name); }
    if (state    !== undefined) { fields.push("state = ?");     vals.push(state); }
    if (isActive !== undefined) { fields.push("is_active = ?"); vals.push(isActive ? 1 : 0); }

    if (!fields.length) return ServiceCityModel.findById(id);

    vals.push(id);
    await pool.query(
      `UPDATE service_cities SET ${fields.join(", ")} WHERE id = ?`,
      vals
    );
    return ServiceCityModel.findById(id);
  },

  /** Toggle active status */
  toggleActive: async (id) => {
    await pool.query(
      "UPDATE service_cities SET is_active = NOT is_active WHERE id = ?",
      [id]
    );
    return ServiceCityModel.findById(id);
  },

  /** Delete */
  remove: async (id) => {
    const [result] = await pool.query(
      "DELETE FROM service_cities WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = ServiceCityModel;