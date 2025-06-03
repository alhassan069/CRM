module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('activity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    lead_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'leads',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('Call', 'Email', 'WhatsApp', 'Meeting'),
      allowNull: false
    },
    activity_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duration_mins: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    outcome: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    summary: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    full_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return Activity;
}; 