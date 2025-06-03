const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config');

console.log(dbConfig);
// Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.DB, 
  dbConfig.USER, 
  dbConfig.PASSWORD, 
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

// Initialize db object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.users = require('./user.js')(sequelize, Sequelize);
db.roles = require('./role.js')(sequelize, Sequelize);
db.leads = require('./lead.js')(sequelize, Sequelize);
db.leadStatuses = require('./leadStatus.js')(sequelize, Sequelize);
db.activities = require('./activity.js')(sequelize, Sequelize);
db.tasks = require('./task.js')(sequelize, Sequelize);

// Define associations
// Role and User associations
db.roles.hasMany(db.users, { foreignKey: 'role_id' });
db.users.belongsTo(db.roles, { foreignKey: 'role_id' });

// User and Lead associations
db.users.hasMany(db.leads, { foreignKey: 'assigned_to' });
db.leads.belongsTo(db.users, { foreignKey: 'assigned_to', as: 'assignedUser' });

// LeadStatus and Lead associations
db.leadStatuses.hasMany(db.leads, { foreignKey: 'status_id' });
db.leads.belongsTo(db.leadStatuses, { foreignKey: 'status_id', as: 'status' });

// Lead and Activity associations
db.leads.hasMany(db.activities, { foreignKey: 'lead_id' });
db.activities.belongsTo(db.leads, { foreignKey: 'lead_id' });

// User and Activity associations
db.users.hasMany(db.activities, { foreignKey: 'user_id' });
db.activities.belongsTo(db.users, { foreignKey: 'user_id', as: 'user' });

// Lead and Task associations
db.leads.hasMany(db.tasks, { foreignKey: 'lead_id' });
db.tasks.belongsTo(db.leads, { foreignKey: 'lead_id' });

// User and Task associations
db.users.hasMany(db.tasks, { foreignKey: 'assigned_to' });
db.tasks.belongsTo(db.users, { foreignKey: 'assigned_to', as: 'assignedUser' });

module.exports = db; 