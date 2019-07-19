'use strict';
const Sequelize = require('sequelize')
const Model = Sequelize.Model

class CandidatoExperiencia extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      candidatoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O candidatoId deve ser informado.'
          },
          async isInCandidato(value) {
            try {
              const candidato = await this.sequelize.models.Candidato.get(value)
              if (!candidato) {
                throw new Error('Candidato associado não pode ser encontrado');
              }
            } catch (error) {
              throw error;
            }
          }
        },
      },
      empresa: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O empresa deve ser informada.'
          },
        },
      },
      contato: DataTypes.STRING,
      telefone: DataTypes.STRING,
      site: DataTypes.STRING,
      inicio: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A data de início deve ser informada.'
          },
        },
      },
      termino: DataTypes.DATE,
      atividades: DataTypes.TEXT
    }, {
      tableName: 'candidatos_experiencias',
      sequelize,
      underscored: true
    });
  }
  static associate(models) {
    this.belongsTo(models.Candidato, {
      foreignKey: 'candidato_id',
      targetKey: 'id',
      as: 'Candidato'
    })
  };

  static async search(query, limit, offset) {
    let where = {}
    if (!query.candidatoId) {
      throw new Error('ID do Candidato deve ser informado.')
    }

    where.candidatoId = query.candidatoId
    return await CandidatoExperiencia.findAndCountAll({
      where: where,
      limit: limit,
      offset: offset
    })
  }

  static async get(id) {
    return await CandidatoExperiencia.findByPk(id, {})
  }

  transform() {
    return {
      id: this.id,
      empresa: this.empresa,
      contato: this.contato,
      telefone: this.telefone,
      site: this.site,
      inicio: this.inicio,
      termino: this.termino,
      atividades: this.atividades
    }
  }
};

module.exports = CandidatoExperiencia;