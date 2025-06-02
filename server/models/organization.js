'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define associations here
      Organization.hasMany(models.Contact, { foreignKey: 'organization_id', as: 'contacts' });
      Organization.hasMany(models.Deal, { foreignKey: 'organization_id', as: 'deals' });
      Organization.hasMany(models.Activity, { 
        foreignKey: 'related_to_id',
        constraints: false,
        scope: {
          related_to_type: 'organization'
        },
        as: 'activities'
      });
    }
  }
  Organization.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'prospect'),
      defaultValue: 'prospect',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Organization',
    underscored: true,
    timestamps: true,
  });
  return Organization;
}; 