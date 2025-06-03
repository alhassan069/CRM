const API_URL = 'http://localhost:3001/api';

// Helper function for making authenticated API calls
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }
  
  return response.json();
};

// Dashboard API calls
export const dashboardApi = {
  // Get sales rep metrics
  getSalesRepMetrics: () => fetchWithAuth('/dashboard/metrics/rep'),
  
  // Get sales admin metrics
  getSalesAdminMetrics: () => fetchWithAuth('/dashboard/metrics/admin'),
  
  // Get user tasks
  getUserTasks: (teamwide = false) => fetchWithAuth(`/dashboard/tasks?teamwide=${teamwide}`),
  
  // Get lead status aggregation
  getLeadStatusAggregation: (teamwide = false) => fetchWithAuth(`/dashboard/leads/by-status?teamwide=${teamwide}`),
  
  // Get daily activities
  getDailyActivities: (days = 7, teamwide = false) => fetchWithAuth(`/dashboard/activities/daily?days=${days}&teamwide=${teamwide}`)
};

// Auth API calls
export const authApi = {
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Login failed: ${response.status}`);
    }
    
    return response.json();
  },
  
  logout: () => fetchWithAuth('/auth/logout', { method: 'POST' })
};

// Leads API calls (placeholder for future implementation)
export const leadsApi = {
  // To be implemented in Phase 5
};

// Tasks API calls
export const tasksApi = {
  // Get tasks with optional filtering
  getTasks: (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params if provided
    if (filters.lead_id) queryParams.append('lead_id', filters.lead_id);
    if (filters.teamwide) queryParams.append('teamwide', filters.teamwide);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.due_date) queryParams.append('due_date', filters.due_date);
    if (filters.is_complete !== undefined) queryParams.append('is_complete', filters.is_complete);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchWithAuth(`/tasks${queryString}`);
  },
  
  // Get tasks for a specific lead
  getTasksByLead: (leadId) => fetchWithAuth(`/tasks?lead_id=${leadId}`),
  
  // Create a new task
  createTask: (taskData) => fetchWithAuth('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData)
  }),
  
  // Update an existing task
  updateTask: (taskId, taskData) => fetchWithAuth(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(taskData)
  }),
  
  // Toggle task completion status
  toggleTaskCompletion: (taskId, isComplete) => fetchWithAuth(`/tasks/${taskId}/complete`, {
    method: 'PATCH',
    body: JSON.stringify({ is_complete: isComplete })
  }),
  
  // Delete a task
  deleteTask: (taskId) => fetchWithAuth(`/tasks/${taskId}`, {
    method: 'DELETE'
  })
};

// Users API calls
export const usersApi = {
  // Get all users
  getAllUsers: () => fetchWithAuth('/users'),
  
  // Get user by ID
  getUserById: (userId) => fetchWithAuth(`/users/${userId}`),
};

// Activities API calls (placeholder for future implementation)
export const activitiesApi = {
  // To be implemented in Phase 6
};

// AI API calls (placeholder for future implementation)
export const aiApi = {
  // To be implemented in Phase 8
};

export { fetchWithAuth }; 