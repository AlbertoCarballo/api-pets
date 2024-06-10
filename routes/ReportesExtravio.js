var express = require('express');
const connection = require('../config/db');
var router = express.Router();


/* GET users listing. */
router.get('/', async function (req, res, next) {
    try {
        const [rows] = await connection.query('select * from reporteDesaparicion');
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
        const { idUser, petname, photo, age, breed, description, gender, size, lastSeen, dateMissing, dateFound } = req.body;
        //          { "code": "READ1",
        // "idUser": "1", 
        // "reportName": "adopcion", 
        // "mainStreet": "herradura", 
        // "secondaryStreet":"barriles",
        // "dor": "2024-05-30", 
        // "description": "gato naranja, odioso"
        // }
        if (!idUser || !petname || !photo || !age || !breed || !description || !gender|| !size || !lastSeen || !dateMissing || !dateFound) {
            return res.status(400).json({ status: 400, message: "Invalid request data" });
        }
        const [result] = await connection.query('insert into reporteDesaparicion(id_usuario,nombre,foto,edad,raza,descripcion,genero,size,visto_utlima_vez,fecha_extravio)valuesvalues(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [idUser, petname, photo, age, breed, description, gender, size, lastSeen, dateMissing, dateFound]);
        res.status(200).json({ status: 200, message: "Item created successfully", data: { id: result.insertId, idUser, petname, photo, age, breed, description, gender, size, lastSeen, dateMissing, dateFound } });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message });
    }
});

module.exports = router;
