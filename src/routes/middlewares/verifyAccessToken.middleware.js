const Usuario = require('../../models').Usuario
const errorRes = require('../responses/error.response')

module.exports = async (req, res, next) => {
    try {
        if (!req.headers['x-access-token']) {
            return errorRes(res, 400, 'O header [x-access-token] deve ser informado.')
        }

        req.body.token = await Usuario.verifyToken(req.headers['x-access-token'])
        req.body.usuarioId = parseInt(req.body.token.id)
        req.body.usuario = await Usuario.get(req.body.usuarioId)

        if (!Usuario) {
            return errorRes(res, 401, 'Usuário não encontrado.')
        }

        next()
    } catch (error) {
        console.log(error)
        return errorRes(res, 500, 'Não foi possivel validar o token de acesso.', error)
    }
}