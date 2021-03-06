'use strict';
const Sequelize = require('sequelize')
const Model = Sequelize.Model
const Op = Sequelize.Op

class EstadoCivil extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      descricao: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A descricao deve ser informada.'
          }
        }
      },
    }, {
      sequelize,
      underscored: true,
      tableName: 'estados_civis',
    })
  }

  static associate(models) {

  }

  static async search(query, limit, offset) {
    let where = {}
    if (query.descricao) where.descricao = {[Op.like]: `%${query.descricao}%`}
    return await EstadoCivil.findAndCountAll({
      where: where,
      limit: limit < 100 && limit > 0 ? limit : 20,
      offset: offset
    })
  }

  static async get(id) {
    return await EstadoCivil.findByPk(id, {})
  }

  transform() {
    return {
      id: this.id,
      descricao: this.descricao
    }
  }
}

module.exports = EstadoCivil
