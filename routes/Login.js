var express = require('express');
const connection = require('../config/db');
var router = express.Router();
const jwt=require('jsonwebtoken');


/* GET users listing. */
router.get('/', async function (req, res, next) {
    try {
        const [rows] = await connection.query('select * from usuario');
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
        const { email, password } = req.body;
        // var persona = { name: 'alberto', firstName: 'carballo', lastName: 'caballero', dob: '2002-06-15', email: 'theonlyoneddx@gmail.com',
        // password: 'xd', phone: '6121445794' }; juan.perez@example.com password123
        if (!email || !password) {
            return res.status(400).json({ status: 400, message: "Invalid request data" });
        }
        const [result] = await connection.query('select * from usuario where correo_electronico = ?', [email]);
        // console.log(result);
        if (result[0]){
            if (result[0].password === password) {
              //  res.status(200).json({ status: 200, message: "user logged succesfully", data: result[0] });
                jwt.sign(result[0],"asd123",(error,token) => {
                    res.status(200).json({ status: 200, message: "user logged succesfully", token });
                });
        }else{
            res.status(401).json({ status: 401, message: "incorrect password" });
        }
    }
            
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message });
    }
});

module.exports = router;
