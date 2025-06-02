'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Objection extends Model {
    static associate(models) {
      Objection.belongsTo(models.Deal, { foreignKey: 'deal_id', as: 'deal' });
      Objection.belongsTo(models.Contact, { foreignKey: 'contact_id', as: 'contact' });
    }
  }
  Objection.init({
    deal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'deals',
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
    objection_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ai_response: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    was_used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Objection',
    tableName: 'objections',
    underscored: true,
    timestamps: true,
  });
  return Objection;
}; 