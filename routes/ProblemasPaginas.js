var express = require('express');
const connection = require('../config/db');
var router = express.Router();


/* GET users listing. */
router.get('/', async function (req, res, next) {
    try {
        const [rows] = await connection.query('select * from incidenciasConAplicacion');
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
        const { idUser, username, dod, description } = req.body;
        //          { "idUser": "1",
        // "username": "asd", 
        // "dod": "2024-06-15", 
        // "description": "juan"
        // }
        if (!idUser || !username || !dod || !description) {
            return res.status(400).json({ status: 400, message: "Invalid request data" });
        }
        const [result] = await connection.query('insert into incidenciasConAplicacion (id_usuario,nombre_usuario,fecha_hora,descripcion) values(?, ?, ?, ?)', [idUser, username, dod, description]);
        res.status(200).json({ status: 200, message: "Item created successfully", data: { id: result.insertId, idUser, username, dod, description } });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message });
    }
});

module.exports = router;
