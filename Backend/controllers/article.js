'use strict'

const { default: validator } = require('validator');
let validar = require('validator');
let Article = require('../models/article');
let fs = require('fs');
let path = require('path');

let controller = {
    datosCurso: (req, res) => {
        var hola = req.body.hola;

        return res.status(200).send({
            curso: 'Master en Frameworks JS',
            autor: 'AXLWeb',
            hola
        });
    },

    test: (req, res) => {
        
        return res.status(200).send({
            message: 'Acción test de mi controlador de artículos'
        });
    },

    save: (req, res) => {

        //recoge param POST
        let params = req.body;

        //validar datos (validator)
        try{
            var validateTitle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);

        }catch(err){
            return res.status(400).send({
                status: 'error',
                message: 'Faltan datos por enviar !!'
            });
        }

        if(validateContent && validateTitle){

            //Crear el obj a guardar
            let article = new Article();

            //Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image =  null;

            //Guarda articulo
            article.save((err, articleStored) => {
                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'Artículo no guardado'
                    });
                }

                //Respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });

            });


            //Devolver respuesta
            return res.status(200).send({
                status: 'success',
                message: 'Validación correcta',
                article
            });
        }else{
            return res.status(400).send({
                status: 'error',
                message: 'Datos no válidos!'
            });
        }
        
        // Devuelve respuesta        
        return res.status(200).send({
            article: params
        });
    },

    getArticles: (req, res) => {

        //recoge params
        const params = req.params;
        const lastN = params.lastN;
        var query = Article.find();
        
        //Últimos n artículos
        if(lastN){
            query.limit(parseInt(lastN));
        }

        //Sort "-" => orden DESC
        query.sort('-_id').exec((err, articles) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos'
                });
            }

            if(articles.length === 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos en la BD'
                });
            }

            return res.status(200).send({
                status: 'succes',
                articles
            });
        });
    },
    
    getSingleArticle: (req, res) => {

        const articleId = req.params.id;

        if(!articleId){
            return res.status(404).send({
                status: 'No existe articulo',
            });
        }

        Article.findById(articleId, (err, article) =>{

            if(err || !article){
                return res.status(404).send({
                    status: 'Error',
                    message: 'No existe el articulo: ' + articleId,
                });
            }

            return res.status(200).send({
                status: 'succes',
                message: 'tomaya!',
                article
            });


        });

    },

    updateArticle: (req, res) => {
        const articleId = req.params.id;
        let params = req.body;

        try{
            var validateTitle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(404).send({
                status: 'Error al buscar el articulo: '+articleId,
                message: err
            });
        }

        if(validateTitle && validateContent){
            Article.findOneAndUpdate({_id: articleId}, params, {new: true}, (err, articleUpdated) =>{

                if(err || !articleUpdated){
                    return res.status(500).send({
                        status: 'Error',
                        message: 'Error al actualizar el articulo: ' + articleId,
                    });
                }

                if(!articleUpdated){
                    return res.status(404).send({
                        status: 'Error',
                        message: 'No existe el articulo: ' + articleId,
                    });
                }
    
                return res.status(200).send({
                    status: 'succes',
                    message: 'tomalo!',
                    article: articleUpdated
                });  
    
            });
        }else{
            return res.status(500).send({
                status: 'Error de validacion del articulo: '+articleId,
                message: 'La validación no es correcta'
            });
        }
    },

    deleteArticle: (req, res) => {
        const articleId = req.params.id;
        let params = req.body;

        Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) =>{

            if(err){
                return res.status(500).send({
                    status: 'Error',
                    message: 'Error al eliminar el articulo: ' + articleId,
                });
            }

            if(!articleRemoved){
                return res.status(404).send({
                    status: 'Error',
                    message: 'No se ha borrado el articulo: ' + articleId+ ', posiblemente no exista'
                });
            }

            return res.status(200).send({
                status: 'succes',
                article: articleRemoved
            });

        });
    },

    uploadArticleImg: (req, res) => {
        let params = req.body;
        
        if(!req.files){
            return res.status(440).send({
                status: 'error',
                message: 'imagen no subida'
            });
        }

        //recoger fichero
        const articleId = req.params.id;
        let originalFilename = req.files.file0.name;
        let file_path = req.files.file0.path;
        let file_name = file_path.split('\\')[2];
        let file_ext = file_name.split('.')[1];

        //comprobar extension (img)
        if(file_ext != 'png' && file_ext != 'gif' && file_ext != 'jpeg' && file_ext != 'jpg')
        {
            //borrar archivo subido
            fs.unlink(file_path, (err) =>{
                return res.status(414).send({
                    status: 'Error',
                    message: 'Extensión no válida'
                });
            });

        }else{
            //buscar articulo y actualizarlo
            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new: true}, (err, articleUpdated) =>{

                if(err || !articleUpdated){
                    return res.status(500).send({
                        status: 'Error',
                        message: 'Error al guardar la img'
                     });
                }

                return res.status(200).send({
                    status: 'succes',
                    articleUpdated
                 });
            });
        }

    },

    getArticleImg: (req, res) => {
        var file = req.params.image;
        let path_file = './upload/articles/'+file;

        fs.access(path_file, fs.constants.F_OK, (err) => {
            if (err) {
              return res.status(404).send({
                status: 'error',
                message: 'La imagen no existe'
              });
            } else {
              return res.sendFile(path.resolve(path_file));
            }
        });

    },

    search: (req, res) => {

        //String a buscar
        let searchString = req.params.search;

        //Find or ||
        Article.find({ "$or": [
            { "title": { "$regex": searchString, "$options": "i"}},
            { "content": { "$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date', 'desc']])
        .exec((err, articles) => {

            if(err){
                //TODO: FUNCION COMUN ********
                return res.status(500).send({
                    status: 'ERROR',
                    MESSAGE: 'eRRORrr en la peticion'
                });
            }

            if(!articles || articles.length <= 0){
                return res.status(500).send({
                    status: 'ERROR',
                    MESSAGE: 'No hay articulos para mostrar'
                });
            }

            return res.status(200).send({
                status: 'succes',
                searchString, articles
            });
        });
    }

};  //end controller

module.exports = controller;

