const express = require("express");
const router = express.Router();
const controller = require("../controller/APIController");
const authController = require("../controller/AuthController");

// ⬇Import middleware
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

// Auth routes
router.post("/admin/register", authController.register);
router.post("/admin/login", authController.login);

// Public route
router.get("/", controller.getAll);
router.get("/filter", controller.filterByBentukPendidikan);
router.get("/:npsn", controller.getOne);
router.get("/search", controller.searchByNamaOrNPSN);

// Protected routes (admin only)
router.post("/", authenticateToken, authorizeAdmin, controller.create);
router.put("/:npsn", authenticateToken, authorizeAdmin, controller.update);
router.delete("/:npsn", authenticateToken, authorizeAdmin, controller.delete);

module.exports = router;
