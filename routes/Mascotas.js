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
router.get('/', obtenerUsuario, async function (req, res, next) {
    try {
        const { idUser } = req.body;
        const [rows] = await connection.query('select * from mascota where usuario_id=?', [idUser]);
        if (rows.length === 0) {
            return res.status(204).json({ status: 204, message: "No Users found" });
        }
        res.status(200).json({ status: 200, data: rows });
    } catch (err) {
        console.log("aqui toy", err);
        res.status(500).json({ status: 500, message: err.message });
    }

});

router.post('/',obtenerUsuario, async function (req, res, next) {
    try {
        const { idUser } = req.body;
        const { petName, typeOfPet, age, photo, breed } = req.body.form;
        console.log(req.body);
        //          { "idUser": "1",
        // "petName": "rito", 
        // "typeOfPet": "perro", 
        // "age": "4", 
        // "photo":"insertar foto",
        // "race": "french puddle"
        // }
        if (!idUser || !petName || !typeOfPet || !age || !photo || !breed) {
            return res.status(400).json({ status: 400, message: "Invalid request data" });
        }
        console.log("sali");
        const [result] = await connection.query('insert into mascota (usuario_id,nombre_mascota,tipo_mascota,edad,foto,raza)values(?, ?, ?, ?, ?, ?)', [idUser, petName, typeOfPet, age, photo, breed]);
        res.status(200).json({ status: 200, message: "Item created successfully", data: { id: result.insertId, idUser, petName, typeOfPet, age, photo, breed } });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message });
    }
});

module.exports = router;
