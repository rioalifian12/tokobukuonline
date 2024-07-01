"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
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
      this.belongsTo(models.Buku, {
        foreignKey: "bukuId",
        as: "buku",
      });
    }
  }
  Cart.init(
    {
      userId: DataTypes.INTEGER,
      bukuId: DataTypes.INTEGER,
      jumlah: DataTypes.INTEGER,
      totalHarga: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Cart",
    }
  );
  return Cart;
};
