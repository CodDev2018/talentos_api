'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('candidatos_cursos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      candidato_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'candidatos',
          key: 'id'
        }
      },
      curso_nivel_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'cursos_niveis',
          key: 'id'
        }
      },
      curso_situacao_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'cursos_situacoes',
          key: 'id'
        }
      },
      nome: {
        allowNull: false,
        type: Sequelize.STRING
      },
      instituicao: {
        allowNull: false,
        type: Sequelize.STRING
      },
      telefone: {
        type: Sequelize.STRING
      },
      site: {
        type: Sequelize.STRING
      },
      inicio: {
        allowNull: false,
        type: Sequelize.DATE
      },
      termino: {
        type: Sequelize.DATE
      },
      carga_horaria: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      atividades: {
        type: Sequelize.TEXT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('candidatos_cursos');
  }
};