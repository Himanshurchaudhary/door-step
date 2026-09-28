const express = require("express");
const router  = express.Router();
const ctrl    = require("../Controllers/serviceCity.controller");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/active", ctrl.getActive);                          // GET  /api/service-cities/active

// ── Admin (protected) ─────────────────────────────────────────────────────────
router.get(   "/",           protect, isAdmin, ctrl.getAll);    // GET    /api/service-cities
router.get(   "/:id",        protect, isAdmin, ctrl.getOne);    // GET    /api/service-cities/:id
router.post(  "/",           protect, isAdmin, ctrl.create);    // POST   /api/service-cities
router.put(   "/:id",        protect, isAdmin, ctrl.update);    // PUT    /api/service-cities/:id
router.patch( "/:id/toggle", protect, isAdmin, ctrl.toggle);    // PATCH  /api/service-cities/:id/toggle
router.delete("/:id",        protect, isAdmin, ctrl.remove);    // DELETE /api/service-cities/:id

module.exports = router;