'use strict'

let express = require('express');

let ArticleController = require('../controllers/article');

let router = express.Router();

let multiparty = require('connect-multiparty');
let md_upload = multiparty({uploadDir: './upload/articles'});

// Rutas de prueba
router.get('/test-controlador', ArticleController.test);
router.post('/datos-curso', ArticleController.datosCurso);

//Rutas útiles para artículos
router.post('/save', ArticleController.save);
router.get('/articles/:lastN?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getSingleArticle);
router.put('/article/:id', ArticleController.updateArticle);
router.delete('/article/:id', ArticleController.deleteArticle);
router.post('/upload-image/:id', md_upload, ArticleController.uploadArticleImg);
router.get('/get-image/:image', ArticleController.getArticleImg);  //TODO=> :id


router.get('/search/:search', ArticleController.search);  //TODO=> :id


module.exports = router;
