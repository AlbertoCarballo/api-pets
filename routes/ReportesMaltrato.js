var express = require('express');
const connection = require('../config/db');
var router = express.Router();


/* GET users listing. */
router.get('/', async function (req, res, next) {
    try {
        const [rows] = await connection.query('select * from reporteMaltrato');
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
        const { idUser, username, petType, breed, description, gender, doa } = req.body;
        //          { "idUser": "1",
        // "username": "Roberto", 
        // "petType": "perro", 
        // "breed": "french puddle", 
        // "description":"mi vecino maltrata a su perro",
        // "gender": "macho", 
        // "doa": "2024-05-30"
        // }
        if (!idUser || !username || !petType || !breed || !description || !gender || !doa) {
            return res.status(400).json({ status: 400, message: "Invalid request data" });
        }
        const [result] = await connection.query('insert into reporteMaltrato (id_usuario,nombre_usuario,tipo_mascota,raza,descripcion,genero,fecha_maltrato) values (?, ?, ?, ?, ?, ?, ?)', [idUser, username, petType, breed, description, gender, doa ]);
        res.status(200).json({ status: 200, message: "Item created successfully", data: { id: result.insertId, idUser, username, petType, breed, description, gender, doa  } });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message });
    }
});

module.exports = router;
