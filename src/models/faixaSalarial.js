'use strict';
'use strict';
const Sequelize = require('sequelize')
const Model = Sequelize.Model
const Op = Sequelize.Op

class FaixaSalarial extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      inicio: {
        type: DataTypes.NUMERIC,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O valor de inicio deve ser informado.'
          }
        }
      },
      fim: {
        type: DataTypes.NUMERIC,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O valor de final deve ser informado.'
          }
        }
      },
    }, {
      sequelize,
      underscored: true,
      tableName: 'faixas_salariais',
    })
  }

  static associate(models) {

  }

  static async search(query, limit, offset) {
    let where = {}
    if (query.descricao) where.descricao = {
      [Op.like]: `%${query.descricao}%`
    }
    return await FaixaSalarial.findAndCountAll({
      where: where,
      limit: limit < 100 && limit > 0 ? limit : 20,
      offset: offset
    })
  }

  static async get(id) {
    return await FaixaSalarial.findByPk(id, {})
  }

  transform() {
    return {
      id: this.id,
      inicio: this.inicio,
      fim: this.fim,
    }
  }
}

module.exports = FaixaSalarial