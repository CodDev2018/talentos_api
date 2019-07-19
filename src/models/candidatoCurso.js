'use strict';
const Sequelize = require('sequelize')
const Model = Sequelize.Model

class CandidatoCurso extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      candidatoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O candidatoId deve ser informado.'
          },
          async isInCandidatos(value) {
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
      cursoNivelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O cursoNivelId deve ser informado.'
          },
          async isInCusosNiveis(value) {
            try {
              const cursoNivel = await this.sequelize.models.CursoNivel.get(value)
              if (!cursoNivel) {
                throw new Error('Curso Nível associado não pode ser encontrado');
              }
            } catch (error) {
              throw error;
            }
          }
        },
      },
      cursoSituacaoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O cursoSituacaoId deve ser informado.'
          },
          async isInCursosSituacoes(value) {
            try {
              const cursoSituacao = await this.sequelize.models.CursoSituacao.get(value)
              if (!cursoSituacao) {
                throw new Error('Curso Situação associado não pode ser encontrado');
              }
            } catch (error) {
              throw error;
            }
          }
        },
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'O nome deve ser informado.'
          },
        },
      },
      instituicao: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A instituição deve ser informada.'
          },
        },
      },
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
      cargaHoraria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A carga horária deve ser informada.'
          },
        },
      },
      atividades: DataTypes.TEXT
    }, {
      tableName: 'candidatos_cursos',
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

    this.belongsTo(models.CursoNivel, {
      foreignKey: 'curso_nivel_id',
      targetKey: 'id',
      as: 'Nivel'
    })

    this.belongsTo(models.CursoSituacao, {
      foreignKey: 'curso_situacao_id',
      targetKey: 'id',
      as: 'Situacao'
    })
  };

  static async search(query, limit, offset) {
    let where = {}
    if (!query.candidatoId) {
      throw new Error('ID do Candidato deve ser informado.')
    }

    where.candidatoId = query.candidatoId
    return await CandidatoCurso.findAndCountAll({
      where: where,
      limit: limit,
      offset: offset,
      include: [{
        model: this.sequelize.models.CursoNivel,
        as: 'Nivel'
      }, {
        model: this.sequelize.models.CursoSituacao,
        as: 'Situacao'
      }]
    })
  }

  static async get(id) {
    return await CandidatoCurso.findByPk(id, {
      include: [{
        model: 'Nivel',
      }, {
        model: 'Situacao'
      }]
    })
  }

  transform() {
    return {
      id: this.id,
      nome: this.nome,
      instituicao: this.instituicao,
      telefone: this.telefone,
      site: this.site,
      inicio: this.inicio,
      termino: this.termino,
      cargaHoraria: this.cargaHoraria,
      atividades: this.atividades,
      cursoNivel: this.CursoNivel ? this.CursoNivel.transform() : {
        id: this.cursoNivelId
      },
      cursoSituacao: this.CursoSituacao ? this.CursoSituacao.transform() : {
        id: this.cursoSituacaoId
      },
    }
  }
};

module.exports = CandidatoCurso;