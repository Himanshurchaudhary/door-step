const express = require("express");
const router  = express.Router();
const ctrl    = require("../Controllers/customerAuth.controller");
const { protectCustomer } = require("../middleware/customerAuth.middleware");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// ── Customer Auth (public) ────────────────────────────────────────────────────
router.post("/login",    ctrl.login);
router.get("/me",        protectCustomer, ctrl.me);
router.get("/bookings",  protectCustomer, ctrl.myBookings);


module.exports = router;