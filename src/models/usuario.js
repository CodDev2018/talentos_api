'use strict';
const Sequelize = require('sequelize')
const Model = Sequelize.Model
const Op = Sequelize.Op

class Usuario extends Model {
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O email deve ser informado.'
          },
          isEmail: {
            msg: 'Email deve ser válido.'
          }
        }
      },
      senha: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A senha deve ser informada.'
          }
        }
      },
      perfil: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'CANDIDATO',
        validate: {
          notNull: {
            msg: 'O perfil deve ser informado.'
          },
          isIn: {
            args: [
              ['ADMIN', 'CANDIDATO']
            ],
            msg: 'São aceitos apenas perfis ADMIN e CANDIDATO.'
          }
        }
      }
    }, {
      sequelize,
      underscored: true
    })
  }

  static associate(models) {

  }

  static async search(query, limit, offset) {
    let where = {}
    if (query.nome) where.nome = {[Op.like]: `%${query.nome}%`}
    if (query.email) where.email = query.email
    return await Usuario.findAndCountAll({
      where: where,
      limit: limit < 100 && limit > 0 ? limit : 20,
      offset: offset
    })
  }

  static async get(id) {
    return await Usuario.findByPk(id, {})
  }

  transform() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      perfil: this.perfil
    }
  }
}

module.exports = Usuario