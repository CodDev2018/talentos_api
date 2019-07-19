'use strict';
const Sequelize = require('sequelize')
const Model = Sequelize.Model
const Op = Sequelize.Op

class Candidato extends Model {
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
              const pessoa = await this.sequelize.models.Pessoa.get(value)
              if (!pessoa) {
                throw new Error('Pessoa associada não pode ser encontrada');
              }
            } catch (error) {
              throw error;
            }
          }
        },
      },
      faixaSalarialId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O faixaSalarialId deve ser informado.'
          },
          async isInFaixasSalariais(value) {
            try {
              const faixa = await this.sequelize.models.FaixaSalarial.get(value)
              if (!faixa) {
                throw new Error('Faixa Salarial associada não pode ser encontrada');
              }
            } catch (error) {
              throw error;
            }
          }
        },
      },
      estadoCivilId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O estadoCivilId deve ser informado.'
          },
          async isInEstadoCivil(value) {
            try {
              const estadoCivil = await this.sequelize.models.EstadoCivil.get(value)
              if (!estadoCivil) {
                throw new Error('Estado Civil associada não pode ser encontrada');
              }
            } catch (error) {
              throw error;
            }
          }
        },
      },
      descricaoPerfil: DataTypes.TEXT,
      foto: DataTypes.TEXT,
      tipoCnh: DataTypes.STRING,
      pretencaoSalarial: DataTypes.STRING,
    }, {
      sequelize,
      underscored: true,
    })
  }

  static associate(models) {
    this.belongsTo(models.Pessoa, {
        foreignKey: 'pessoa_id',
        targetKey: 'id',
        as: 'Pessoa'
      }),

      this.belongsTo(models.FaixaSalarial, {
        foreignKey: 'faixa_salarial_id',
        targetKey: 'id',
        as: 'FaixaSalarial'
      }),

      this.belongsTo(models.EstadoCivil, {
        foreignKey: 'estado_civil_id',
        targetKey: 'id',
        as: 'EstadoCivil'
      }),

      this.hasMany(models.CandidatoCurso, {
        as: 'Cursos',
      })

    this.hasMany(models.CandidatoExperiencia, {
      as: 'Experiencias'
    })
  }

  static async search(query, limit, offset) {
    let where = {}
    if (query.pessoaId) where.pessoaId = query.pessoaId
    if (query.faixaSalarialId) where.faixaSalarialId = query.faixaSalarialId
    return await Candidato.findAndCountAll({
      where: where,
      limit: limit < 100 && limit > 0 ? limit : 20,
      offset: offset,
      include: [{
          model: this.sequelize.models.FaixaSalarial,
          as: 'FaixaSalarial'
        }, {
          model: this.sequelize.models.EstadoCivil,
          as: 'EstadoCivil'
        },
        {
          model: this.sequelize.models.CandidatoCurso,
          as: 'Cursos'
        },
        {
          model: this.sequelize.models.CandidatoExperiencia,
          as: 'Experiencias'
        }
      ]
    })
  }

  static async get(id) {
    return await Candidato.findByPk(id, {
      include: [{
        model: this.sequelize.models.FaixaSalarial,
        as: 'FaixaSalarial'
      }, {
        model: this.sequelize.models.EstadoCivil,
        as: 'EstadoCivil'
      },
      {
        model: this.sequelize.models.CandidatoCurso,
        as: 'Cursos'
      },
      {
        model: this.sequelize.models.CandidatoExperiencia,
        as: 'Experiencias'
      }
      ]
    })
  }

  transform() {
    return {
      id: this.id,
      descricaoPerfil: this.descricaoPerfil,
      foto: this.foto,
      tipoCnh: this.tipoCnh,
      pretencaoSalarial: this.pretencaoSalarial,
      faixaSalarial: this.FaixaSalarial ? this.FaixaSalarial.transform() : {
        id: this.faixaSalarialId
      },
      estadoCivil: this.EstadoCivil ? this.EstadoCivil.transform() : {
        id: this.estadoCivilId
      },
      cursos: this.Cursos ? this.Cursos.map(curso => curso.transform()) : [],
      experiencias: this.Experiencias ? this.Experiencias.map(experiencia => experiencia.transform()) : []
    }
  }
}

module.exports = Candidato