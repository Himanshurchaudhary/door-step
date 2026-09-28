// routes/addon.routes.js
const express = require("express");
const router  = express.Router();
const ctrl    = require("../Controllers/Addon.controller");

// your existing admin auth middleware — import karo same as packages
const { protect, isAdmin } = require('../middleware/authMiddleware');

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/active", ctrl.getActive);          // GET  /api/addons/active

// ── Admin (protected) ─────────────────────────────────────────────────────────
router.get(   "/",          protect, isAdmin, ctrl.getAll);   // GET    /api/addons
router.get(   "/:id",       protect, isAdmin, ctrl.getOne);   // GET    /api/addons/:id
router.post(  "/",          protect, isAdmin, ctrl.create);   // POST   /api/addons
router.put(   "/:id",       protect, isAdmin, ctrl.update);   // PUT    /api/addons/:id
router.patch( "/:id/toggle",protect, isAdmin, ctrl.toggle);   // PATCH  /api/addons/:id/toggle
router.delete("/:id",       protect, isAdmin, ctrl.remove);   // DELETE /api/addons/:id

module.exports = router;

// ── Register in app.js / server.js ───────────────────────────────────────────
// const addonRoutes = require("./routes/addon.routes");
// app.use("/api/addons", addonRoutes);