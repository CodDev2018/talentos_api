const Usuario = require('../../models').Usuario

const successRes = require('../responses/success.response')
const errorRes = require('../responses/error.response')
const invalidRes = require('../responses/invalid.response')

class UserController {

    async get(req, res, next) {
        try {
            let usuario = await Usuario.get(req.params.id)
            successRes(res, 200, null, usuario.transform())
        } catch (error) {
            return errorRes(res, 500, 'Não foi possível recuper nenhum usuario pelo id.')
        }
    }

    async find(req, res, next) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 20
            const offset = req.query.offset ? parseInt(req.query.offset) : 0
            const usuarios = await Usuario.search(req.query, limit, offset)
            let rows = usuarios.rows.map(usuario => usuario.transform())
            let count = usuarios.count
            successRes(res, 200, null, {
                rows: rows,
                count: count,
                limit: limit,
                offset: offset
            })
        } catch (error) {
            return errorRes(res, 500, 'Não foi possível recuper nenhum usuario pelo id.')
        }
    }

    async create(req, res, next) {
        try {
            const usuario = await Usuario.create(req.body)
            return successRes(res, 201, 'Successo ao criar nova entidade em usuários', usuario.transform())
        } catch (error) {
            if (error.name && error.name.includes('Sequelize')) {
                return invalidRes(res, 400, 'Os dados informados não são válidos para entidades de usuarios', error)
            }

            return errorRes(res, 500, 'Erro ao criar nova entidade em usuarios', error)
        }
    }

    async update(req, res, next) {
        try {
            const usuarioOld = await Usuario.get(req.params.id)
            const usuarioNew = await usuarioOld.update(req.body)
            return successRes(res, 201, 'Successo ao atualizar entidade em usuários', usuarioNew.transform())
        } catch (error) {
            if (error.name && error.name.includes('Sequelize')) {
                return invalidRes(res, 400, 'Os dados informados não são válidos para entidades de usuarios', error)
            }

            return errorRes(res, 500, 'Erro ao atualizar entidade em usuarios', error)
        }
    }

    async delete(req, res, next) {
        try {
            const usuario = await Usuario.get(req.params.id)
            if (!usuario) {
                return errorRes(res, 404, 'Usuário não encontrado.', null)
            }
            usuario.destroy()
            return successRes(res, 200, 'Entidade excluida com sucesso.', null)
        } catch (error) {
            return errorRes(res, 500, 'Erro ao atualizar entidade em usuarios', error)
        }
    }
}

module.exports = new UserController()