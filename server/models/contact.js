'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    static associate(models) {
      Contact.belongsTo(models.Organization, { foreignKey: 'organization_id', as: 'organization' });
      Contact.belongsTo(models.User, { foreignKey: 'assigned_to', as: 'assignedUser' });
      Contact.hasMany(models.Deal, { foreignKey: 'contact_id', as: 'deals' });
      Contact.hasOne(models.ContactPersona, { foreignKey: 'contact_id', as: 'persona' });
      Contact.hasMany(models.Activity, {
        foreignKey: 'related_to_id',
        constraints: false,
        scope: {
          related_to_type: 'contact'
        },
        as: 'activities'
      });
    }
  }
  Contact.init({
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'organizations',
        key: 'id'
      }
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Contact',
    underscored: true,
    timestamps: true,
  });
  return Contact;
}; 