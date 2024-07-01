"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
      });
    }
  }
  DetailOrder.init(
    {
      orderId: DataTypes.INTEGER,
      bukuId: DataTypes.INTEGER,
      jumlah: DataTypes.INTEGER,
      totalHarga: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "DetailOrder",
    }
  );
  return DetailOrder;
};
