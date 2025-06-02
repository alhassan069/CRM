const express = require('express');
const router = express.Router();
const { Contact, Organization, Deal, ContactPersona } = require('../models');
const { authenticateToken, checkPermission } = require('../middlewares/auth.middleware');
const { Op } = require('sequelize');

// Create contact
router.post('/', authenticateToken, checkPermission('create', 'contacts'), async (req, res) => {
  try {
    const { first_name, last_name, email, phone, title, organization_id, assigned_to } = req.body;
    const contact = await Contact.create({
      first_name,
      last_name,
      email,
      phone,
      title,
      organization_id,
      assigned_to
    });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error creating contact', error: error.message });
  }
});

// Get contact by ID
router.get('/:id', authenticateToken, checkPermission('read', 'contacts'), async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id, {
      include: [
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name', 'industry']
        },
        {
          model: Deal,
          as: 'deals',
          attributes: ['id', 'name', 'value', 'stage', 'status']
        },
        {
          model: ContactPersona,
          as: 'persona',
          attributes: ['communication_preferences', 'pain_points', 'personality_summary', 'sales_approach_tips']
        }
      ]
    });
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact', error: error.message });
  }
});

// Update contact
router.put('/:id', authenticateToken, checkPermission('update', 'contacts'), async (req, res) => {
  try {
    const { first_name, last_name, email, phone, title, organization_id, assigned_to, status } = req.body;
    const contact = await Contact.findByPk(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    await contact.update({
      first_name,
      last_name,
      email,
      phone,
      title,
      organization_id,
      assigned_to,
      status
    });
    
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact', error: error.message });
  }
});

// Delete contact
router.delete('/:id', authenticateToken, checkPermission('delete', 'contacts'), async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    await contact.destroy();
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error: error.message });
  }
});

// List contacts with pagination, search, and filters
router.get('/', authenticateToken, checkPermission('read', 'contacts'), async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search,
      organization_id,
      assigned_to,
      status
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (organization_id) {
      whereClause.organization_id = organization_id;
    }
    
    if (assigned_to) {
      whereClause.assigned_to = assigned_to;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    const { count, rows } = await Contact.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name']
        }
      ]
    });
    
    res.json({
      contacts: rows,
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
});

module.exports = router; 