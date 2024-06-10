var express = require('express');
const connection = require('../config/db');
var router = express.Router();


/* GET users listing. */
router.get('/', async function (req, res, next) {
    try {
        const [rows] = await connection.query('select * from mascota');
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
        const { idUser, petName, typeOfPet, age, photo, race } = req.body;
        //          { "idUser": "1",
        // "petName": "rito", 
        // "typeOfPet": "perro", 
        // "age": "4", 
        // "photo":"insertar foto",
        // "race": "french puddle"
        // }
        if (!idUser || !petName || !typeOfPet || !age || !photo || !race ) {
            return res.status(400).json({ status: 400, message: "Invalid request data" });
        }
        const [result] = await connection.query('insert into mascota (usuario_id,nombre_mascota,tipo_mascota,edad,foto,raza)values(?, ?, ?, ?, ?, ?)', [idUser, petName, typeOfPet, age, photo, race]);
        res.status(200).json({ status: 200, message: "Item created successfully", data: { id: result.insertId, idUser, petName, typeOfPet, age, photo, race } });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message });
    }
});

module.exports = router;
