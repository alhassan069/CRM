import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const tasks = [
  {
    id: 1,
    title: "Follow up with Enterprise Client",
    priority: "high",
    dueDate: "Today",
    completed: false,
  },
  {
    id: 2,
    title: "Prepare proposal for Tech Corp",
    priority: "medium",
    dueDate: "Tomorrow",
    completed: false,
  },
  {
    id: 3,
    title: "Schedule demo with Startup Inc",
    priority: "low",
    dueDate: "Next Week",
    completed: true,
  },
  {
    id: 4,
    title: "Update contact information",
    priority: "medium",
    dueDate: "Today",
    completed: false,
  },
];

const priorityColors = {
  high: "destructive",
  medium: "warning",
  low: "default",
};

export function TasksOverview() {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between space-x-4 rounded-lg border p-4"
        >
          <div className="flex items-center space-x-4">
            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              className="h-4 w-4"
            />
            <div className="space-y-1">
              <label
                htmlFor={`task-${task.id}`}
                className={`text-sm font-medium leading-none ${
                  task.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.title}
              </label>
              <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
            </div>
          </div>
          <Badge variant={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
        </div>
      ))}
    </div>
  );
} 