const express = require("express");
const cartController = require("../controllers/cart.controller");
const checkAuthMiddleware = require("../middleware/check-auth");

const router = express.Router();

router.post("/", checkAuthMiddleware.checkAuth, cartController.addCart);
router.get("/", cartController.getAllCart);
router.get(
  "/:userId",
  checkAuthMiddleware.checkAuth,
  cartController.getCartByUserId
);
router.patch("/:id", checkAuthMiddleware.checkAuth, cartController.updateCart);
router.delete("/:id", checkAuthMiddleware.checkAuth, cartController.deleteCart);

module.exports = router;
