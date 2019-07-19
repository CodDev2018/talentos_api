const errorRes = require('../responses/error.response')

module.exports = async (req, res, next) => {
    if (req.body.usuario.perfil === 'ADMIN') {
        next()
    }

    if (!req.body.usuario.Pessoa.Candidato) {
        return errorRes(res, 400, 'Usuário não está associado a um candidato.')
    }

    const candiatoId = parseInt(req.params.candidatoId ? req.params.candidatoId : req.params.id)

    console.log(req.params, req.body.usuario.Pessoa.Candidato, candiatoId)

    if (candiatoId !== req.body.usuario.Pessoa.Candidato.id) {
        return errorRes(res, 401, 'Você não tem permissão para acessar esse recurso.')
    }

    next()
}