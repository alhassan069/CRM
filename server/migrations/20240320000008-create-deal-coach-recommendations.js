'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('deal_coach_recommendations', {
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
      recommendation: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      rationale: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      implemented: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
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
    await queryInterface.dropTable('deal_coach_recommendations');
  }
}; 