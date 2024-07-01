const express = require("express");
const bukuController = require("../controllers/buku.controller");
const checkAuthMiddleware = require("../middleware/check-auth");

const router = express.Router();

router.post("/", checkAuthMiddleware.checkAuth, bukuController.addBuku);
router.get("/", bukuController.getAllBuku);
// router.get("/:id", bukuController.getBukuById);
router.get("/search/", bukuController.getBukuSearch);
router.patch("/:id", checkAuthMiddleware.checkAuth, bukuController.updateBuku);
router.delete("/:id", checkAuthMiddleware.checkAuth, bukuController.deleteBuku);

module.exports = router;
