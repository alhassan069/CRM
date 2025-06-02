'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Deal, { foreignKey: 'owner_id', as: 'deals' });
      User.hasMany(models.Contact, { foreignKey: 'assigned_to', as: 'contacts' });
      User.hasMany(models.Activity, { foreignKey: 'created_by', as: 'activities' });
      User.hasMany(models.Task, { foreignKey: 'assigned_to', as: 'tasks' });
    }

  }
  User.init({
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('admin', 'sales', 'support'),
      allowNull: false,
      defaultValue: 'sales',
      validate: {
        isIn: [['admin', 'sales', 'support']]
      }
    },
    last_login: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    underscored: true,
    timestamps: true,
  });
  return User;
};