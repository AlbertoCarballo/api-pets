var express = require('express');
const connection = require('../config/db');
var router = express.Router();
const jwt = require('jsonwebtoken');


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


function obtenerUsuario(req, res, next) {
    console.log("este es el token: ", req.body.token)
    if (req.body.token) {
        jwt.verify(req.body.token, "asd123", (error, data) => {
            if (error) {
                console.log(error);
                res.sendStatus(403);
            } else {
                console.log(req.body.token);
                req.body.idUser = data.id_usuario;
            }
        });
        next();
    } else {
        res.sendStatus(403);
    };
};

router.post('/', obtenerUsuario, async function (req, res, next) {
    try {
        const { idUser } = req.body;
        const { name, image, age, breed, description, gender, size, lastSeen, dateMissing } = req.body.form;
        console.log(req.body);
        //          { "idUser": "1", 
        // "petname": "mango", 
        // "photo": "herradura", 
        // "age":"barriles",
        // "breed": "2024-05-30", 
        // "description": "gato naranja, odioso",
        // "gender": "male",
        // "size": "grande",
        // "lastSeen" : "en la colonia altamirano ",
        // "dateMissing": "2024-06-10"
        // }
        console.log("holis");
        if (!idUser || !name || !image || !age || !breed || !description || !gender || !size || !lastSeen || !dateMissing) {
            return res.status(400).json({ status: 400, message: "Invalid request data" });
        }

        console.log("ADIOS")
        const [result] = await connection.query('insert into reporteDesaparicion(id_usuario,nombre,foto,edad,raza,descripcion,genero,size,visto_utlima_vez,fecha_extravio)values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [idUser, name, image, age, breed, description, gender, size, lastSeen, dateMissing]);
        res.status(200).json({ status: 200, message: "Item created successfully", data: { id: result.insertId, idUser, name, image, age, breed, description, gender, size, lastSeen, dateMissing } });
    } catch (err) {
        console.log("error ", err);
        res.status(500).json({ status: 500, message: err.message });
    }
});

module.exports = router;
