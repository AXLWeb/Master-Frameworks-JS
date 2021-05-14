'use strict';

//Carga módulos Node para crear servidor
var express = require('express');

//Ejecutar express (http)
var app = express();

//cargar ficheros rutas 
let article_routes = require('./routes/article');

// Middlewares 
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

//CORS enabler
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//PREfijos rutas / cargar rutas
app.use('/api', article_routes);


//exportar modulo (this.file)
module.exports = app;
