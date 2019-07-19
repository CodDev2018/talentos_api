const successRes = require('../responses/success.response')
const errorRes = require('../responses/error.response')
const invalidRes = require('../responses/invalid.response')

class CRUDController {

    constructor() {
        this.model = null
    }

    setModel(model) {
        this.model = model
    }

    async get(req, res, next) {
        try {
            let entity = await this.model.get(req.params.id)
            successRes(res, 200, null, entity.transform())
        } catch (error) {
            return errorRes(res, 500, `Não foi possível recuper os dados da entidade ${this.model.getTableName()} pelo id.`)
        }
    }

    async find(req, res, next) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 20
            const offset = req.query.offset ? parseInt(req.query.offset) : 0
            const entities = await this.model.search(req.query, limit, offset)
            let rows = entities.rows.map(entity => entity.transform())
            let count = entities.count
            successRes(res, 200, null, {
                rows: rows,
                count: count,
                limit: limit,
                offset: offset
            })
        } catch (error) {
            return errorRes(res, 500, `Não foi possível recuperar lista de entidades de ${this.model.getTableName()}.`)
        }
    }

    async create(req, res, next) {
        try {
            const entity = await this.model.create(req.body)
            return successRes(res, 201, `Nova entidade incluida com sucesso em ${this.model.getTableName()}.`, entity.transform())
        } catch (error) {
            console.log(error)
            if (error.name && error.name.includes('SequelizeValidation')) {
                return invalidRes(res, 400, `Dados informados não são válidos para entidade ${this.model.getTableName()}`, error)
            }

            return errorRes(res, 500, `Erro ao incluir entidade em ${this.model.getTableName()}`, error)
        }
    }

    async update(req, res, next) {
        try {
            const entityOld = await this.model.get(req.params.id)
            const entityNew = await entityOld.update(req.body)
            return successRes(res, 200, 'Successo ao atualizar entidade em usuários', entityNew.transform())
        } catch (error) {
            if (error.name && error.name.includes('Sequelize')) {
                return invalidRes(res, 400, `Dados informados não são válidos para entidade ${this.model.getTableName()}`, error)
            }

            return errorRes(res, 500, `Erro ao atualizar entidade em ${this.model.getTableName()}`, error)
        }
    }

    async delete(req, res, next) {
        try {
            const entity = await this.model.get(req.params.id)
            if (!entity) {
                return errorRes(res, 404, `Não foi possível encontrar entidade em ${this.model.getTableName()} pelo id.`, null)
            }
            entity.destroy()
            return successRes(res, 200, `Entidade excluida com sucesso em ${this.model.getTableName()}.`, null)
        } catch (error) {
            return errorRes(res, 500, `Erro ao excluir entidade em ${this.model.getTableName()}.`, error)
        }
    }
}

module.exports = CRUDController