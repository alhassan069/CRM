const aiService = require('../services/ai.service');
const db = require('../models');
const Lead = db.leads;
const Activity = db.activities;
const LeadStatus = db.leadStatuses;

/**
 * Generate deal coach advice for a specific lead
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDealCoachAdvice = async (req, res) => {
  try {
    const leadId = req.params.id;
    
    // Get lead with activities and status
    const lead = await Lead.findByPk(leadId, {
      include: [
        { model: Activity },
        { model: LeadStatus, as: 'status' }
      ]
    });
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    const advice = await aiService.generateDealCoachAdvice(lead);
    
    return res.status(200).json({ advice });
  } catch (error) {
    console.error('Error in getDealCoachAdvice:', error);
    return res.status(500).json({ 
      message: 'Failed to generate deal coach advice',
      error: error.message 
    });
  }
};

/**
 * Generate customer persona for a specific lead
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getCustomerPersona = async (req, res) => {
  try {
    const leadId = req.params.id;
    
    // Get lead with activities
    const lead = await Lead.findByPk(leadId, {
      include: [{ model: Activity }]
    });
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    const persona = await aiService.generateCustomerPersona(lead);
    
    return res.status(200).json({ persona });
  } catch (error) {
    console.error('Error in getCustomerPersona:', error);
    return res.status(500).json({ 
      message: 'Failed to generate customer persona',
      error: error.message 
    });
  }
};

/**
 * Handle objection from request body
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.handleObjection = async (req, res) => {
  try {
    const { objection } = req.body;
    
    if (!objection) {
      return res.status(400).json({ message: 'Objection text is required' });
    }
    
    const responses = await aiService.handleObjection(objection);
    
    return res.status(200).json({ responses });
  } catch (error) {
    console.error('Error in handleObjection:', error);
    return res.status(500).json({ 
      message: 'Failed to generate objection responses',
      error: error.message 
    });
  }
};

/**
 * Generate win-loss insights based on converted and lost leads
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getWinLossInsights = async (req, res) => {
  try {
    // Get converted leads (status level 5)
    const wonLeads = await Lead.findAll({
      where: { status_level: 5 },
      include: [{ model: Activity }],
      limit: 100
    });
    
    // Get lost leads (status level 6)
    const lostLeads = await Lead.findAll({
      where: { status_level: 6 },
      include: [{ model: Activity }],
      limit: 100
    });
    
    const insights = await aiService.generateWinLossInsights(wonLeads, lostLeads);
    
    return res.status(200).json({ insights });
  } catch (error) {
    console.error('Error in getWinLossInsights:', error);
    return res.status(500).json({ 
      message: 'Failed to generate win-loss insights',
      error: error.message 
    });
  }
}; 