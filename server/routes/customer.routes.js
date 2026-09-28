// routes/customer.routes.js
const express = require("express");
const router  = express.Router();
const ctrl    = require("../Controllers/customer.controller");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// GET /api/customers          — all customers (with search)
router.get("/",       protect, isAdmin, ctrl.getAll);

// GET /api/customers/:phone   — single customer profile + all bookings
router.get("/:phone", protect, isAdmin, ctrl.getOne);

module.exports = router;

// ── Register in app.js / server.js ───────────────────────────────────────────
// const customerRoutes = require("./routes/customer.routes");
// app.use("/api/customers", customerRoutes);