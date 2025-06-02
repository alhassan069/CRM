'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DealCoachRecommendation extends Model {
    static associate(models) {
      DealCoachRecommendation.belongsTo(models.Deal, { foreignKey: 'deal_id', as: 'deal' });
    }
  }
  DealCoachRecommendation.init({
    deal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'deals',
        key: 'id'
      }
    },
    recommendation: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    rationale: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    implemented: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'DealCoachRecommendation',
    tableName: 'deal_coach_recommendations',
    underscored: true,
    timestamps: true,
  });
  return DealCoachRecommendation;
}; 