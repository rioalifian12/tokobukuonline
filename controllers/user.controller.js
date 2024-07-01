const models = require("../models");
const bcrypt = require("bcrypt");
const Validator = require("fastest-validator");
const jwt = require("jsonwebtoken");

// signup user
const signUp = async (req, res) => {
  try {
    const user = {
      nama: req.body.nama,
      email: req.body.email,
      password: req.body.password,
      alamat: req.body.alamat,
    };

    user.password = bcrypt.hashSync(user.password, 10);

    const schema = {
      nama: { type: "string", optional: false, max: "50" },
      email: { type: "string", optional: false, max: "50" },
      password: { type: "string", optional: false, max: "255" },
      alamat: { type: "string", optional: false, max: "255" },
    };

    const v = new Validator();
    const validationResponse = v.validate(user, schema);

    if (validationResponse !== true) {
      return res.status(400).json({
        message: "Validasi gagal",
        errors: validationResponse,
      });
    }

    const cekEmail = await models.User.findOne({
      where: { email: req.body.email },
    });
    if (cekEmail) {
      res.status(409).json({
        message: "Email sudah digunakan!",
      });
    } else {
      await models.User.create(user);
      res.status(201).json({
        message: "Signup berhasil!",
        data: user,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Signup gagal!",
    });
  }
};

// login user
const loginUser = async (req, res) => {
  try {
    const JWT_KEY = process.env.JWT_KEY;
    const user = await models.User.findOne({
      where: { email: req.body.email },
    });
    if (user === null) {
      res.status(401).json({
        message: "Email atau Password salah!",
      });
    } else {
      bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (result) {
          const token = jwt.sign(
            {
              id: user.id,
              nama: user.nama,
              email: user.email,
              role: user.role,
            },
            JWT_KEY,
            function (err, token) {
              res.status(200).json({
                message: "Autentikasi berhasil!",
                token: token,
              });
            }
          );
        } else {
          res.status(401).json({
            message: "Email atau Password salah!",
          });
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Login gagal!",
    });
  }
};

// get all user
const getAllUser = async (req, res) => {
  try {
    if (req.userData.role == "admin") {
      const data = await models.User.findAll();
      res.json({
        data: data,
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

// get user by id
const getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await models.User.findByPk(id);
    if (data) {
      res.status(200).json({
        data: data,
      });
    } else {
      res.status(500).json({
        message: "User tidak ditemukan!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan!",
    });
  }
};

// update user by id
const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const updateUser = {
      nama: req.body.nama,
      email: req.body.email,
      password: req.body.password,
      alamat: req.body.alamat,
      role: req.body.role,
    };

    updateUser.password = bcrypt.hashSync(updateUser.password, 10);

    const schema = {
      nama: { type: "string", optional: false, max: "50" },
      email: { type: "string", optional: false, max: "50" },
      password: { type: "string", optional: false, max: "255" },
      alamat: { type: "string", optional: false, max: "255" },
      role: { type: "string", optional: false },
    };

    const v = new Validator();
    const validationResponse = v.validate(updateUser, schema);

    if (validationResponse !== true) {
      return res.status(400).json({
        message: "Validasi gagal",
        errors: validationResponse,
      });
    }

    await models.User.update(updateUser, {
      where: { id: id },
    });
    res.status(201).json({
      message: "Update berhasil!",
      data: updateUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Update gagal!",
    });
  }
};

// delet user
const deleteUser = async (req, res) => {
  try {
    if (req.userData.role !== "admin") {
      res.status(500).json({
        message: "Hanya admin!",
      });
    } else {
      const id = req.params.id;

      await models.User.destroy({
        where: { id: id },
      });
      res.json({
        message: "Delete berhasil",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Delete gagal!",
    });
  }
};

module.exports = {
  signUp: signUp,
  loginUser: loginUser,
  getAllUser: getAllUser,
  getUserById: getUserById,
  updateUser: updateUser,
  deleteUser: deleteUser,
};
