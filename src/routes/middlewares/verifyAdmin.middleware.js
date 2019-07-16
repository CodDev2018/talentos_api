const errorRes = require('../responses/error.response')

module.exports = async (req, res, next) => {
    if (req.body.usuario.perfil !== 'ADMIN') {
        return errorRes(res, 401, 'Você não tem permissão para acessar este recurso.')
    }
    next()
}