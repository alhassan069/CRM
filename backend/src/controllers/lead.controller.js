const db = require('../models');
const Lead = db.leads;
const LeadStatus = db.leadStatuses;
const User = db.users;
const { Op } = require('sequelize');

// Get all leads with filtering options
exports.getAllLeads = async (req, res) => {
  try {
    const { 
      status, 
      assigned_to, 
      search, 
      page = 1, 
      limit = 10 
    } = req.query;
    
    // Build filter conditions
    const whereConditions = {};
    
    // Filter by status if provided
    if (status) {
      whereConditions.status_id = status;
    }
    
    // Filter by assigned rep if provided
    if (assigned_to) {
      whereConditions.assigned_to = assigned_to;
    } else if (req.userRole === 'rep') {
      // If user is a sales rep, only show their leads
      whereConditions.assigned_to = req.userId;
    }
    
    // Search by doctor name or clinic name
    if (search) {
      whereConditions[Op.or] = [
        { doctor_name: { [Op.like]: `%${search}%` } },
        { clinic_name: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Get leads with associated status and user
    const leads = await Lead.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: offset,
      include: [
        {
          model: LeadStatus,
          as: 'status',
          attributes: ['id', 'label', 'level']
        },
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'username', 'name']
        }
      ],
      order: [['updated_at', 'DESC']]
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(leads.count / limit);
    
    return res.status(200).json({
      data: leads.rows,
      pagination: {
        total: leads.count,
        page: parseInt(page),
        totalPages,
        limit: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({ message: 'Failed to fetch leads', error: error.message });
  }
};

// Get lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const leadId = req.params.id;
    
    const lead = await Lead.findByPk(leadId, {
      include: [
        {
          model: LeadStatus,
          as: 'status',
          attributes: ['id', 'label', 'level']
        },
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'username', 'name']
        }
      ]
    });
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    // Check if user is authorized to view this lead
    if (req.userRole === 'rep' && lead.assigned_to !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to view this lead' });
    }
    
    return res.status(200).json(lead);
    
  } catch (error) {
    console.error('Error fetching lead:', error);
    return res.status(500).json({ message: 'Failed to fetch lead', error: error.message });
  }
};

// Create new lead
exports.createLead = async (req, res) => {
  try {
    const leadData = req.body;
    
    // If user is a sales rep, assign the lead to themselves
    if (req.userRole === 'rep') {
      leadData.assigned_to = req.userId;
    }
    
    // Set default status to "New Lead" (assuming id 1 is "New Lead")
    const newLeadStatus = await LeadStatus.findOne({
      where: { label: 'New Lead' }
    });
    
    if (newLeadStatus) {
      leadData.status_id = newLeadStatus.id;
      leadData.status_level = newLeadStatus.level;
    }
    
    const lead = await Lead.create(leadData);
    
    return res.status(201).json({
      message: 'Lead created successfully',
      lead
    });
    
  } catch (error) {
    console.error('Error creating lead:', error);
    return res.status(500).json({ message: 'Failed to create lead', error: error.message });
  }
};

// Update lead
exports.updateLead = async (req, res) => {
  try {
    const leadId = req.params.id;
    const leadData = req.body;
    
    // Find the lead
    const lead = await Lead.findByPk(leadId);
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    // Check if user is authorized to update this lead
    if (req.userRole === 'rep' && lead.assigned_to !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to update this lead' });
    }
    
    // Don't allow status update through this endpoint
    delete leadData.status_id;
    delete leadData.status_level;
    
    // Update lead
    await lead.update(leadData);
    
    return res.status(200).json({
      message: 'Lead updated successfully',
      lead
    });
    
  } catch (error) {
    console.error('Error updating lead:', error);
    return res.status(500).json({ message: 'Failed to update lead', error: error.message });
  }
};

