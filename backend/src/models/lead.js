module.exports = (sequelize, DataTypes) => {
  const Lead = sequelize.define('lead', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    doctor_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    clinic_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    specialty: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contact_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    source_of_lead: {
      type: DataTypes.ENUM('Website Form', 'Cold Call', 'Referral', 'LinkedIn', 'Medical Conference', 'Blogs', 'Youtube'),
      allowNull: true
    },
    initial_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    years_of_experience: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    clinic_type: {
      type: DataTypes.ENUM('single-doctor', 'multi-specialty'),
      allowNull: true
    },
    preferred_comm_channel: {
      type: DataTypes.ENUM('Phone', 'Email', 'Whatsapp'),
      allowNull: true
    },
    estimated_patient_volume: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    uses_existing_emr: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    specific_pain_points: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    referral_source: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'lead_statuses',
        key: 'id'
      }
    },
    status_level: {
      type: DataTypes.TINYINT,
      allowNull: true,
      validate: {
        min: 1,
        max: 6
      }
    },
    reason_for_loss: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Lead;
}; 