'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContactPersona extends Model {
    static associate(models) {
      ContactPersona.belongsTo(models.Contact, { foreignKey: 'contact_id', as: 'contact' });
    }
  }
  ContactPersona.init({
    contact_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'contacts',
        key: 'id'
      }
    },
    communication_preferences: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pain_points: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    personality_summary: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sales_approach_tips: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ContactPersona',
    tableName: 'contact_personas',
    underscored: true,
    timestamps: true,
  });
  return ContactPersona;
}; 