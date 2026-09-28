const { pool } = require("../config/db");

const shape = (row) => ({
  id:          row.id,
  name:        row.name,
  description: row.description,
  isActive:    row.is_active === 1,
  createdAt:   row.created_at,
  updatedAt:   row.updated_at,
});

const CarTypeModel = {

  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT * FROM car_types ORDER BY created_at DESC"
    );
    return rows.map(shape);
  },

  findActive: async () => {
    const [rows] = await pool.query(
      "SELECT * FROM car_types WHERE is_active = 1 ORDER BY name ASC"
    );
    return rows.map(shape);
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM car_types WHERE id = ?",
      [id]
    );
    return rows[0] ? shape(rows[0]) : null;
  },

  create: async ({ name, description = null, isActive = true }) => {
    const [result] = await pool.query(
      `INSERT INTO car_types (name, description, is_active)
       VALUES (?, ?, ?)`,
      [name, description, isActive ? 1 : 0]
    );
    return CarTypeModel.findById(result.insertId);
  },

  update: async (id, { name, description, isActive }) => {
    const fields = [];
    const vals   = [];

    if (name        !== undefined) { fields.push("name = ?");        vals.push(name); }
    if (description !== undefined) { fields.push("description = ?"); vals.push(description); }
    if (isActive    !== undefined) { fields.push("is_active = ?");   vals.push(isActive ? 1 : 0); }

    if (!fields.length) return CarTypeModel.findById(id);

    vals.push(id);
    await pool.query(
      `UPDATE car_types SET ${fields.join(", ")} WHERE id = ?`,
      vals
    );
    return CarTypeModel.findById(id);
  },

  toggleActive: async (id) => {
    await pool.query(
      "UPDATE car_types SET is_active = NOT is_active WHERE id = ?",
      [id]
    );
    return CarTypeModel.findById(id);
  },

  remove: async (id) => {
    const [result] = await pool.query(
      "DELETE FROM car_types WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = CarTypeModel;