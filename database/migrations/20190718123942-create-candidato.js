'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Candidatos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pessoa_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: true,
        references: {model: 'pessoas', key: 'id'}
      },
      faixa_salarial_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {model: 'faixas_salariais', key: 'id'}
      },
      estado_civil_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {model: 'estados_civis', key: 'id'}
      },
      descricao_perfil: {
        type: Sequelize.TEXT
      },
      foto: {
        type: Sequelize.TEXT
      },
      tipo_cnh: {
        type: Sequelize.STRING
      },
      pretencao_salarial: {
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
    return queryInterface.dropTable('Candidatos');
  }
};