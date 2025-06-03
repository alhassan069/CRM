import { fetchWithAuth } from '../lib/api';

const API_URL = 'http://localhost:3001/api';

// Task service for handling task-related API calls
const taskService = {
  // Get tasks with optional filtering
  getTasks: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params if provided
    if (filters.lead_id) queryParams.append('lead_id', filters.lead_id);
    if (filters.teamwide) queryParams.append('teamwide', filters.teamwide);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.due_date) queryParams.append('due_date', filters.due_date);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchWithAuth(`/tasks${queryString}`);
  },
  
  // Get tasks for a specific lead
  getTasksByLead: async (leadId) => {
    return fetchWithAuth(`/tasks?lead_id=${leadId}`);
  },
  
  // Create a new task
  createTask: async (taskData) => {
    return fetchWithAuth('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  },
  
  // Update an existing task
  updateTask: async (taskId, taskData) => {
    return fetchWithAuth(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
  },
  
  // Delete a task
  deleteTask: async (taskId) => {
    return fetchWithAuth(`/tasks/${taskId}`, {
      method: 'DELETE'
    });
  }
};

export default taskService; 