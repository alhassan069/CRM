const express = require('express');
const router = express.Router();
const { Deal, Organization, Contact, User, DealCoachRecommendation, Objection, WinLossAnalysis } = require('../models');
const { authenticateToken, checkPermission } = require('../middlewares/auth.middleware');
const { Op } = require('sequelize');

// Create deal
router.post('/', authenticateToken, checkPermission('create', 'deals'), async (req, res) => {
  try {
    const {
      name,
      organization_id,
      contact_id,
      owner_id,
      value,
      expected_close_date,
      stage,
      probability
    } = req.body;

    const deal = await Deal.create({
      name,
      organization_id,
      contact_id,
      owner_id,
      value,
      expected_close_date,
      stage,
      probability
    });

    res.status(201).json(deal);
  } catch (error) {
    res.status(500).json({ message: 'Error creating deal', error: error.message });
  }
});

// Get deal by ID
router.get('/:id', authenticateToken, checkPermission('read', 'deals'), async (req, res) => {
  try {
    const deal = await Deal.findByPk(req.params.id, {
      include: [
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name', 'industry']
        },
        {
          model: Contact,
          as: 'contact',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        },
        {
          model: DealCoachRecommendation,
          as: 'recommendations',
          attributes: ['id', 'recommendation', 'rationale', 'priority', 'implemented']
        },
        {
          model: Objection,
          as: 'objections',
          attributes: ['id', 'objection_text', 'ai_response', 'was_used']
        },
        {
          model: WinLossAnalysis,
          as: 'winLossAnalysis',
          attributes: ['id', 'outcome', 'contributing_factors', 'ai_summary']
        }
      ]
    });

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deal', error: error.message });
  }
});

// Update deal
router.put('/:id', authenticateToken, checkPermission('update', 'deals'), async (req, res) => {
  try {
    const {
      name,
      organization_id,
      contact_id,
      owner_id,
      value,
      expected_close_date,
      stage,
      probability,
      status
    } = req.body;

    const deal = await Deal.findByPk(req.params.id);

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    await deal.update({
      name,
      organization_id,
      contact_id,
      owner_id,
      value,
      expected_close_date,
      stage,
      probability,
      status
    });

    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating deal', error: error.message });
  }
});

// Delete deal
router.delete('/:id', authenticateToken, checkPermission('delete', 'deals'), async (req, res) => {
  try {
    const deal = await Deal.findByPk(req.params.id);

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    await deal.destroy();
    res.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting deal', error: error.message });
  }
});

// List deals with pagination, search, and filters
router.get('/', authenticateToken, checkPermission('read', 'deals'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      organization_id,
      contact_id,
      owner_id,
      stage,
      status,
      min_value,
      max_value
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` };
    }

    if (organization_id) {
      whereClause.organization_id = organization_id;
    }

    if (contact_id) {
      whereClause.contact_id = contact_id;
    }

    if (owner_id) {
      whereClause.owner_id = owner_id;
    }

    if (stage) {
      whereClause.stage = stage;
    }

    if (status) {
      whereClause.status = status;
    }

    if (min_value || max_value) {
      whereClause.value = {};
      if (min_value) whereClause.value[Op.gte] = min_value;
      if (max_value) whereClause.value[Op.lte] = max_value;
    }

    const { count, rows } = await Deal.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name']
        },
        {
          model: Contact,
          as: 'contact',
          attributes: ['id', 'first_name', 'last_name']
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name']
        }
      ]
    });

    res.json({
      deals: rows,
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deals', error: error.message });
  }
});

// Update deal stage
router.patch('/:id/stage', authenticateToken, checkPermission('update', 'deals'), async (req, res) => {
  try {
    const { stage, probability } = req.body;
    const deal = await Deal.findByPk(req.params.id);

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    await deal.update({
      stage,
      probability
    });

    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating deal stage', error: error.message });
  }
});

module.exports = router; 