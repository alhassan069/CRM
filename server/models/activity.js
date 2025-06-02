 'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    static associate(models) {
      Activity.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
      Activity.belongsTo(models.Deal, {
        foreignKey: 'related_to_id',
        constraints: false,
        scope: {
          related_to_type: 'deal'
        },
        as: 'deal'
      });
      Activity.belongsTo(models.Contact, {
        foreignKey: 'related_to_id',
        constraints: false,
        scope: {
          related_to_type: 'contact'
        },
        as: 'contact'
      });
      Activity.belongsTo(models.Organization, {
        foreignKey: 'related_to_id',
        constraints: false,
        scope: {
          related_to_type: 'organization'
        },
        as: 'organization'
      });
    }
  }
  Activity.init({
    type: {
      type: DataTypes.ENUM('call', 'email', 'meeting', 'note'),
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    related_to_type: {
      type: DataTypes.ENUM('deal', 'contact', 'organization'),
      allowNull: false
    },
    related_to_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Activity',
    underscored: true,
    timestamps: true,
  });
  return Activity;
};