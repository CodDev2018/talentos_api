const errorRes = require('../responses/error.response')

module.exports = async (req, res, next) => {
    if (req.body.usuario.perfil === 'ADMIN') {
        next()
    }

    if (!req.body.usuario.Pessoa) {
        return errorRes(res, 400, 'Usuário não está associado a uma pessoa.')
    }

    const pessoaId = parseInt(req.params.pessoaId ? req.params.pessoaId : req.params.id)

    if (pessoaId !== req.body.usuario.Pessoa.id) {
        return errorRes(res, 401, 'Você não tem permissão para acessar esse recurso.')
    }

    next()
}