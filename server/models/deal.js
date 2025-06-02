'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Deal extends Model {
    static associate(models) {
      Deal.belongsTo(models.Organization, { foreignKey: 'organization_id', as: 'organization' });
      Deal.belongsTo(models.Contact, { foreignKey: 'contact_id', as: 'contact' });
      Deal.belongsTo(models.User, { foreignKey: 'owner_id', as: 'owner' });
      Deal.hasMany(models.DealCoachRecommendation, { foreignKey: 'deal_id', as: 'recommendations' });
      Deal.hasMany(models.Objection, { foreignKey: 'deal_id', as: 'objections' });
      Deal.hasOne(models.WinLossAnalysis, { foreignKey: 'deal_id', as: 'winLossAnalysis' });
      Deal.hasMany(models.Activity, {
        foreignKey: 'related_to_id',
        constraints: false,
        scope: {
          related_to_type: 'deal'
        },
        as: 'activities'
      });
    }
  }
  Deal.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'organizations',
        key: 'id'
      }
    },
    contact_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'contacts',
        key: 'id'
      }
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    expected_close_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    stage: {
      type: DataTypes.ENUM('prospect', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'),
      defaultValue: 'prospect',
      allowNull: false
    },
    probability: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Deal',
    underscored: true,
    timestamps: true,
  });
  return Deal;
}; 