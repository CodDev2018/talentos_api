const Usuario = require('../../models').Usuario

const CRUDController = require('./crud.controller')

class UserController extends CRUDController {
    constructor() {
        super()
        this.setModel(Usuario)
    }
}

module.exports = new UserController()