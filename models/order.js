"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Order.init(
    {
      orderToken: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      totalHarga: DataTypes.INTEGER,
      statusBayar: DataTypes.ENUM("belum lunas", "lunas"),
      statusOrder: DataTypes.ENUM("proses", "selesai", "gagal"),
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
