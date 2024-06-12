var express = require('express');
const connection = require('../config/db');
var router = express.Router();
const jwt = require('jsonwebtoken');

function obtenerUsuario(req, res, next) {
    //console.log("este es el token: ", req.headers.token)
    try {
        if (req.body.token) {
            jwt.verify(req.body.token, "asd123", (error, data) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(403);
                } else {
                    // console.log(req.body.token);
                    req.body.idUser = data.id_usuario;
                    req.body.username = data.nombre + " " + data.primer_apellido + " " + data.segundo_apellido;
                }
            });
            next();
        } else if (req.headers.token) {
            console.log("aqui");
            jwt.verify(req.headers.token, "asd123", (error, data) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(403);
                } else {
                    console.log("aqui x2", data.id_usuario);
                    req.body = { idUser: data.id_usuario };
                    console.log(req.body);
                }
            });
            next();
        } else {
            res.sendStatus(403);
        };
    } catch (error) {
        console.log(error);
    }

};

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

router.post('/', obtenerUsuario, async function (req, res, next) {
    try {
        const { idUser, username } = req.body
        const { petType, petName, age, photo, race } = req.body.form;
        //          { "petType": "2",
        // "petName": "winston", 
        // "age": "juan", 
        // "photo": "inserte foto", 
        // "race":"pastor aleman"
        // }

        console.log(req.body);
        if (!petType || !petName || !age || !photo || !race) {
            return res.status(400).json({ status: 400, message: "Invalid request data" });
        }
        const [result] = await connection.query('insert into catalogoAdopciones(tipo_mascota,nombre,edad,foto,raza)values(?, ?, ?, ?, ?)', [petType, petName, age, photo, race]);
        const [result2] = await connection.query('insert into reporteAdopciones (id_usuario,nombre_usuario,tipo_mascota,nombre,edad,raza) values (?, ?, ?, ?, ?, ?)', [idUser, username, petType, petName, age, race]);
        res.status(200).json({ status: 200, message: "Item created successfully", data: { id: result.insertId, petType, petName, age, photo, race } });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message });
    }
});

module.exports = router;
