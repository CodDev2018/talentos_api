'use strict';
const Sequelize = require('sequelize')
const Model = Sequelize.Model
const Op = Sequelize.Op

class Cidade extends Model {
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
      estadoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O estadoId deve ser informado.'
          },
          async isInEstados(value) {
            try {
              const estado = await this.sequelize.models.Estado.get(value)
              if (!estado) {
                throw new Error('Estado associado não pode ser encontrado');
              }
            } catch (error) {
              throw error;
            }
          }
        }
      },
    }, {
      sequelize,
      underscored: true,
    })
  }

  static associate(models) {
    this.belongsTo(models.Estado, {
      foreignKey: 'estado_id',
      targetKey: 'id',
      as: 'Estado'
    })
  }

  static async search(query, limit, offset) {
    let where = {}
    if (query.nome) where.nome = {
      [Op.like]: `%${query.nome}%`
    }
    if (query.estadoId) where.estadoId = query.estadoId
    return await Cidade.findAndCountAll({
      where: where,
      limit: limit < 100 && limit > 0 ? limit : 20,
      offset: offset,
      include: ['Estado']
    })
  }

  static async get(id) {
    return await Cidade.findByPk(id, {
      include: ['Estado']
    })
  }

  transform() {
    return {
      id: this.id,
      nome: this.nome,
      estado: this.Estado ? this.Estado.transform() : {
        id: this.estadoId
      }
    }
  }
}

module.exports = Cidade