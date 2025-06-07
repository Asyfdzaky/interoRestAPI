const express = require("express");
const router = express.Router();
const controller = require("../controller/APIController");

router.get("/", controller.getAll);
router.get("/filter", controller.filterByBentukPendidikan);
router.get("/:npsn", controller.getOne);
router.post("/", controller.create);
router.put("/:npsn", controller.update);
router.delete("/:npsn", controller.delete);
router.get("/search", controller.searchByNamaOrNPSN);

const authController = require("../controllers/authController");

router.post("/admin/register", authController.register);
router.post("/admin/login", authController.login);

module.exports = router;
