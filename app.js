// requires

var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();

// Conexion a la base de datos

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {

    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'Online');

});


// Rutas

app.get('/', (req, res, next) => {

    res.status(404).json({
        ok: true,
        mensaje: 'Peticion realizzada correctamente'
    });

});



// Escuchar peyiciones

app.listen(3000, () => {

    console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'Online');
});