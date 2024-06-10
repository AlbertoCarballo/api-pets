var express = require('express');
const connection = require('../config/db');
var router = express.Router();
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', async function (req, res, next) {
    try {
        const [rows] = await connection.query('select * from adopciones');
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
                console.log(req.body.token);
                req.body.idUser = data.id_usuario;
                req.body.username = data.nombre + " " + data.primer_apellido + " " + data.segundo_apellido;
                req.body.dob = data.fecha_nac;
                req.body.cellphone = data.numero_telefono;
                req.body.role = data.rol;
                req.body.email = data.correo_electronico;
            }
        });
        next();
    } else {
        res.sendStatus(403);
    };
};

router.post('/', obtenerUsuario, async function (req, res, next) {

    try {
        console.log(req.body);
        const { idUser, username, dob, cellphone, role, email } = req.body;
        //          { "idUser": "1",
        // "idPetCatalog": "1", 
        // "username": "juan", 
        // "petName": "winston", 
        // "petType":"perro",
        // "race": "pastor aleman",
        // "photo": "inserte foto"
        // }
        if (!username || !dob || !idUser || !cellphone || !role || !email) {

            return res.status(400).json({ status: 400, message: "Invalid request data" });
        }
        const [result] = await connection.query("select * from usuario where  id_usuario = ?", [idUser])

        console.log("holis " + result);
        res.status(200).json({ status: 200, message: "Item created successfully", id_usuario: idUser, username, dob, cellphone, role,email });

    } catch (err) {
        res.status(500).json({ status: 500, message: err.message });
    }

});



module.exports = router;
