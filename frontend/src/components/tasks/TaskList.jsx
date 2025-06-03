import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { tasksApi } from '../../lib/api';
import { PlusCircle, Pencil, Trash2, CheckCircle, Circle } from 'lucide-react';
import TaskForm from './TaskForm';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { useAuth } from '../../context/AuthContext';
import { Checkbox } from '../ui/checkbox';

const TaskList = ({ leadId, teamwide = false }) => {
  const { isAdmin, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [filter, setFilter] = useState({ is_complete: undefined });
  const submitFormRef = useRef(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      let response;
      if (leadId) {
        response = await tasksApi.getTasksByLead(leadId);
      } else {
        response = await tasksApi.getTasks({ 
          teamwide,
          ...filter
        });
      }
      setTasks(response);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [leadId, teamwide, filter]);

  const handleTaskSuccess = () => {
    setIsFormOpen(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleSubmitForm = async () => {
    if (submitFormRef.current) {
      setIsSaving(true);
      const success = await submitFormRef.current();
      setIsSaving(false);
      if (success) {
        setIsFormOpen(false);
        setEditingTask(null);
        fetchTasks();
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksApi.deleteTask(taskId);
        fetchTasks();
      } catch (err) {
        setError('Failed to delete task');
        console.error(err);
      }
    }
  };

  const handleToggleCompletion = async (taskId, currentStatus) => {
    try {
      await tasksApi.toggleTaskCompletion(taskId, !currentStatus);
      fetchTasks();
    } catch (err) {
      setError('Failed to update task status');
      console.error(err);
    }
  };

  const canEditTask = (task) => {
    return isAdmin || task.assigned_to === user.id;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Low':
        return 'text-green-500';
      default:
        return '';
    }
  };

  const formatDateTime = (date, time) => {
    return `${date} at ${time}`;
  };

  const handleFormSubmitRef = (submitFn) => {
    submitFormRef.current = submitFn;
  };

  const handleFilterChange = (value) => {
    setFilter(prev => ({ ...prev, is_complete: value }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <CardTitle>Tasks</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="filter-status" className="text-sm font-normal">Filter:</Label>
            <select 
              id="filter-status" 
              className="text-sm border rounded p-1"
              value={filter.is_complete === undefined ? 'all' : filter.is_complete ? 'completed' : 'active'}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'all') handleFilterChange(undefined);
                else if (val === 'completed') handleFilterChange(true);
                else handleFilterChange(false);
              }}
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>Add Task</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <TaskForm
                leadId={leadId}
                initialData={editingTask}
                onSuccess={handleTaskSuccess}
                onSubmitForm={handleFormSubmitRef}
              />
            </div>
            <SheetFooter className="mt-4">
              <Button onClick={handleSubmitForm} disabled={isSaving}>
                {isSaving ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
              </Button>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">Loading tasks...</div>
        ) : error ? (
          <div className="text-red-500 py-4">{error}</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No tasks found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Description</TableHead>
                {!leadId && <TableHead>Lead</TableHead>}
                {teamwide && <TableHead>Assigned To</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow 
                  key={task.id}
                  className={task.is_complete ? 'bg-gray-50 text-gray-500' : ''}
                >
                  <TableCell>
                    <Checkbox 
                      checked={task.is_complete}
                      onCheckedChange={() => {
                        if (canEditTask(task)) {
                          handleToggleCompletion(task.id, task.is_complete);
                        }
                      }}
                      disabled={!canEditTask(task)}
                    />
                  </TableCell>
                  <TableCell className={task.is_complete ? 'line-through' : ''}>
                    {task.task_type}
                  </TableCell>
                  <TableCell className={task.is_complete ? 'line-through' : ''}>
                    {formatDateTime(task.due_date, task.due_time)}
                  </TableCell>
                  <TableCell>
                    <span className={`${getPriorityColor(task.priority)} ${task.is_complete ? 'opacity-50' : ''}`}>
                      {task.priority}
                    </span>
                  </TableCell>
                  <TableCell className={`max-w-xs truncate ${task.is_complete ? 'line-through' : ''}`}>
                    {task.description}
                  </TableCell>
                  {!leadId && (
                    <TableCell className={task.is_complete ? 'line-through' : ''}>
                      {task.lead?.doctor_name || 'Unknown'} ({task.lead?.clinic_name || 'Unknown'})
                    </TableCell>
                  )}
                  {teamwide && (
                    <TableCell className={task.is_complete ? 'line-through' : ''}>
                      {task.assignedUser?.name || 'Unknown'}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {canEditTask(task) && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingTask(task);
                              setIsFormOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-500"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskList;


