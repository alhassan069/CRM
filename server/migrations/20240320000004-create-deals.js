'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('deals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      organization_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'organizations',
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
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      expected_close_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      stage: {
        type: Sequelize.ENUM('prospect', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'),
        defaultValue: 'prospect',
        allowNull: false
      },
      probability: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
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
    await queryInterface.dropTable('deals');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_deals_stage;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_deals_status;');
  }
}; 