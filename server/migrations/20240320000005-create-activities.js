'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('activities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM('call', 'email', 'meeting', 'note'),
        allowNull: false
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      related_to_type: {
        type: Sequelize.ENUM('deal', 'contact', 'organization'),
        allowNull: false
      },
      related_to_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'cancelled'),
        defaultValue: 'pending',
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
    await queryInterface.dropTable('activities');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_activities_type;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_activities_related_to_type;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_activities_status;');
  }
}; 