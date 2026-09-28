// routes/booking.routes.js
const express = require("express");
const router  = express.Router();
const ctrl    = require("../Controllers/Booking.controller");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// ── Public ────────────────────────────────────────────────────────────────────
router.post("/", ctrl.create);                                    // POST   /api/bookings  (website form submit)

// ── Admin (protected) ─────────────────────────────────────────────────────────
router.get(   "/stats",       protect, isAdmin, ctrl.stats);       // GET    /api/bookings/stats
router.get(   "/",            protect, isAdmin, ctrl.getAll);      // GET    /api/bookings
router.get(   "/:id",         protect, isAdmin, ctrl.getOne);      // GET    /api/bookings/:id
router.patch( "/:id/status",  protect, isAdmin, ctrl.updateStatus);// PATCH  /api/bookings/:id/status
router.put(   "/:id",         protect, isAdmin, ctrl.update);      // PUT    /api/bookings/:id
router.delete("/:id",         protect, isAdmin, ctrl.remove);      // DELETE /api/bookings/:id
router.patch("/:id/assign", protect, isAdmin, ctrl.assign); // PATCH /api/bookings/:id/assign

module.exports = router;

// ── Register in app.js / server.js ───────────────────────────────────────────
// const bookingRoutes = require("./routes/booking.routes");
// app.use("/api/bookings", bookingRoutes);
//
// Also add to routes array in server.js:
// ['/api/bookings', './routes/booking.routes.js'],
//
// And in initDB():
// const Booking = require('./models/booking.model');
// await Booking.createTable();