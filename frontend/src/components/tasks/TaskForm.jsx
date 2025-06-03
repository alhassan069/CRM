import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { tasksApi, usersApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const TaskForm = ({ leadId, onSuccess, initialData = null, onCancel, onSubmitForm }) => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    task_type: initialData?.task_type || 'Follow-up Call',
    due_date: initialData?.due_date || new Date().toISOString().split('T')[0],
    due_time: initialData?.due_time || '09:00',
    description: initialData?.description || '',
    priority: initialData?.priority || 'Medium',
    assigned_to: initialData?.assigned_to || user?.id,
    lead_id: leadId || initialData?.lead_id,
    is_complete: initialData?.is_complete || false
  });

  // Fetch users for admin assignment
  useEffect(() => {
    if (isAdmin) {
      const fetchUsers = async () => {
        try {
          const data = await usersApi.getAllUsers();
          setUsers(data);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      fetchUsers();
    }
  }, [isAdmin]);

  const taskTypeOptions = [
    { value: 'Initial Outreach', label: 'Initial Outreach' },
    { value: 'Detailed/Demo Meet', label: 'Detailed/Demo Meet' },
    { value: 'Follow-up Call', label: 'Follow-up Call' },
    { value: 'Send Pricing', label: 'Send Pricing' }
  ];

  const priorityOptions = [
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Make the submit function available to parent components
  useEffect(() => {
    if (onSubmitForm) {
      onSubmitForm(submitForm);
    }
  }, [formData, initialData]);

  const submitForm = async () => {
    setLoading(true);
    setError('');

    try {
      if (initialData) {
        // Update existing task
        await tasksApi.updateTask(initialData.id, formData);
      } else {
        // Create new task
        await tasksApi.createTask(formData);
      }
      setLoading(false);
      if (onSuccess) onSuccess();
      return true;
    } catch (err) {
      setError(err.message || 'Failed to save task');
      setLoading(false);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitForm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-4">
      <div className="space-y-2">
        <Label htmlFor="task_type">Task Type</Label>
        <Select
          value={formData.task_type}
          onValueChange={(value) => handleSelectChange('task_type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select task type" />
          </SelectTrigger>
          <SelectContent>
            {taskTypeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date</Label>
          <Input
            id="due_date"
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="due_time">Due Time</Label>
          <Input
            id="due_time"
            name="due_time"
            type="time"
            value={formData.due_time}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={formData.priority}
          onValueChange={(value) => handleSelectChange('priority', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isAdmin && (
        <div className="space-y-2">
          <Label htmlFor="assigned_to">Assign To</Label>
          <Select
            value={formData.assigned_to?.toString()}
            onValueChange={(value) => handleSelectChange('assigned_to', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="is_complete"
          checked={formData.is_complete}
          onCheckedChange={(checked) => handleCheckboxChange('is_complete', checked)}
        />
        <Label htmlFor="is_complete" className="cursor-pointer">Mark as complete</Label>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}
    </form>
  );
};

export default TaskForm; 