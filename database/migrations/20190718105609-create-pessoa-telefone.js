'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pessoas_telefones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pessoa_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'pessoas',
          key: 'id'
        }
      },
      telefone_tipo_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'telefones_tipos',
          key: 'id'
        }
      },
      numero: {
        allowNull: false,
        type: Sequelize.STRING
      },
      obs: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('pessoas_telefones');
  }
};