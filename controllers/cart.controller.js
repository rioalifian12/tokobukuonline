const models = require("../models");

// creat cart
const addCart = async (req, res) => {
  try {
    const { body } = req;
    const bukuId = body.bukuId;
    const jumlah = body.jumlah;
    const userId = req.userData.id;
    const dataBuku = await models.Buku.findOne({
      where: { id: bukuId },
      attributes: ["id", "harga"],
    });

    if (dataBuku == null) {
      res.status(401).json({
        message: "Buku tidak ditemukan!",
      });
    }

    const totalHarga = dataBuku.harga * jumlah;

    const cart = {
      userId: userId,
      bukuId: bukuId,
      jumlah: jumlah,
      totalHarga: totalHarga,
    };

    await models.Cart.create(cart);
    res.status(201).json({
      message: "Tambah cart berhasil!",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Tambah cart gagal!",
    });
  }
};

// get all cart
const getAllCart = async (req, res) => {
  try {
    const data = await models.Cart.findAll({
      include: [
        {
          model: models.User,
          as: "user",
          attributes: ["nama"],
        },
        {
          model: models.Buku,
          as: "buku",
          attributes: ["judul", "harga"],
        },
      ],
      attributes: ["userId", "bukuId", "jumlah", "totalHarga"],
    });
    res.json({
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan!",
    });
  }
};

// get cart by userId
const getCartByUserId = async (req, res) => {
  try {
    const userId = req.userData.id;
    const requestUserId = req.params.userId;

    if (requestUserId == userId) {
      // Menggunakan model Cart untuk mencari semua cart milik userId yang sedang login
      const carts = await models.Cart.findAll({
        where: {
          userId: userId,
        },
      });

      if (carts.length > 0) {
        const jumlahTotalHarga = carts.reduce(
          (total, cart) => total + cart.totalHarga,
          0
        );

        res.status(200).json({
          jumlahTotalHarga: jumlahTotalHarga,
          data: carts,
        });
      } else {
        res.status(400).json({
          message: "Cart tidak ditemukan untuk user ini!",
        });
      }
    } else {
      res.status(400).json({
        message: "Tidak memiliki akses!",
      });
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mencari cart!",
    });
  }
};

// update buku by id
const updateCart = async (req, res) => {
  try {
    const id = req.params.id;
    const jumlahBaru = req.body.jumlah;

    if (jumlahBaru <= 0) {
      return res.status(400).json({
        message: "Jumlah tidak boleh 0!",
      });
    }

    const dataCart = await models.Cart.findOne({
      where: { id: id },
    });

    if (!dataCart) {
      return res.status(404).json({
        message: "Cart tidak ditemukan!",
      });
    }

    const hargaPerBuku = dataCart.totalHarga / dataCart.jumlah;

    var totalHargaBaru;

    if (jumlahBaru < dataCart.jumlah) {
      totalHargaBaru =
        dataCart.totalHarga - hargaPerBuku * (dataCart.jumlah - jumlahBaru);
    } else {
      totalHargaBaru =
        dataCart.totalHarga + hargaPerBuku * (jumlahBaru - dataCart.jumlah);
    }

    const updateCart = {
      userId: dataCart.userId,
      bukuId: dataCart.bukuId,
      jumlah: jumlahBaru,
      totalHarga: totalHargaBaru,
    };

    await models.Cart.update(updateCart, {
      where: { id: id },
    });

    res.status(201).json({
      message: "Update cart berhasil!",
      data: updateCart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Update cart gagal!",
      error: error.message,
    });
  }
};

// delete Cart
const deleteCart = async (req, res) => {
  try {
    const id = req.params.id;

    await models.Cart.destroy({
      where: { id: id },
    });
    res.json({
      message: "Delete berhasil",
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete gagal!",
    });
  }
};

module.exports = {
  addCart: addCart,
  getAllCart: getAllCart,
  getCartByUserId: getCartByUserId,
  updateCart: updateCart,
  deleteCart: deleteCart,
};
