import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const activities = [
  {
    id: 1,
    type: "deal",
    title: "New deal created",
    description: "Enterprise Software Deal",
    user: {
      name: "John Doe",
      avatar: "/avatars/01.png",
    },
    timestamp: "2 hours ago",
    status: "active",
  },
  {
    id: 2,
    type: "contact",
    title: "Contact updated",
    description: "Sarah Smith's information updated",
    user: {
      name: "Jane Smith",
      avatar: "/avatars/02.png",
    },
    timestamp: "4 hours ago",
    status: "completed",
  },
  {
    id: 3,
    type: "task",
    title: "Task completed",
    description: "Follow up with client",
    user: {
      name: "Mike Johnson",
      avatar: "/avatars/03.png",
    },
    timestamp: "1 day ago",
    status: "completed",
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>
              {activity.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {activity.title} - {activity.description}
            </p>
          </div>
          <div className="ml-auto flex flex-col items-end space-y-1">
            <Badge
              variant={activity.status === "completed" ? "default" : "secondary"}
            >
              {activity.status}
            </Badge>
            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 