const express = require('express');
const router = express.Router();
const { Task, User } = require('../models');
const { authenticateToken, checkPermission } = require('../middlewares/auth.middleware');
const { Op } = require('sequelize');

// Create task
router.post('/', authenticateToken, checkPermission('create', 'tasks'), async (req, res) => {
  try {
    const {
      title,
      description,
      assigned_to,
      related_to_type,
      related_to_id,
      due_date,
      priority,
      status
    } = req.body;

    const task = await Task.create({
      title,
      description,
      assigned_to,
      related_to_type,
      related_to_id,
      due_date,
      priority: priority || 'medium',
      status: status || 'pending'
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});

// Get task by ID
router.get('/:id', authenticateToken, checkPermission('read', 'tasks'), async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
});

// Update task
router.put('/:id', authenticateToken, checkPermission('update', 'tasks'), async (req, res) => {
  try {
    const {
      title,
      description,
      assigned_to,
      related_to_type,
      related_to_id,
      due_date,
      priority,
      status
    } = req.body;

    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.update({
      title,
      description,
      assigned_to,
      related_to_type,
      related_to_id,
      due_date,
      priority,
      status
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});

// Delete task
router.delete('/:id', authenticateToken, checkPermission('delete', 'tasks'), async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

// List tasks with pagination, search, and filters
router.get('/', authenticateToken, checkPermission('read', 'tasks'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      assigned_to,
      related_to_type,
      related_to_id,
      priority,
      status,
      start_date,
      end_date
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (assigned_to) {
      whereClause.assigned_to = assigned_to;
    }

    if (related_to_type) {
      whereClause.related_to_type = related_to_type;
    }

    if (related_to_id) {
      whereClause.related_to_id = related_to_id;
    }

    if (priority) {
      whereClause.priority = priority;
    }

    if (status) {
      whereClause.status = status;
    }

    if (start_date || end_date) {
      whereClause.due_date = {};
      if (start_date) whereClause.due_date[Op.gte] = start_date;
      if (end_date) whereClause.due_date[Op.lte] = end_date;
    }

    const { count, rows } = await Task.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'name']
        }
      ]
    });

    res.json({
      tasks: rows,
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

// Mark task as completed
router.patch('/:id/complete', authenticateToken, checkPermission('update', 'tasks'), async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.update({
      status: 'completed',
      completed_at: new Date()
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error completing task', error: error.message });
  }
});

module.exports = router; 