const models = require("../models");
const Validator = require("fastest-validator");
const { Op } = require("sequelize");

// creat buku
const addBuku = async (req, res) => {
  try {
    if (req.userData.role == "admin") {
      const buku = {
        judul: req.body.judul,
        penulis: req.body.penulis,
        genre: req.body.genre,
        jumlah: req.body.jumlah,
        harga: req.body.harga,
      };

      const schema = {
        judul: { type: "string", optional: false, max: "50" },
        penulis: { type: "string", optional: false, max: "50" },
        genre: { type: "string", optional: false, max: "15" },
        jumlah: { type: "number", optional: false },
        harga: { type: "number", optional: false },
      };

      const v = new Validator();
      const validationResponse = v.validate(buku, schema);

      if (validationResponse !== true) {
        return res.status(400).json({
          message: "Validasi gagal",
          errors: validationResponse,
        });
      }

      await models.Buku.create(buku);
      res.status(201).json({
        message: "Tambah buku berhasil!",
        data: buku,
      });
    } else {
      res.status(400).json({
        message: "Anda bukan admin!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Tambah buku gagal!",
    });
  }
};

// get all buku
const getAllBuku = async (req, res) => {
  try {
    const data = await models.Buku.findAll();
    res.json({
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan!",
    });
  }
};

// get buku by id
// const getBukuById = async (req, res) => {
//   try {
//     const id = req.params.id;

//     const data = await models.Buku.findByPk(id);
//     if (data) {
//       res.status(200).json({
//         data: data,
//       });
//     } else {
//       res.status(500).json({
//         message: "Buku tidak ditemukan!",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: "Terjadi kesalahan!",
//     });
//   }
// };

// get buku by genre or penulis
const getBukuSearch = async (req, res) => {
  try {
    const data = await models.Buku.findAll({
      where: {
        [Op.or]: [
          { genre: { [Op.like]: `%${req.query.genre}%` } },
          { penulis: { [Op.like]: `%${req.query.penulis}%` } },
        ],
      },
    });
    if (data == 0) {
      res.status(400).json({
        message: "Buku tidak ditemukan!",
      });
    } else {
      res.json({
        message: "Buku ditemukan!",
        data: data,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan!",
    });
  }
};

// update buku by id
const updateBuku = async (req, res) => {
  try {
    if (req.userData.role == "admin") {
      const id = req.params.id;
      const buku = {
        judul: req.body.judul,
        penulis: req.body.penulis,
        genre: req.body.genre,
        jumlah: req.body.jumlah,
        harga: req.body.harga,
      };

      const schema = {
        judul: { type: "string", optional: false, max: "50" },
        penulis: { type: "string", optional: false, max: "50" },
        genre: { type: "string", optional: false, max: "15" },
        jumlah: { type: "number", optional: false },
        harga: { type: "number", optional: false },
      };

      const v = new Validator();
      const validationResponse = v.validate(buku, schema);

      if (validationResponse !== true) {
        return res.status(400).json({
          message: "Validasi gagal",
          errors: validationResponse,
        });
      }

      await models.Buku.update(buku, {
        where: { id: id },
      });
      res.status(201).json({
        message: "Update buku berhasil!",
        data: buku,
      });
    } else {
      res.status(400).json({
        message: "Anda bukan admin!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Update buku gagal!",
    });
  }
};

// delet buku
const deleteBuku = async (req, res) => {
  try {
    if (req.userData.role == "admin") {
      const id = req.params.id;

      await models.Buku.destroy({
        where: { id: id },
      });
      res.json({
        message: "Delete berhasil",
      });
    } else {
      res.status(400).json({
        message: "Anda bukan admin!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Delete gagal!",
    });
  }
};

module.exports = {
  addBuku: addBuku,
  getAllBuku: getAllBuku,
  // getBukuById: getBukuById,
  getBukuSearch: getBukuSearch,
  updateBuku: updateBuku,
  deleteBuku: deleteBuku,
};
