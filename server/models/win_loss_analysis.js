'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WinLossAnalysis extends Model {
    static associate(models) {
      WinLossAnalysis.belongsTo(models.Deal, { foreignKey: 'deal_id', as: 'deal' });
    }
  }
  WinLossAnalysis.init({
    deal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'deals',
        key: 'id'
      }
    },
    outcome: {
      type: DataTypes.ENUM('won', 'lost'),
      allowNull: false
    },
    contributing_factors: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ai_summary: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    improvement_suggestions: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'WinLossAnalysis',
    tableName: 'win_loss_analysis',
    underscored: true,
    timestamps: true,
  });
  return WinLossAnalysis;
}; 