var express = require('express');
const connection = require('../config/db');
var router = express.Router();
const jwt = require('jsonwebtoken');

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

function obtenerUsuario(req, res, next) {
    if (req.body.token) {
        jwt.verify(req.body.token, "asd123", (error, data) => {
            if (error) {
                console.log(error);
                res.sendStatus(403);
            } else {
                req.body.idUser = data.id_usuario;
                req.body.username = data.nombre + " " + data.primer_apellido + " " + data.segundo_apellido;
            }
        });
        next();
    } else {
        res.sendStatus(403);
    };
};

router.post('/', obtenerUsuario, async function (req, res, next) {
    try {
        const { idUser, username } = req.body;
        const { petType, breed, description, gender, doa } = req.body.form;
        //          { "idUser": "1",
        // "username": "Roberto", 
        // "petType": "perro", 
        // "breed": "french puddle", 
        // "description":"mi vecino maltrata a su perro",
        // "gender": "macho", 
        // "doa": "2024-05-30"
        // }
        console.log(req.body);
        if (!idUser || !username || !petType || !breed || !description || !gender || !doa) {
            return res.status(400).json({ status: 400, message: "Invalid request data" });
        }
        console.log("holi");
        const [result] = await connection.query('insert into reporteMaltrato (id_usuario,nombre_usuario,tipo_mascota,raza,descripcion,genero,fecha_maltrato) values (?, ?, ?, ?, ?, ?, ?)', [idUser, username, petType, breed, description, gender, doa]);
        res.status(200).json({ status: 200, message: "Item created successfully", data: { id: result.insertId, idUser, username, petType, breed, description, gender, doa } });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message });
    }
});

module.exports = router;
