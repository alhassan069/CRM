import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Loader2, Plus, Phone, Mail, MessageSquare, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import api from '../../lib/axios';
import ActivityForm from './ActivityForm';

const ActivityLog = ({ leadId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch activities for this lead
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/leads/${leadId}/activities`);
      setActivities(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to fetch activities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (leadId) {
      fetchActivities();
    }
  }, [leadId]);

  // Handle activity creation
  const handleActivityCreated = (newActivity) => {
    setActivities([newActivity, ...activities]);
    setShowForm(false);
  };

  // Get icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'Call':
        return <Phone className="h-4 w-4" />;
      case 'Email':
        return <Mail className="h-4 w-4" />;
      case 'WhatsApp':
        return <MessageSquare className="h-4 w-4" />;
      case 'Meeting':
        return <Users className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Get color for activity outcome
  const getOutcomeColor = (outcome) => {
    if (outcome.toLowerCase().includes('successful')) {
      return 'bg-green-100 text-green-800';
    } else if (outcome.toLowerCase().includes('unsuccessful')) {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Activity log header with add button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Activity Log</h3>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-1" /> Log Activity
        </Button>
      </div>

      {/* Activity form */}
      {showForm && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Log New Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityForm 
              leadId={leadId} 
              onSuccess={handleActivityCreated}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Activities list */}
      {activities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No activities logged yet. Use the "Log Activity" button to add one.
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <Card key={activity.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{activity.type}</h4>
                        <Badge className={getOutcomeColor(activity.outcome)}>
                          {activity.outcome}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(activity.activity_time), 'PPP p')}
                        {activity.duration_mins && ` • ${activity.duration_mins} mins`}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    By {activity.user?.name || 'Unknown'}
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                <div className="space-y-2">
                  <p className="font-medium">{activity.summary}</p>
                  {activity.full_notes && (
                    <p className="text-sm whitespace-pre-wrap">{activity.full_notes}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityLog; 