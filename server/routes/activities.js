const express = require('express');
const router = express.Router();
const { Activity, User } = require('../models');
const { authenticateToken, checkPermission } = require('../middlewares/auth.middleware');
const { Op } = require('sequelize');

// Create activity
router.post('/', authenticateToken, checkPermission('create', 'activities'), async (req, res) => {
  try {
    const {
      type,
      subject,
      description,
      related_to_type,
      related_to_id,
      due_date,
      status
    } = req.body;

    const activity = await Activity.create({
      type,
      subject,
      description,
      related_to_type,
      related_to_id,
      created_by: req.user.id,
      due_date,
      status: status || 'pending'
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error creating activity', error: error.message });
  }
});

// Get activity by ID
router.get('/:id', authenticateToken, checkPermission('read', 'activities'), async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity', error: error.message });
  }
});

// Update activity
router.put('/:id', authenticateToken, checkPermission('update', 'activities'), async (req, res) => {
  try {
    const {
      type,
      subject,
      description,
      related_to_type,
      related_to_id,
      due_date,
      status
    } = req.body;

    const activity = await Activity.findByPk(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    await activity.update({
      type,
      subject,
      description,
      related_to_type,
      related_to_id,
      due_date,
      status
    });

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error updating activity', error: error.message });
  }
});

// Delete activity
router.delete('/:id', authenticateToken, checkPermission('delete', 'activities'), async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    await activity.destroy();
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting activity', error: error.message });
  }
});

// List activities with pagination, search, and filters
router.get('/', authenticateToken, checkPermission('read', 'activities'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      related_to_type,
      related_to_id,
      created_by,
      status,
      start_date,
      end_date
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { subject: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (type) {
      whereClause.type = type;
    }

    if (related_to_type) {
      whereClause.related_to_type = related_to_type;
    }

    if (related_to_id) {
      whereClause.related_to_id = related_to_id;
    }

    if (created_by) {
      whereClause.created_by = created_by;
    }

    if (status) {
      whereClause.status = status;
    }

    if (start_date || end_date) {
      whereClause.due_date = {};
      if (start_date) whereClause.due_date[Op.gte] = start_date;
      if (end_date) whereClause.due_date[Op.lte] = end_date;
    }

    const { count, rows } = await Activity.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name']
        }
      ]
    });

    res.json({
      activities: rows,
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
});

module.exports = router; 