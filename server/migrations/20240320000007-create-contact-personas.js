'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('contact_personas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contact_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'contacts',
          key: 'id'
        }
      },
      communication_preferences: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      pain_points: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      personality_summary: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      sales_approach_tips: {
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
    await queryInterface.dropTable('contact_personas');
  }
}; 