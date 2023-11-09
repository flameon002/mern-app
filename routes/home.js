const express = require("express");
const { deleteUrls, readUrls, createUrls, updateUrl, editarUrl, redireccionamiento } = require("../controllers/homeControllers");
const validarUrl = require("../middlewares/urlValida");
const verificarUser = require("../middlewares/verificarUser");
const { formPerfil ,editarFotoPerfil} = require("../controllers/perfilController");
const router = express.Router();

router.get('/',verificarUser, readUrls)
router.post('/',verificarUser,validarUrl, createUrls)

router.get('/eliminar/:id',verificarUser, deleteUrls)

router.get('/editar/:id', verificarUser, updateUrl)
router.post('/editar/:id', verificarUser, validarUrl,editarUrl)

router.get('/perfil',verificarUser, formPerfil)
router.post('/perfil', verificarUser, editarFotoPerfil)

router.get('/:shortURL', redireccionamiento)

module.exports= router