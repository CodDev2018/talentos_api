const Usuario = require('../../models').Usuario

const CRUDController = require('./crud.controller')

const successRes = require('../responses/success.response')
const errorRes = require('../responses/error.response')

class UserController extends CRUDController {
    constructor() {
        super()
        this.setModel(Usuario)
    }

    async login(req, res, next) {
        try {
            const result = await Usuario.verifyLogin(req.body.email, req.body.senha)
            successRes(res, 200, 'Usuário autenticado.', result)
        } catch (error) {
            errorRes(res, 500, 'Não foi possivel autenticar.')
        }
    }
}

module.exports = new UserController()