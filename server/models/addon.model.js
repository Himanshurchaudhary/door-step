// models/addon.model.js
const {pool} = require("../config/db"); // your existing pool

// ── shape helper ─────────────────────────────────────────────────────────────
const shape = (row) => ({
  id:          row.id,
  name:        row.name,
  description: row.description || "",
  price:       parseFloat(row.price),
  isActive:    row.is_active === 1,
  createdAt:   row.created_at,
  updatedAt:   row.updated_at,
});

// ── queries ───────────────────────────────────────────────────────────────────
const AddonModel = {
  /** All addons (admin) */
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT * FROM addons ORDER BY created_at DESC"
    );
    return rows.map(shape);
  },

  /** Only active addons (website) */
  findActive: async () => {
    const [rows] = await pool.query(
      "SELECT * FROM addons WHERE is_active = 1 ORDER BY price ASC"
    );
    return rows.map(shape);
  },

  /** Single addon by id */
  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM addons WHERE id = ?",
      [id]
    );
    return rows[0] ? shape(rows[0]) : null;
  },

  /** Create */
  create: async ({ name, description, price,  isActive = true }) => {
    const [result] = await pool.query(
      `INSERT INTO addons (name, description, price, is_active)
       VALUES (?, ?, ?, ?)`,
      [name, description || null, price,    isActive ? 1 : 0]
    );
    return AddonModel.findById(result.insertId);
  },

  /** Update */
  update: async (id, { name, description, price, isActive }) => {
    const fields = [];
    const vals   = [];

    if (name        !== undefined) { fields.push("name = ?");        vals.push(name); }
    if (description !== undefined) { fields.push("description = ?"); vals.push(description); }
    if (price       !== undefined) { fields.push("price = ?");       vals.push(price); }
    if (isActive    !== undefined) { fields.push("is_active = ?");   vals.push(isActive ? 1 : 0); }

    if (!fields.length) return AddonModel.findById(id);

    vals.push(id);
    await pool.query(
      `UPDATE addons SET ${fields.join(", ")} WHERE id = ?`,
      vals
    );
    return AddonModel.findById(id);
  },

  /** Toggle active status */
  toggleActive: async (id) => {
    await pool.query(
      "UPDATE addons SET is_active = NOT is_active WHERE id = ?",
      [id]
    );
    return AddonModel.findById(id);
  },

  /** Delete */
  remove: async (id) => {
    const [result] = await pool.query(
      "DELETE FROM addons WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = AddonModel;