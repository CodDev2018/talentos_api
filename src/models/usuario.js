'use strict';
const Sequelize = require('sequelize')
const Model = Sequelize.Model
const Op = Sequelize.Op

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SECRET = 'DSFGSD453435sdgfhdfg%&¨*#¨$%#sdgfsd'

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
      underscored: true,
      hooks: {
        beforeSave: (usuario, options) => {
          usuario.senha = bcrypt.hashSync(usuario.senha, 10)
          usuario.perfil = "CANDIDATO"
        }
      }
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

  static async verifyToken(token) {
    return await jwt.verify(token, SECRET)
  }

  static async verifyLogin(email, senha) {
    try {
      let usuario = await Usuario.findOne({
        where: {
          email: email
        }
      })

      if (!usuario) {
        throw new Error('Email não encontrado!')
      }
      
      if (!bcrypt.compareSync(senha, usuario.senha)) {
        throw new Error('Senha não confere!')
      }

      let token = jwt.sign({
        id: usuario.id
      }, SECRET, {
        expiresIn: '1d'
      })

      return {
        usuario: usuario.transform(),
        token: token
      }
    } catch (error) {
      throw error
    }
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