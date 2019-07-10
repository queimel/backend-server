var express = require("express");
var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var Usuario = require("../models/usuario");

var SEED = require('../config/config').SEED;


app.post('/', (req, res) => {

    var body =  req.body;

    // busca en BD usuario con email del body
    Usuario.findOne( { email: body.email }, (err, usuarioDB) => {
        // si sucede error en el sistema
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario",
                errors: err
            });
        }

        // si no existe usuario en bd
        if ( !usuarioDB ) {
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectas - email",
                errors: err
            });
        }

        // todo ok con el correo
        // compara pass del body contra la pass de la bd
        if( !bcrypt.compareSync( body.password, usuarioDB.password) ){
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectas - password",
                errors: err
            });
        }

        // crear un token !!
        usuarioDB.password = ':)';
        var token = jwt.sign({usuario: usuarioDB}, SEED,  { expiresIn: 14400} );


        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            body: body,
            token: token,
            id: usuarioDB.id
        });

    })


});

module.exports = app;