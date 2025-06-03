const db = require('../models');
const { Op } = require('sequelize');
const Lead = db.leads;
const Task = db.tasks;
const Activity = db.activities;
const LeadStatus = db.leadStatuses;
const User = db.users;

// Get dashboard metrics for sales rep
exports.getSalesRepMetrics = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Get total leads assigned to the sales rep
    const totalLeads = await Lead.count({
      where: { assigned_to: userId }
    });
    
    // Get new leads assigned this week
    const newLeadsThisWeek = await Lead.count({
      where: {
        assigned_to: userId,
        created_at: {
          [Op.gte]: startOfWeek
        }
      }
    });
    
    // Get count of demos scheduled (leads with status level 3)
    const demosScheduled = await Lead.count({
      where: {
        assigned_to: userId,
        status_level: 3
      }
    });
    
    // Get count of converted leads (status level 5)
    const convertedLeads = await Lead.count({
      where: {
        assigned_to: userId,
        status_level: 5
      }
    });
    
    // Calculate conversion rate
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads * 100).toFixed(2) : 0;
    
    return res.status(200).json({
      totalLeads,
      newLeadsThisWeek,
      demosScheduled,
      convertedLeads,
      conversionRate
    });
  } catch (error) {
    console.error('Error getting sales rep metrics:', error);
    return res.status(500).json({ message: 'Failed to fetch dashboard metrics' });
  }
};

// Get dashboard metrics for sales admin
exports.getSalesAdminMetrics = async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Get total leads
    const totalLeads = await Lead.count();
    
    // Get new leads this week
    const newLeadsThisWeek = await Lead.count({
      where: {
        created_at: {
          [Op.gte]: startOfWeek
        }
      }
    });
    
    // Get count of demos scheduled (leads with status level 3)
    const demosScheduled = await Lead.count({
      where: {
        status_level: 3
      }
    });
    
    // Get count of converted leads (status level 5)
    const convertedLeads = await Lead.count({
      where: {
        status_level: 5
      }
    });
    
    // Calculate conversion rate
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads * 100).toFixed(2) : 0;
    
    return res.status(200).json({
      totalLeads,
      newLeadsThisWeek,
      demosScheduled,
      convertedLeads,
      conversionRate
    });
  } catch (error) {
    console.error('Error getting sales admin metrics:', error);
    return res.status(500).json({ message: 'Failed to fetch dashboard metrics' });
  }
};

// Get tasks for the current user
exports.getUserTasks = async (req, res) => {
  try {
    const userId = req.userId;
    const isAdmin = req.userRole === 'admin';
    
    let whereClause = { assigned_to: userId };
    
    // If admin and teamwide parameter is true, get all tasks
    if (isAdmin && req.query.teamwide === 'true') {
      whereClause = {};
    }
    
    const tasks = await Task.findAll({
      where: whereClause,
      include: [
        {
          model: Lead,
          as: 'lead',
          attributes: ['id', 'doctor_name', 'clinic_name']
        },
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'name']
        }
      ],
      order: [
        ['due_date', 'ASC'],
        ['due_time', 'ASC']
      ]
    });
    
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error getting user tasks:', error);
    return res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

// Get lead status aggregation for the current user
exports.getLeadStatusAggregation = async (req, res) => {
  try {
    const userId = req.userId;
    const isAdmin = req.userRole === 'admin';
    
    let whereClause = { assigned_to: userId };
    
    // If admin and teamwide parameter is true, get all leads
    if (isAdmin && req.query.teamwide === 'true') {
      whereClause = {};
    }
    
    // Get all lead statuses
    const statuses = await LeadStatus.findAll();
    
    // Create a map of status_id to label for easy lookup
    const statusMap = {};
    statuses.forEach(status => {
      statusMap[status.id] = status.label;
    });
    
    // Get count of leads by status
    const leadsByStatus = await Lead.findAll({
      where: whereClause,
      attributes: ['status_id', [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']],
      group: ['status_id']
    });
    
    // Format the response
    const formattedLeadsByStatus = leadsByStatus.map(item => ({
      status: statusMap[item.status_id] || 'Unknown',
      count: parseInt(item.dataValues.count)
    }));
    
    return res.status(200).json(formattedLeadsByStatus);
  } catch (error) {
    console.error('Error getting lead status aggregation:', error);
    return res.status(500).json({ message: 'Failed to fetch lead status aggregation' });
  }
};

// Get daily activities for the current user
exports.getDailyActivities = async (req, res) => {
  try {
    const userId = req.userId;
    const isAdmin = req.userRole === 'admin';
    const days = parseInt(req.query.days) || 7; // Default to 7 days
    
    // Calculate the start date (X days ago)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    
    let whereClause = { 
      user_id: userId,
      activity_time: {
        [Op.gte]: startDate
      }
    };
    
    // If admin and teamwide parameter is true, get all activities
    if (isAdmin && req.query.teamwide === 'true') {
      delete whereClause.user_id;
    }
    
    // Get activities grouped by day and type
    const activities = await Activity.findAll({
      where: whereClause,
      attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('activity_time')), 'date'],
        'type',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: [
        db.sequelize.fn('DATE', db.sequelize.col('activity_time')),
        'type'
      ],
      order: [
        [db.sequelize.fn('DATE', db.sequelize.col('activity_time')), 'ASC']
      ]
    });
    
    // Format the response
    const formattedActivities = {};
    
    activities.forEach(activity => {
      const date = activity.dataValues.date;
      const type = activity.type;
      const count = parseInt(activity.dataValues.count);
      
      if (!formattedActivities[date]) {
        formattedActivities[date] = {};
      }
      
      formattedActivities[date][type] = count;
    });
    
    return res.status(200).json(formattedActivities);
  } catch (error) {
    console.error('Error getting daily activities:', error);
    return res.status(500).json({ message: 'Failed to fetch daily activities' });
  }
}; 