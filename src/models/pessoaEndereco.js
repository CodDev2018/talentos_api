'use strict';
const Sequelize = require('sequelize')
const Model = Sequelize.Model

const {
  Cidade,
  Estado
} = require('./index')

class PessoaEndereco extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      pessoaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O pessoaId deve ser informado.'
          },
          async isInPessoas(value) {
            try {
              const cidade = await this.sequelize.models.Pessoa.get(value)
              if (!cidade) {
                throw new Error('Pessoa associada não pode ser encontrada');
              }
            } catch (error) {
              throw error;
            }
          }
        },
      },
      cidadeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O cidadeId deve ser informado.'
          },
          async isInCidades(value) {
            try {
              const cidade = await this.sequelize.models.Cidade.get(value)
              if (!cidade) {
                throw new Error('Cidade associada não pode ser encontrada');
              }
            } catch (error) {
              throw error;
            }
          }
        },
      },
      logradouro: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O logradouro deve ser informado.'
          },
        },
      },
      numero: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O número deve ser informado.'
          },
        },
      },
      bairro: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O bairro deve ser informado.'
          },
        },
      },
      cep: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O CEP deve ser informado.'
          },
        },
      },
      complemento: DataTypes.STRING,
    }, {
      tableName: 'pessoas_enderecos',
      sequelize,
      underscored: true
    });
  }
  static associate(models) {
    this.belongsTo(models.Pessoa, {
      foreignKey: 'pessoa_id',
      targetKey: 'id'
    })

    this.belongsTo(models.Cidade, {
      foreignKey: 'cidade_id',
      targetKey: 'id',
      as: 'Cidade'
    })
  };

  static async search(query, limit, offset) {
    let where = {}
    if (!query.pessoaId) {
      throw new Error('ID da Pessoa deve ser informado.')
    }

    where.pessoaId = query.pessoaId
    return await PessoaEndereco.findAndCountAll({
      where: where,
      limit: limit,
      offset: offset,
      include: [{
        model: Cidade,
        include: [{
          model: Estado
        }]
      }]
    })
  }

  static async get(id) {
    const {
      Cidade,
      Estado
    } = require('./index')
    return await PessoaEndereco.findByPk(id, {
      include: [{
        model: Cidade,
        as: 'Cidade',
        include: [{
          model: Estado,
          as: 'Estado'
        }]
      }]
    })
  }

  transform() {
    return {
      id: this.id,
      logradouro: this.logradouro,
      numero: this.numero,
      bairro: this.bairro,
      complemento: this.complemento,
      cep: this.cep,
      cidade: this.Cidade ? this.Cidade.transform() : {
        id: this.cidadeId
      }
    }
  }
};

module.exports = PessoaEndereco;