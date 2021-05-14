'use strict'

//conexión DB
var mongoose = require('mongoose');
var app = require('./app');
const port = 3900;

const url = 'mongodb://localhost:27017/api_rest_blog';
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);   //cosa mia
mongoose.Promise = global.Promise;

mongoose.connect(url, options).then(() => {
    console.log('La conexión a la BD está OK !! ');

    //crear servidor + escucha peticiones  HTTP
    app.listen(port, () =>{
        console.log('Servidor creado en http://localhost:'+port);
    });
})
.catch();

//Server


