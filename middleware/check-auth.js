const jwt = require("jsonwebtoken");
const models = require("../models");

async function checkAuth(req, res, next) {
  try {
    const JWT_KEY = process.env.JWT_KEY;

    // Cek apakah header Authorization ada
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Authorization header missing!",
      });
    }

    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, JWT_KEY);

    if (!decodedToken) {
      return res.status(401).json({
        message: "User not found!",
      });
    }

    req.userData = decodedToken;
    next();
  } catch (error) {
    const messageError = error?.message
      ? error.message
      : "Token invalid atau expired!";
    return res.status(401).json({
      message: messageError,
    });
  }
}

module.exports = {
  checkAuth: checkAuth,
};
