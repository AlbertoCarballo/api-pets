var express = require('express');
const connection = require('../config/db');
var router = express.Router();
const jwt=require('jsonwebtoken');

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
    if(req.body.token){
        jwt.verify(req.body.token, "asd123",(error,data) => {
            if (error) {
                console.log(error);
                res.sendStatus(403);
            }else{
                req.body.idUser=data.id_usuario;
                req.body.username=data.nombre+" "+data.primer_apellido+" "+data.segundo_apellido;
                req.body.nacimiento=data.fecha_nac;
            }
        });
        next();
    }else{
        res.sendStatus(403);
    };
};

router.post('/',obtenerUsuario , async function (req, res, next) {
    
    try {
        console.log(req.body);
        const { idUser, idPetCatalog, username, petName, petType, race, photo } = req.body;
        //          { "idUser": "1",
        // "idPetCatalog": "1", 
        // "username": "juan", 
        // "petName": "winston", 
        // "petType":"perro",
        // "race": "pastor aleman",
        // "photo": "inserte foto"
        // }
        if (!idUser || !idPetCatalog || !username || !petName || !petType || !race || !photo) {
            return res.status(400).json({ status: 400, message: "Invalid request data" });
        }
        
        const [result] = await connection.query('insert into adopciones (id_usuario,id_catalgo_mascota,nombre_usuario,nombre_mascota,tipo_mascota,raza, foto)values(?, ?, ?, ?, ?, ?, ?)', [idUser, idPetCatalog, username, petName, petType, race, photo]);
        res.status(200).json({ status: 200, message: "Item created successfully", data: { id: result.insertId, idUser, idPetCatalog, username, petName, petType, race, photo } });
        const [update]= await connection.query('UPDATE catalogoAdopciones SET estado = \'adoptado\' WHERE id_catalogo= ?',[idPetCatalog]);
        res.status(200).json({ status: 200, message: "actualizacion hecha", data: { id: update.insertId, idPetCatalog } });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message });
    }

});



module.exports = router;
