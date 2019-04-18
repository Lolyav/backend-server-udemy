var express = require('express');

var Medico = require('../models/medico');
var app = express();
var mdAutentificacion = require('../middlwares/autentificacion');

//=============================
//Obtener todos los Medicoes
//=================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .skip(desde)
        .limit(5)
        .exec(
            (err, medicos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos!',
                        errors: err
                    });

                }
                Medico.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });

                });


            });


});


//=============================
// Actualizar usuario
//=================================

app.put('/:id', mdAutentificacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;


    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscando medico!',
                errors: err
            });
        }
        if (!medico) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Error el medico! con el ' + id + 'no existe',
                errors: { message: 'No existe el medico con ese id' }
            });

        }

        medico.nombre = body.nombre;
        // medico.img = body.img;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico!',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });

});

//=============================
//Nuevo medico
//=================================

app.post('/', mdAutentificacion.verificaToken, (req, res) => {

    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando medico!',
                errors: err
            });

        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
        });


    });

});
// ============================================
//   Borrar un Medico por el id
// ============================================

app.delete('/:id', mdAutentificacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrado medico!',
                errors: err
            });

        }
        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No hay medico con ese id!',
                errors: { message: 'No hay medico con ese id!' }
            });

        }
        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });





    });





});


module.exports = app;