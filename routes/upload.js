var express = require('express');
var fileUpload = require('express-fileupload');

var app = express();

// default options
app.use(fileUpload());


app.put('/', (req, res, next) => {

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error cargando Imagen!',
            errors: { message: 'Debe seleccionar una Imagen' }
        });

    }

    // Obtener nombre del archivo

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extencionArchivo = nombreCortado[nombreCortado.length - 1];


    // Solo estas extensiones aceptamos
    var extensionesValidas = ['jpg', 'gif', 'png', 'jpeg'];

    if (extensionesValidas.indexOf(extencionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension de Imagen no válida!',
            errors: { message: 'Las extensiones válidas son : ' + extensionesValidas.join(', ') }
        });

    }


    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizzada correctamente',
        nombreCortado: nombreCortado,
        extencionArchivo: extencionArchivo
    });

});

module.exports = app;