// Update lead status with validation rules
exports.updateLeadStatus = async (req, res) => {
  try {
    const leadId = req.params.id;
    const { status_id, reason_for_loss } = req.body;
    
    // Find the lead
    const lead = await Lead.findByPk(leadId, {
      include: [
        {
          model: LeadStatus,
          as: 'status',
          attributes: ['id', 'label', 'level']
        }
      ]
    });
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    // Check if user is authorized to update this lead
    if (req.userRole === 'rep' && lead.assigned_to !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to update this lead status' });
    }
    
    // Find the new status
    const newStatus = await LeadStatus.findByPk(status_id);
    
    if (!newStatus) {
      return res.status(404).json({ message: 'Status not found' });
    }
    
    // Validate status transition
    if (lead.status) {
      const currentLevel = lead.status.level;
      const newLevel = newStatus.level;
      
      // Check if moving to a higher level or within the same level
      if (newLevel < currentLevel) {
        return res.status(400).json({ 
          message: 'Invalid status transition. Cannot move to a lower level status.' 
        });
      }
      
      // Special case: Transition to "Lost" (level 6)
      if (newLevel === 6) {
        // Check if current status is either "Contacted - Not Interested" (level 2) or "Post-Demo Follow-up" (level 4)
        const allowedLostTransitionLevels = [2, 4];
        if (!allowedLostTransitionLevels.includes(currentLevel)) {
          return res.status(400).json({ 
            message: 'Invalid transition to Lost status. Can only mark as Lost from specific statuses.' 
          });
        }
        
        // Reason for loss is required when marking as lost
        if (!reason_for_loss) {
          return res.status(400).json({ 
            message: 'Reason for loss is required when marking a lead as Lost' 
          });
        }
      }
    }
    
    // Update lead status
    await lead.update({
      status_id: newStatus.id,
      status_level: newStatus.level,
      reason_for_loss: newStatus.level === 6 ? reason_for_loss : null
    });
    
    return res.status(200).json({
      message: 'Lead status updated successfully',
      lead: {
        ...lead.toJSON(),
        status: newStatus
      }
    });
    
  } catch (error) {
    console.error('Error updating lead status:', error);
    return res.status(500).json({ message: 'Failed to update lead status', error: error.message });
  }
};

// Delete lead (not in requirements, but added for completeness)
exports.deleteLead = async (req, res) => {
  try {
    const leadId = req.params.id;
    
    const lead = await Lead.findByPk(leadId);
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    // Only admins can delete leads
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete leads' });
    }
    
    await lead.destroy();
    
    return res.status(200).json({ message: 'Lead deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting lead:', error);
    return res.status(500).json({ message: 'Failed to delete lead', error: error.message });
  }
};

// Get all available lead statuses
exports.getAllLeadStatuses = async (req, res) => {
  try {
    const statuses = await LeadStatus.findAll({
      order: [['level', 'ASC'], ['label', 'ASC']]
    });
    
    return res.status(200).json(statuses);
    
  } catch (error) {
    console.error('Error fetching lead statuses:', error);
    return res.status(500).json({ message: 'Failed to fetch lead statuses', error: error.message });
  }
};

// Assign or reassign a lead to a user (admin only)
exports.assignLead = async (req, res) => {
  try {
    const leadId = req.params.id;
    const { user_id } = req.body;

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }

    // Find the lead
    const lead = await Lead.findByPk(leadId);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Find the user to assign
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the assigned_to field
    await lead.update({ assigned_to: user_id });

    // Fetch updated lead with status and assigned user
    const updatedLead = await Lead.findByPk(leadId, {
      include: [
        { model: LeadStatus, as: 'status', attributes: ['id', 'label', 'level'] },
        { model: User, as: 'assignedUser', attributes: ['id', 'username', 'name'] }
      ]
    });

    return res.status(200).json({
      message: 'Lead assigned successfully',
      lead: updatedLead
    });
  } catch (error) {
    console.error('Error assigning lead:', error);
    return res.status(500).json({ message: 'Failed to assign lead', error: error.message });
  }
}; 