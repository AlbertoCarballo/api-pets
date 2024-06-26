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
router.get('/',  async function (req, res, next) {
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

router.post('/', obtenerUsuario, async function (req, res, next) {
    try {
        const {idUser, username} =req.body;
        const {description } = req.body.form;
        //          { "idUser": "1",
        // "username": "asd", 
        // "dod": "2024-06-15", 
        // "description": "juan"
        // }
        console.log(req.body);
        if (!idUser || !username ||  !description) {
            return res.status(400).json({ status: 400, message: "Invalid request data" });
        }
        const [result] = await connection.query('insert into incidenciasConAplicacion (id_usuario,nombre_usuario,descripcion) values(?, ?, ?)', [idUser, username, description]);
        res.status(200).json({ status: 200, message: "Item created successfully", data: { id: result.insertId, idUser, username, description } });
    } catch (err) {
        console.log("hola", err);
        res.status(500).json({ status: 500, message: err.message });
    }
});

module.exports = router;
