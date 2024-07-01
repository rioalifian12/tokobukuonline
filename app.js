require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");

const app = express();

app.use(bodyParser.json());
app.use(express.json());

const userRoute = require("./routes/user");
const bukuRoute = require("./routes/buku");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

app.use("/user", userRoute);
app.use("/buku", bukuRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async function () {
  try {
    await sequelize.authenticate();
    console.log(`Berjalan di port ${PORT}`);
  } catch (error) {
    console.error("Gagal terhubung: ke DB", error);
  }
});
