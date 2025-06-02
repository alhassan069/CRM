'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('objections', {
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
      contact_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'contacts',
          key: 'id'
        }
      },
      objection_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      ai_response: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      was_used: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      feedback: {
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
    await queryInterface.dropTable('objections');
  }
}; 