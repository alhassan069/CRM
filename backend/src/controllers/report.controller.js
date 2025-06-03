const db = require('../models');
const { Op } = require('sequelize');
const Lead = db.leads;
const User = db.users;
const Activity = db.activities;
const LeadStatus = db.leadStatuses;

/**
 * Get conversion funnel data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getConversionFunnel = async (req, res) => {
  try {
    // Get all statuses ordered by level
    const statuses = await LeadStatus.findAll({
      order: [['level', 'ASC']]
    });

    // Get count of leads for each status
    const funnelData = await Promise.all(
      statuses.map(async (status) => {
        const count = await Lead.count({
          where: { status_id: status.id }
        });
        return {
          status: status.label,
          level: status.level,
          count
        };
      })
    );

    return res.status(200).json(funnelData);
  } catch (error) {
    console.error('Error getting conversion funnel:', error);
    return res.status(500).json({ 
      message: 'Failed to fetch conversion funnel data',
      error: error.message 
    });
  }
};

/**
 * Get leads converted by sales rep
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getLeadsByRep = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const whereClause = { status_level: 5 }; // Converted leads

    // Add date range if provided
    if (startDate && endDate) {
      whereClause.updated_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Get converted leads grouped by sales rep
    const leadsByRep = await Lead.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'name']
        }
      ],
      attributes: [
        'assigned_to',
        [db.sequelize.fn('COUNT', db.sequelize.col('lead.id')), 'converted_count']
      ],
      group: ['lead.assigned_to', 'assignedUser.id', 'assignedUser.name']
    });

    // Format the response
    const formattedData = leadsByRep.map(item => ({
      repId: item.assigned_to,
      repName: item.assignedUser ? item.assignedUser.name : 'Unassigned',
      convertedCount: parseInt(item.dataValues.converted_count)
    }));

    return res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error getting leads by rep:', error);
    return res.status(500).json({ 
      message: 'Failed to fetch leads by rep data',
      error: error.message 
    });
  }
};

/**
 * Get activity metrics by rep
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getActivityMetrics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const whereClause = {};

    // Add date range if provided
    if (startDate && endDate) {
      whereClause.activity_time = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Get activity counts grouped by type and rep
    const activityMetrics = await Activity.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ],
      attributes: [
        [db.sequelize.col('activity.user_id'), 'user_id'],
        [db.sequelize.col('activity.type'), 'type'],
        [db.sequelize.fn('COUNT', db.sequelize.col('activity.id')), 'count']
      ],
      group: ['activity.user_id', 'activity.type', 'user.id', 'user.name']
    });

    // Format the response
    const formattedData = {};
    activityMetrics.forEach(metric => {
      const userId = metric.user_id;
      const userName = metric.user ? metric.user.name : 'Unknown';
      const type = metric.type;
      const count = parseInt(metric.dataValues.count);

      if (!formattedData[userId]) {
        formattedData[userId] = {
          repId: userId,
          repName: userName,
          activities: {}
        };
      }

      formattedData[userId].activities[type] = count;
    });

    return res.status(200).json(Object.values(formattedData));
  } catch (error) {
    console.error('Error getting activity metrics:', error);
    return res.status(500).json({ 
      message: 'Failed to fetch activity metrics',
      error: error.message 
    });
  }
};

/**
 * Get lead source effectiveness
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getLeadSourceEffectiveness = async (req, res) => {
  try {
    // Get all leads grouped by source and status
    const sourceData = await Lead.findAll({
      attributes: [
        'source_of_lead',
        'status_level',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: ['source_of_lead', 'status_level']
    });

    // Format the response
    const formattedData = {};
    sourceData.forEach(item => {
      const source = item.source_of_lead;
      const statusLevel = item.status_level;
      const count = parseInt(item.dataValues.count);

      if (!formattedData[source]) {
        formattedData[source] = {
          source,
          total: 0,
          converted: 0,
          lost: 0
        };
      }

      formattedData[source].total += count;
      if (statusLevel === 5) formattedData[source].converted += count;
      if (statusLevel === 6) formattedData[source].lost += count;
    });

    // Calculate conversion rates
    Object.values(formattedData).forEach(source => {
      source.conversionRate = source.total > 0 
        ? ((source.converted / source.total) * 100).toFixed(2)
        : 0;
    });

    return res.status(200).json(Object.values(formattedData));
  } catch (error) {
    console.error('Error getting lead source effectiveness:', error);
    return res.status(500).json({ 
      message: 'Failed to fetch lead source effectiveness data',
      error: error.message 
    });
  }
}; 