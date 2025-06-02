const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { User, connectDatabase, disconnectDatabase, sequelize } = require('./models');
const routes = require('./routes');
const loggerMiddleware = require('./middlewares/logger.middleware');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const organizationRoutes = require('./routes/organizations');
const contactRoutes = require('./routes/contacts');
const dealRoutes = require('./routes/deals');
const activityRoutes = require('./routes/activities');
const taskRoutes = require('./routes/tasks');

dotenv.config();
const PORT = process.env.PORT || 5001;

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'localhost'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

app.use(loggerMiddleware);
app.get('/', (req, res) => {
  res.send('Hello World');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Only start the server if this file is run directly
if (require.main === module) {
  let server;
  async function startServer() {
    try {
      await connectDatabase();
      await sequelize.sync({ alter: true });
      server = app.listen(PORT, () => console.log(`Server running on port ${PORT} successfully.`));
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  process.on('SIGINT', async () => {
    console.log(' SIGINT signal received: closing Database connection and HTTP server');
    try {
      await disconnectDatabase();
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  startServer();
}

module.exports = app;