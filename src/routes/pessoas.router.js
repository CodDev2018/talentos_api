const express = require('express');
const router = express.Router();

const {
    Pessoa,
    PessoaEndereco,
    PessoaTelefone
} = require('../models')

const CrudController = require('./controllers/crud.controller')

const pessoaController = new CrudController()
pessoaController.setModel(Pessoa)

const enderecoController = new CrudController()
enderecoController.setModel(PessoaEndereco)

const telefoneController = new CrudController()
telefoneController.setModel(PessoaTelefone)

const verifyAccessTokenMiddleware = require('./middlewares/verifyAccessToken.middleware')
const verifyAdminMiddleware = require('./middlewares/verifyAdmin.middleware')
const verifyPessoaMiddleware = require('./middlewares/verifyPessoa.middleware')

const verifyAdmin = [verifyAccessTokenMiddleware, verifyAdminMiddleware]
const verifyOwner = [verifyAccessTokenMiddleware, verifyPessoaMiddleware]

/**
 * PESSOA
 */
router.get('/:id', verifyOwner, pessoaController.get.bind(pessoaController))
router.get('/', verifyAdmin, pessoaController.find.bind(pessoaController))
router.post('/', verifyAccessTokenMiddleware, pessoaController.create.bind(pessoaController));
router.patch('/:id', verifyOwner, pessoaController.update.bind(pessoaController));
router.delete('/:id', verifyAdmin, pessoaController.delete.bind(pessoaController));

/**
 * ENDERECOS
 */
router.get('/:pessoaId/enderecos/:id', verifyOwner, enderecoController.get.bind(enderecoController))
router.post('/:pessoaId/enderecos/', verifyOwner, enderecoController.create.bind(enderecoController));
router.patch('/:pessoaId/enderecos/:id', verifyOwner, enderecoController.update.bind(enderecoController));
router.delete('/:pessoaId/enderecos/:id', verifyOwner, enderecoController.delete.bind(enderecoController));

/**
 * TELEFONES
 */
router.get('/:pessoaId/telefones/:id', verifyOwner, telefoneController.get.bind(telefoneController))
router.post('/:pessoaId/telefones/', verifyOwner, telefoneController.create.bind(telefoneController));
router.patch('/:pessoaId/telefones/:id', verifyOwner, telefoneController.update.bind(telefoneController));
router.delete('/:pessoaId/telefones/:id', verifyOwner, telefoneController.delete.bind(telefoneController));

module.exports = router;