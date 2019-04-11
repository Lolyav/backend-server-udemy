var express = require('express');

var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
// var SEED = require('../config/config').SEED;
var mdAutentificacion = require('../middlwares/autentificacion');

var app = express();
//=============================
//Obtener todos los usuarios
//=================================

app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuario!',
                        errors: err
                    });

                }
                res.status(200).json({
                    ok: true,
                    usuarios
                });


            });


});


//=============================
// Actualizar usuario
//=================================

app.put('/:id', mdAutentificacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;


    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscando usuario!',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Error el usuario! con el ' + id + 'no existe',
                errors: { message: 'No existe el usuario con ese id' }
            });

        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario!',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });



    });



});






//=============================
//Nuevo usuario
//=================================

app.post('/', mdAutentificacion.verificaToken, (req, res) => {

    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando usuario!',
                errors: err
            });

        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoke: req.usuario
        });


    });





});

// ============================================
//   Borrar un usuario por el id
// ============================================

app.delete('/:id', mdAutentificacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrado usuario!',
                errors: err
            });

        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No hay usuario con ese id!',
                errors: { message: 'No hay usuario con ese id!' }
            });

        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });





    });





});

module.exports = app;