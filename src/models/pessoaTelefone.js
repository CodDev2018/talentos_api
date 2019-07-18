'use strict';
'use strict';
const Sequelize = require('sequelize')
const Model = Sequelize.Model

class PessoaTelefone extends Model {
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
      telefoneTipoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O telefoneTipoId deve ser informado.'
          },
          async isInTelefonesTipos(value) {
            try {
              const tipo = await this.sequelize.models.TelefoneTipo.get(value)
              if (!tipo) {
                throw new Error('Telefone Tipo associado não pode ser encontrado');
              }
            } catch (error) {
              throw error;
            }
          }
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
      obs: DataTypes.STRING
    }, {
      tableName: 'pessoas_telefones',
      sequelize,
      underscored: true
    });
  }
  static associate(models) {
    this.belongsTo(models.Pessoa, {
      foreignKey: 'pessoa_id',
      targetKey: 'id'
    })

    this.belongsTo(models.TelefoneTipo, {
      foreignKey: 'telefone_tipo_id',
      targetKey: 'id'
    })
  };

  static async search(query, limit, offset) {
    let where = {}
    if (!query.pessoaId) {
      throw new Error('ID da Pessoa deve ser informado.')
    }

    where.pessoaId = query.pessoaId
    return await PessoaTelefone.findAndCountAll({
      where: where,
      limit: limit,
      offset: offset,
      include: [{
        model: TelefoneTipo,
      }]
    })
  }

  static async get(id) {
    return await PessoaTelefone.findByPk(id, {
      include: ['TelefoneTipo']
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
      tipo: this.TelefoneTipo ? this.TelefoneTipo.transform() : {
        id: this.TelefoneTipoId
      }
    }
  }
};

module.exports = PessoaTelefone;