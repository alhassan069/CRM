const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const leadRoutes = require('./routes/lead.routes');
const activityRoutes = require('./routes/activity.routes');
const aiRoutes = require('./routes/ai.routes');
const taskRoutes = require('./routes/task.routes');
const userRoutes = require('./routes/user.routes');
const reportRoutes = require('./routes/report.routes');
const createDefaultAdmin = require('./scripts/createDefaultAdmin');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const db = require('./models');
const { syncDatabase } = require('./utils/dbSync');

// Simple route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Doctor CRM API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api', activityRoutes); // Use actual activity routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reports', reportRoutes);

// Export the app for testing
module.exports = app;

// Start server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    
    // Sync database (without force to preserve data)
    await syncDatabase(false);
    
    // Create default admin user if none exists
    try {
      await createDefaultAdmin();
    } catch (error) {
      console.error('Failed to create default admin during startup:', error);
    }
  });
} 