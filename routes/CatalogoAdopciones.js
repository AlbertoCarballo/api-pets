var express = require('express');
const connection = require('../config/db');
var router = express.Router();


/* GET users listing. */
router.get('/', async function (req, res, next) {
    try {
        const [rows] = await connection.query('select * from catalogoAdopciones where estado =\'en adopción\'');
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
        const { petType, petName, age, photo, race } = req.body;
        //          { "petType": "2",
        // "petName": "winston", 
        // "age": "juan", 
        // "photo": "inserte foto", 
        // "race":"pastor aleman"
        // }
        if (!petType || !petName || !age || !photo || !race ) {
            return res.status(400).json({ status: 400, message: "Invalid request data" });
        }
        const [result] = await connection.query('insert into catalogoAdopciones(tipo_mascota,nombre,edad,foto,raza)values(?, ?, ?, ?, ?)', [ petType, petName, age, photo, race ]);
        res.status(200).json({ status: 200, message: "Item created successfully", data: { id: result.insertId, petType, petName, age, photo, race  } });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message });
    }
});

module.exports = router;
