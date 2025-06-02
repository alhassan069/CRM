'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'sales', 'support'),
      allowNull: false,
      defaultValue: 'sales'
    });
    await queryInterface.addColumn('users', 'last_login', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'role');
    await queryInterface.removeColumn('users', 'last_login');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_users_role;');
  }
}; 