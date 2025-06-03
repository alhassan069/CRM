module.exports = (sequelize, DataTypes) => {
  const LeadStatus = sequelize.define('lead_status', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    label: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    level: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        min: 1,
        max: 6
      }
    }
  }, {
    timestamps: false
  });

  return LeadStatus;
}; 