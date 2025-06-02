const { sequelize } = require('../models');

beforeAll(async () => {
  // Sync all models with the database
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close the database connection
  await sequelize.close();
}); 