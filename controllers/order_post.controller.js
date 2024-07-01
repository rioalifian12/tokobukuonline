require("dotenv").config();
const db = require("../models");
const models = require("../models");

const midtransClient = require("midtrans-client");

// creat order
let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const addOrder = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const dataCart = await models.Cart.findAll({
      where: { userId: req.userData.id },
      attributes: ["bukuId", "jumlah", "totalHarga"],
    });

    if (dataCart.length === 0) {
      const { body } = req;
      const bukuId = body.bukuId;
      const dataBuku = await models.Buku.findOne({
        where: { id: bukuId },
        attributes: ["id", "harga"],
      });
      if (body) {
        const userId = req.userData.id;
        const bukuId = req.body.bukuId;
        const jumlah = req.body.jumlah;
        const hargaPerBuku = dataBuku.harga;

        const totalHarga = hargaPerBuku * jumlah;

        const dataOrder = {
          userId: userId,
          totalHarga: totalHarga,
        };

        const t = await db.sequelize.transaction();

        const createOrder = await models.Order.create(dataOrder, {
          transaction: t,
        });

        const orderID = createOrder.id;

        const dataCreateDetailOrder = {
          orderId: orderID,
          bukuId: bukuId,
          jumlah: jumlah,
          totalHarga: hargaPerBuku,
        };

        // Mengurangi jumlah stok buku
        const buku = await models.Buku.findOne({
          where: { id: bukuId },
          transaction: t,
        });

        if (!buku) {
          throw new Error("Buku tidak ditemukan");
        }

        if (buku.jumlah < jumlah) {
          throw new Error("Stok buku tidak mencukupi");
        }

        buku.jumlah -= jumlah;
        await buku.save({ transaction: t });

        // Membuat detail order
        const createDetailOrder = await models.DetailOrder.create(
          dataCreateDetailOrder,
          {
            transaction: t,
          }
        );

        // generate orderToken
        const orderToken = `ORDER-${orderID}`;
        createOrder.orderToken = orderToken;
        await createOrder.save({ transaction: t });

        // Midtrans
        const parameterMidtrans = {
          transaction_details: {
            order_id: orderToken,
            gross_amount: totalHarga,
          },
          credit_card: {
            secure: true,
          },
          customer_details: {
            first_name: req.userData.nama,
            email: req.userData.email,
          },
        };

        const sendMidtrans = await snap.createTransaction(parameterMidtrans);
        const midtransToken = sendMidtrans.token;
        const fullMidtransUrl =
          process.env.MIDTRANS_URL_SANDBOX + midtransToken;
        createOrder.token = midtransToken;
        await createOrder.save({ transaction: t });

        // Commit transaksi
        await t.commit();

        const order = await models.Order.findOne({
          where: { id: orderID },
        });

        res.status(201).json({
          message: "Tambah order berhasil!",
          order: order,
          dataDetailOrder: createDetailOrder,
          midtransUrl: fullMidtransUrl,
        });
      } else {
        return res.status(404).json({
          message: "request body tidak boleh kosong!",
        });
      }
    } else {
      const userId = req.userData.id;
      const totalHarga = dataCart.reduce(
        (acc, cartItem) => acc + cartItem.totalHarga,
        0
      );

      const dataOrder = {
        userId: userId,
        totalHarga: totalHarga,
      };

      const t = await db.sequelize.transaction();

      // Buat order terlebih dahulu
      const createOrder = await models.Order.create(dataOrder, {
        transaction: t,
      });
      const orderID = createOrder.id;

      const dataDetailOrder = await Promise.all(
        dataCart.map(async (item) => {
          const dataCreateDetailOrder = {
            orderId: orderID,
            bukuId: item.bukuId,
            jumlah: item.jumlah,
            totalHarga: item.totalHarga,
          };
          const createDetailOrder = await models.DetailOrder.create(
            dataCreateDetailOrder,
            { transaction: t }
          );
          // Mengurangi jumlah stok buku
          const buku = await models.Buku.findOne({
            where: { id: dataCreateDetailOrder.bukuId },
            transaction: t,
          });

          if (!buku) {
            return res.status(500).json({
              message: "Buku tidak ditemukan!",
            });
          }

          if (buku.jumlah < dataCreateDetailOrder.jumlah) {
            return res.status(500).json({
              message: "Stok buku tidak mencukupi!",
            });
          }

          buku.jumlah -= dataCreateDetailOrder.jumlah;
          await buku.save({ transaction: t });
          return {
            detail_order: {
              ...createDetailOrder.dataValues,
            },
          };
        })
      );

      // Hapus semua item dari cart setelah order dibuat
      await models.Cart.destroy({
        where: { userId: userId },
        transaction: t,
      });

      // generate orderToken
      const orderToken = `ORDER-${orderID}`;
      createOrder.orderToken = orderToken;
      await createOrder.save({ transaction: t });

      // Midtrans
      const parameterMidtrans = {
        transaction_details: {
          order_id: orderToken,
          gross_amount: totalHarga,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: req.userData.nama,
          email: req.userData.email,
        },
      };

      const sendMidtrans = await snap.createTransaction(parameterMidtrans);
      const midtransToken = sendMidtrans.token;
      const fullMidtransUrl = process.env.MIDTRANS_URL_SANDBOX + midtransToken;
      createOrder.token = midtransToken;
      await createOrder.save({ transaction: t });

      // save to db
      await t.commit();

      const order = await models.Order.findAll({
        where: { id: orderID },
      });

      res.status(201).json({
        message: "Tambah order berhasil!",
        order: order,
        dataDetailOrder: dataDetailOrder,
        midtransUrl: fullMidtransUrl,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan!",
      error: error?.message ? error.message : "ERROR_",
    });
  }
};

module.exports = {
  addOrder: addOrder,
};
