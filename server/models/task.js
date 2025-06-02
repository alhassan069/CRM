'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.User, { foreignKey: 'assigned_to', as: 'assignee' });
      Task.belongsTo(models.Deal, {
        foreignKey: 'related_to_id',
        constraints: false,
        scope: {
          related_to_type: 'deal'
        },
        as: 'deal'
      });
      Task.belongsTo(models.Contact, {
        foreignKey: 'related_to_id',
        constraints: false,
        scope: {
          related_to_type: 'contact'
        },
        as: 'contact'
      });
      Task.belongsTo(models.Organization, {
        foreignKey: 'related_to_id',
        constraints: false,
        scope: {
          related_to_type: 'organization'
        },
        as: 'organization'
      });
    }
  }
  Task.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    related_to_type: {
      type: DataTypes.ENUM('deal', 'contact', 'organization'),
      allowNull: true
    },
    related_to_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium',
      allowNull: false
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Task',
    underscored: true,
    timestamps: true,
  });
  return Task;
}; 