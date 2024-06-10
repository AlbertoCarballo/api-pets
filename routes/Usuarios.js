var express = require('express');
const connection = require('../config/db');
var router = express.Router();


/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    const [rows] = await connection.query('select * from usuario');
    if (rows.length === 0) {
      return res.status(204).json({ status: 204, message: "No Users found" });
    }
    res.status(200).json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }

});

router.post('/', async function (req, res, next) {
  try {
    const { name, firstName, lastName, dob, email, password, phone } = req.body;
    // var persona = { name: 'alberto', firstName: 'carballo', lastName: 'caballero', dob: '2024-06-15', email: 'theonlyoneddx@gmail.com',
    // password: 'xd', phone: '6121445794' };
    if (!name || !firstName || !lastName || !dob || !email || !password || !phone) {
      return res.status(400).json({ status: 400, message: "Invalid request data" });
    }
    const [result] = await connection.query('INSERT INTO usuario (nombre, primer_apellido, segundo_apellido, fecha_nac, correo_electronico, password, numero_telefono) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, firstName, lastName, dob, email, password, phone]);
    res.status(200).json({ status: 200, message: "Item created successfully", data: { id: result.insertId, name, firstName, lastName, dob, email, password, phone } });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
});

module.exports = router;
