const express = require("express");
const router  = express.Router();
const ctrl    = require("../Controllers/carType.controller");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/active", ctrl.getActive);                          // GET  /api/car-types/active

// ── Admin (protected) ─────────────────────────────────────────────────────────
router.get(   "/",           protect, isAdmin, ctrl.getAll);    // GET    /api/car-types
router.get(   "/:id",        protect, isAdmin, ctrl.getOne);    // GET    /api/car-types/:id
router.post(  "/",           protect, isAdmin, ctrl.create);    // POST   /api/car-types
router.put(   "/:id",        protect, isAdmin, ctrl.update);    // PUT    /api/car-types/:id
router.patch( "/:id/toggle", protect, isAdmin, ctrl.toggle);    // PATCH  /api/car-types/:id/toggle
router.delete("/:id",        protect, isAdmin, ctrl.remove);    // DELETE /api/car-types/:id

module.exports = router;