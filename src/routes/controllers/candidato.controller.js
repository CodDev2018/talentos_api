const Candidato = require('../../models').Candidato
const CRUDController = require('./crud.controller')

class CandidatoController extends CRUDController {
    constructor() {
        super()
        this.setModel(Candidato)
    }

    async update(req, res, next) {
        if (req.file) {
            req.body.foto = req.file.path
        }
        return await super.update(req, res, next)
    }
}

module.exports = new CandidatoController()