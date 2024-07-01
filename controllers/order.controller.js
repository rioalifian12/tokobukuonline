const models = require("../models");

// get all order
const getAllOrder = async (req, res) => {
  try {
    if (req.userData.role === "admin") {
      const order = await models.Order.findAll();
      res.status(200).json({
        order: order,
      });
    } else {
      res.status(400).json({
        message: "Anda bukan admin!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan!",
    });
  }
};

// // notifikasi payment midtrans
const notifOrder = async (req, res) => {
  try {
    const orderToken = req.body.orderToken;
    const statusBayar =
      req.body.transaction_status == "settlement" ? "lunas" : "belum lunas";
    const order = await models.Order.update(
      { statusBayar: statusBayar },
      {
        where: { orderToken },
      }
    );
    res.status(200).json({
      message: "Berhasil ubah status bayar!",
      transaksi: transaksi,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan!",
      error: error.message,
    });
  }
};

// get order by userId
const getOrderByUserId = async (req, res) => {
  try {
    const userId = req.userData.id;
    const requestUserId = req.params.userId;

    if (requestUserId == userId) {
      // mencari semua Order milik userId yang sedang login
      const order = await models.Order.findAll({
        where: {
          userId: userId,
        },
      });

      if (order.length > 0) {
        const orderID = order.map((order) => order.id);

        const detailOrder = await models.DetailOrder.findAll({
          where: {
            orderId: orderID,
          },
        });

        res.status(200).json({
          data: order,
          dataDetailOrder: detailOrder,
        });
      } else {
        res.status(400).json({
          message: "Order tidak ditemukan untuk user ini!",
        });
      }
    } else {
      res.status(400).json({
        message: "Tidak memiliki akses!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan saat mencari order!",
      error: error.message,
    });
  }
};

// update statusOrder
const updateOrder = async (req, res) => {
  try {
    if ((req.userData.role = "admin")) {
      const id = req.params.id;
      const updatedOrder = {
        statusBayar: req.body.statusBayar,
        statusOrder: req.body.statusOrder,
      };

      await models.Order.update(updatedOrder, {
        where: { id: id },
      });

      res.status(201).json({
        message: "Update status order berhasil!",
        data: updatedOrder,
      });
    } else {
      res.status(400).json({
        message: "Anda bukan admin!",
        error: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Update status order gagal!",
      error: error.message,
    });
  }
};

module.exports = {
  getAllOrder: getAllOrder,
  notifOrder: notifOrder,
  getOrderByUserId: getOrderByUserId,
  updateOrder: updateOrder,
};
