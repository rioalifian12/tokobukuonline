"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Buku extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Buku.init(
    {
      judul: DataTypes.STRING,
      penulis: DataTypes.STRING,
      genre: DataTypes.STRING,
      jumlah: DataTypes.INTEGER,
      harga: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Buku",
    }
  );
  return Buku;
};
