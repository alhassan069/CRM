const db = require('../models');
const Activity = db.activities;
const Lead = db.leads;
const User = db.users;

/**
 * Create a new activity for a lead
 */
exports.createActivity = async (req, res) => {
  try {
    const leadId = parseInt(req.params.id);
    const userId = req.userId;
    
    // Check if lead exists
    const lead = await Lead.findByPk(leadId);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    // Create activity
    const { type, activity_time, duration_mins, outcome, summary, full_notes } = req.body;
    
    // Validate required fields
    if (!type || !activity_time || !outcome || !summary) {
      return res.status(400).json({ 
        message: 'Missing required fields. Type, activity_time, outcome, and summary are required.' 
      });
    }
    
    // Validate type enum
    const validTypes = ['Call', 'Email', 'WhatsApp', 'Meeting'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        message: 'Invalid activity type. Must be one of: Call, Email, WhatsApp, Meeting' 
      });
    }

    
    // Create the activity
    const newActivity = await Activity.create({
      lead_id: leadId,
      user_id: userId,
      type,
      activity_time,
      duration_mins: type === 'Call' ? parseInt(duration_mins) : null, // Only store duration for calls
      outcome,
      summary,
      full_notes: full_notes || null
    });
    
    // Update the lead's updated_at timestamp
    await lead.update({ updated_at: new Date() });
    
    return res.status(201).json({
      message: 'Activity created successfully',
      activity: newActivity
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    return res.status(500).json({ message: 'Failed to create activity', error: error.message });
  }
};

/**
 * Get all activities for a specific lead
 */
exports.getActivitiesByLead = async (req, res) => {
  try {
    const leadId = parseInt(req.params.id);
    
    // Check if lead exists
    const lead = await Lead.findByPk(leadId);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    // Get all activities for this lead
    const activities = await Activity.findAll({
      where: { lead_id: leadId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'username']
        }
      ],
      order: [['activity_time', 'DESC']] // Most recent activities first
    });
    
    return res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return res.status(500).json({ message: 'Failed to fetch activities', error: error.message });
  }
};

/**
 * Get all activities for a user (for dashboard)
 */
exports.getUserActivities = async (req, res) => {
  try {
    const userId = req.userId;
    const days = req.query.days ? parseInt(req.query.days) : 7; // Default to 7 days
    
    // Calculate the date for N days ago
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get all activities for this user within the date range
    const activities = await Activity.findAll({
      where: { 
        user_id: userId,
        activity_time: {
          [db.Sequelize.Op.gte]: startDate
        }
      },
      include: [
        {
          model: Lead,
          attributes: ['id', 'doctor_name', 'clinic_name']
        }
      ],
      order: [['activity_time', 'DESC']]
    });
    
    return res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return res.status(500).json({ message: 'Failed to fetch user activities', error: error.message });
  }
}; 