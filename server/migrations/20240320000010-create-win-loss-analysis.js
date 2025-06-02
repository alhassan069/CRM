'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('win_loss_analysis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'deals',
          key: 'id'
        }
      },
      outcome: {
        type: Sequelize.ENUM('won', 'lost'),
        allowNull: false
      },
      contributing_factors: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      ai_summary: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      improvement_suggestions: {
        type: Sequelize.TEXT,
        allowNull: true
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('win_loss_analysis');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_win_loss_analysis_outcome;');
  }
}; 