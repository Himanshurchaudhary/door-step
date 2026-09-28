const express = require("express");
const router  = express.Router();
const ctrl    = require("../Controllers/partnerAuth.controller");
const { protectPartner } = require("../middleware/partnerAuth.middleware");

router.post("/login",        ctrl.login);
router.get("/me",            protectPartner, ctrl.me);
router.get("/my-bookings",   protectPartner, ctrl.myBookings);
router.patch("/booking/:id/status", protectPartner, ctrl.updateBookingStatus);

module.exports = router;