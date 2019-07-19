'use strict';
const Sequelize = require('sequelize')
const Model = Sequelize.Model
const Op = Sequelize.Op

class Pessoa extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O usuarioId deve ser informado.'
          },
          async isInUsuarios(value) {
            try {
              const usuario = await this.sequelize.models.Usuario.get(value)
              if (!usuario) {
                throw new Error('Usuario associado não pode ser encontrado');
              }
            } catch (error) {
              throw error;
            }
          }
        },
      },
      tipo: {
        type: DataTypes.CHAR,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O tipo deve ser informado.'
          },
          isIn: {
            args: [
              ['F', 'J']
            ],
            msg: 'São aceitos apenas perfis F (Pessoa Física) e J (Pessoa Jurídica).'
          }
        }
      },
      documento: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O documento deve ser informado.'
          },
        },
      },
      dataNascimento: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A data de nascimento deve ser informada.'
          },
        },
      },
      genero: {
        type: DataTypes.CHAR,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O gênero deve ser informado.'
          },
          isIn: {
            args: [
              ['F', 'M']
            ],
            msg: 'São aceitos apenas gêneros F (Feminino) e J (Masculino).'
          }
        }
      },
    }, {
      sequelize,
      underscored: true,
    })
  }

  static associate(models) {
    this.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        targetKey: 'id',
        as: 'Usuario'
      }),

      this.hasMany(models.PessoaEndereco, {
        as: 'Enderecos',
      })

    this.hasMany(models.PessoaTelefone, {
      as: 'Telefones'
    })

    this.hasOne(models.Candidato)
  }

  static async search(query, limit, offset) {
    let where = {}
    if (query.nome) where.documento = query.documento
    return await Pessoa.findAndCountAll({
      where: where,
      limit: limit < 100 && limit > 0 ? limit : 20,
      offset: offset,
      include: ['Usuario']
    })
  }

  static async get(id) {
    return await Pessoa.findByPk(id, {
      include: [{
          model: this.sequelize.models.Usuario,
          as: 'Usuario'
        }, {
          model: this.sequelize.models.PessoaEndereco,
          as: 'Enderecos',
          include: [{
            model: this.sequelize.models.Cidade,
            as: 'Cidade',
            include: [{
              model: this.sequelize.models.Estado,
              as: 'Estado'
            }]
          }]
        },
        {
          model: this.sequelize.models.PessoaTelefone,
          as: 'Telefones',
          include: ['TelefoneTipo']
        },
        {
          model: this.sequelize.models.Candidato
        }
      ]
    })
  }

  transform() {
    return {
      id: this.id,
      tipo: this.tipo,
      documento: this.documento,
      dataNascimento: this.dataNascimento,
      genero: this.genero,
      usuario: this.Usuario ? this.Usuario.transform() : {
        id: this.usuarioId
      },
      enderecos: this.Enderecos ? this.Enderecos.map(endereco => endereco.transform()) : [],
      telefones: this.Telefones ? this.Telefones.map(telefone => telefone.transform()) : [],
      candidato: this.Candidato ? this.Candidato.transform() : {},
    }
  }
}

module.exports = Pessoa