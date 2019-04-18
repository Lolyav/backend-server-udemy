var express = require('express');

var Hospital = require('../models/hospital');
var app = express();
var mdAutentificacion = require('../middlwares/autentificacion');

//=============================
//Obtener todos los hospitales
//=================================

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospitales!',
                        errors: err
                    });

                }
                Hospital.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });


                })

            });


});


//=============================
// Actualizar usuario
//=================================

app.put('/:id', mdAutentificacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;


    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscando hospital!',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Error el hospital! con el ' + id + 'no existe',
                errors: { message: 'No existe el hospital con ese id' }
            });

        }

        hospital.nombre = body.nombre;
        // hospital.img = body.img;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital!',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    });

});

//=============================
//Nuevo hospital
//=================================

app.post('/', mdAutentificacion.verificaToken, (req, res) => {

    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando hospital!',
                errors: err
            });

        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
        });


    });

});
// ============================================
//   Borrar un hospital por el id
// ============================================

app.delete('/:id', mdAutentificacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrado hospital!',
                errors: err
            });

        }
        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No hay hospital con ese id!',
                errors: { message: 'No hay hospital con ese id!' }
            });

        }
        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });





    });





});


module.exports = app;