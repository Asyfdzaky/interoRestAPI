const express = require("express");
const router = express.Router();
const controller = require("../controller/APIController");

router.get("/", controller.getAll);
router.get("/:npsn", controller.getOne);
router.post("/", controller.create);
router.put("/:npsn", controller.update);
router.delete("/:npsn", controller.delete);
router.get("/filter", controller.filterByJenjang);
module.exports = router;
