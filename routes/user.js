const express = require("express");
const userController = require("../controllers/user.controller");
const checkAuthMiddleware = require("../middleware/check-auth");

const router = express.Router();

router.post("/signup", userController.signUp);
router.post("/login", userController.loginUser);
router.get("/", checkAuthMiddleware.checkAuth, userController.getAllUser);
router.get("/:id", checkAuthMiddleware.checkAuth, userController.getUserById);
router.patch("/:id", checkAuthMiddleware.checkAuth, userController.updateUser);
router.delete("/:id", checkAuthMiddleware.checkAuth, userController.deleteUser);

module.exports = router;
