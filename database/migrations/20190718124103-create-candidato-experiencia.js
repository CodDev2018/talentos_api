'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('candidatos_experiencias', {
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
      empresa: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contato: {
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
    return queryInterface.dropTable('candidatos_experiencias');
  }
};