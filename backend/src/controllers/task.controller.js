const db = require('../models');
const Task = db.tasks;
const User = db.users;
const Lead = db.leads;
const { Op } = require('sequelize');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { lead_id, task_type, due_date, due_time, description, priority, assigned_to, is_complete } = req.body;
    
    // Validate required fields
    if (!lead_id || !task_type || !due_date || !due_time || !description || !priority) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // If no assigned_to is provided, assign to the current user
    const assigneeId = assigned_to || req.userId;
    
    // Check if the lead exists
    const lead = await Lead.findByPk(lead_id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    // Check if the assignee exists
    const assignee = await User.findByPk(assigneeId);
    if (!assignee) {
      return res.status(404).json({ message: 'Assignee not found' });
    }
    
    // Admin can assign tasks to anyone, but reps can only assign to themselves
    if (req.userRole !== 'admin' && assigneeId !== req.userId) {
      return res.status(403).json({ message: 'You can only create tasks for yourself' });
    }
    
    // Create the task
    const task = await Task.create({
      lead_id,
      assigned_to: assigneeId,
      task_type,
      due_date,
      due_time,
      description,
      priority,
      is_complete: is_complete || false
    });
    
    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

// Get tasks with filtering options
exports.getTasks = async (req, res) => {
  try {
    const { lead_id, teamwide, status, priority, due_date, is_complete } = req.query;
    
    // Build filter conditions
    const whereConditions = {};
    
    // Filter by lead if provided
    if (lead_id) {
      whereConditions.lead_id = lead_id;
    }
    
    // Filter by priority if provided
    if (priority) {
      whereConditions.priority = priority;
    }
    
    // Filter by due date if provided
    if (due_date) {
      whereConditions.due_date = due_date;
    }
    
    // Filter by completion status if provided
    if (is_complete !== undefined) {
      whereConditions.is_complete = is_complete === 'true';
    }
    
    // For regular users (not admin), show only their tasks unless teamwide=true and they're admin
    if (req.userRole !== 'admin' || teamwide !== 'true') {
      whereConditions.assigned_to = req.userId;
    }
    
    // Get tasks with associated lead and user data
    const tasks = await Task.findAll({
      where: whereConditions,
      include: [
        {
          model: Lead,
          as: 'lead',
          attributes: ['id', 'doctor_name', 'clinic_name']
        },
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'username', 'name']
        }
      ],
      order: [
        ['due_date', 'ASC'],
        ['due_time', 'ASC']
      ]
    });
    
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { task_type, due_date, due_time, description, priority, assigned_to, is_complete } = req.body;
    
    // Find the task
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user has permission to update the task
    if (req.userRole !== 'admin' && task.assigned_to !== req.userId) {
      return res.status(403).json({ message: 'You can only update your own tasks' });
    }
    
    // If trying to reassign, check if user is admin
    if (assigned_to && assigned_to !== task.assigned_to && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Only admins can reassign tasks' });
    }
    
    // Check if new assignee exists if provided
    if (assigned_to) {
      const assignee = await User.findByPk(assigned_to);
      if (!assignee) {
        return res.status(404).json({ message: 'Assignee not found' });
      }
    }
    
    // Update the task
    await task.update({
      task_type: task_type || task.task_type,
      due_date: due_date || task.due_date,
      due_time: due_time || task.due_time,
      description: description || task.description,
      priority: priority || task.priority,
      assigned_to: assigned_to || task.assigned_to,
      is_complete: is_complete !== undefined ? is_complete : task.is_complete
    });
    
    res.status(200).json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
};

// Toggle task completion status
exports.toggleTaskCompletion = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { is_complete } = req.body;
    
    // Find the task
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user has permission to update the task
    // Admin can mark any task as complete, reps can only mark their own tasks
    if (req.userRole !== 'admin' && task.assigned_to !== req.userId) {
      return res.status(403).json({ message: 'You can only update your own tasks' });
    }
    
    // Update the task completion status
    await task.update({
      is_complete: is_complete !== undefined ? is_complete : !task.is_complete
    });
    
    res.status(200).json({
      message: `Task marked as ${task.is_complete ? 'complete' : 'incomplete'}`,
      task
    });
  } catch (error) {
    console.error('Error updating task completion:', error);
    res.status(500).json({ message: 'Failed to update task completion status', error: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // Find the task
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user has permission to delete the task
    if (req.userRole !== 'admin' && task.assigned_to !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own tasks' });
    }
    
    // Delete the task
    await task.destroy();
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
}; 