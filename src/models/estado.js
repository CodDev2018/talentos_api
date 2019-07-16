'use strict';
const Sequelize = require('sequelize')
const Model = Sequelize.Model
const Op = Sequelize.Op

class Estado extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O nome deve ser informado.'
          }
        }
      },
      sigla: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A sigla deve ser informada.'
          },
        }
      },
    }, {
      sequelize,
      underscored: true,
    })
  }

  static associate(models) {

  }

  static async search(query, limit, offset) {
    let where = {}
    if (query.nome) where.nome = {[Op.like]: `%${query.nome}%`}
    if (query.sigla) where.sigla = query.sigla
    return await Estado.findAndCountAll({
      where: where,
      limit: limit < 100 && limit > 0 ? limit : 20,
      offset: offset
    })
  }

  static async get(id) {
    return await Estado.findByPk(id, {})
  }

  transform() {
    return {
      id: this.id,
      nome: this.nome,
      sigla: this.sigla,
    }
  }
}

module.exports = Estado