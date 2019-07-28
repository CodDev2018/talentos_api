var express = require('express');
var router = express.Router();
const UserController = require('./controllers/user.controller')
const verifyAccessToken = require('./middlewares/verifyAccessToken.middleware')

/**
 * @api {get} /api/usuarios/:id Retorna Usuário pelo Id
 * @apiName getUsuario
 * @apiGroup Usuarios
 * 
 * @apiParam {Integer} id Chave primaria de usuário
 * 
 * @apiSuccess (200) {Object} Usuário
 */
router.get('/:id', verifyAccessToken, UserController.get.bind(UserController))


router.get('/', verifyAccessToken, UserController.find.bind(UserController))
router.post('/', UserController.create.bind(UserController))
router.patch('/:id', verifyAccessToken, UserController.update.bind(UserController))
router.delete('/:id', verifyAccessToken, UserController.delete.bind(UserController))
router.post('/login', UserController.login.bind(UserController))
module.exports = router;