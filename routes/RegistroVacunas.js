var express = require('express');
const connection = require('../config/db');
var router = express.Router();


/* GET users listing. */
router.get('/', async function (req, res, next) {
    try {
        const [rows] = await connection.query('select * from vacunaMascota');
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
        const { vaccine, idPets, idUser, username, petname, doa, branch } = req.body;
        //          { "vaccine": "1",
        // "idPets": "2", 
        // "idUser": "2", 
        // "username": "juan", 
        // "petname":"rito",
        // "doa": "2024-05-30", 
        // "branch": "indeco"
        // }
        if (!vaccine || !idPets || !idUser || !username || !petname || !doa || !branch) {
            return res.status(400).json({ status: 400, message: "Invalid request data" });
        }
        const [result] = await connection.query('insert into vacunaMascota (vacuna,mascota_id,usuario_id,nombre_usuario,nombre_mascota,fecha_cuando_se_vacuno,sucursal) values(?, ?, ?, ?, ?, ?, ?)', [vaccine, idPets, idUser, username, petname, doa, branch]);
        res.status(200).json({ status: 200, message: "Item created successfully", data: { id: result.insertId, vaccine, idPets, idUser, username, petname, doa, branch } });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message });
    }
});

module.exports = router;
