const express = require("express");
const orderController = require("../controllers/order.controller");
const orderPostController = require("../controllers/order_post.controller");
const checkAuthMiddleware = require("../middleware/check-auth");

const router = express.Router();

router.post("/", checkAuthMiddleware.checkAuth, orderPostController.addOrder);
router.get("/", checkAuthMiddleware.checkAuth, orderController.getAllOrder);
router.post(
  "/:orderToken",
  checkAuthMiddleware.checkAuth,
  orderController.notifOrder
);
router.get(
  "/:userId",
  checkAuthMiddleware.checkAuth,
  orderController.getOrderByUserId
);
router.patch(
  "/:id",
  checkAuthMiddleware.checkAuth,
  orderController.updateOrder
);

module.exports = router;
