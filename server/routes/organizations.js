const express = require('express');
const router = express.Router();
const { Organization, Contact, Deal } = require('../models');
const { authenticateToken, checkPermission } = require('../middlewares/auth.middleware');

// Create organization
router.post('/', authenticateToken, checkPermission('create', 'organizations'), async (req, res) => {
  try {
    const { name, industry, website } = req.body;
    const organization = await Organization.create({
      name,
      industry,
      website
    });
    res.status(201).json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Error creating organization', error: error.message });
  }
});

// Get organization by ID
router.get('/:id', authenticateToken, checkPermission('read', 'organizations'), async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id, {
      include: [
        {
          model: Contact,
          as: 'contacts',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'title']
        },
        {
          model: Deal,
          as: 'deals',
          attributes: ['id', 'name', 'value', 'stage', 'status']
        }
      ]
    });
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organization', error: error.message });
  }
});

// Update organization
router.put('/:id', authenticateToken, checkPermission('update', 'organizations'), async (req, res) => {
  try {
    const { name, industry, website } = req.body;
    const organization = await Organization.findByPk(req.params.id);
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    await organization.update({
      name,
      industry,
      website
    });
    
    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Error updating organization', error: error.message });
  }
});

// Delete organization
router.delete('/:id', authenticateToken, checkPermission('delete', 'organizations'), async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id);
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    await organization.destroy();
    res.json({ message: 'Organization deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting organization', error: error.message });
  }
});

// List organizations with pagination and search
router.get('/', authenticateToken, checkPermission('read', 'organizations'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = search ? {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { industry: { [Op.iLike]: `%${search}%` } }
      ]
    } : {};
    
    const { count, rows } = await Organization.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Contact,
          as: 'contacts',
          attributes: ['id']
        },
        {
          model: Deal,
          as: 'deals',
          attributes: ['id']
        }
      ]
    });
    
    res.json({
      organizations: rows,
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organizations', error: error.message });
  }
});

module.exports = router; 