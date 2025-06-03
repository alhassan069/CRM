import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi } from '../../lib/api';
import { AlertCircle } from 'lucide-react';

// Simple bar chart component
const BarChart = ({ data }) => {
  // Extract all activity types from the data
  const activityTypes = Array.from(
    new Set(
      Object.values(data).flatMap(day => Object.keys(day))
    )
  );
  
  // Get all dates and sort them
  const dates = Object.keys(data).sort();
  
  // Define colors for different activity types
  const activityColors = {
    'Call': '#3B82F6',    // blue
    'Email': '#10B981',   // green
    'WhatsApp': '#8B5CF6', // purple
    'Meeting': '#F59E0B'  // amber
  };
  
  // Find the maximum value for scaling
  const maxValue = Math.max(
    ...Object.values(data).flatMap(day => 
      Object.values(day)
    )
  );
  
  return (
    <div className="mt-4">
      <div className="flex h-64">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between pr-2 text-xs text-gray-500">
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              {Math.round((maxValue / 4) * (4 - i))}
            </div>
          ))}
        </div>
        
        {/* Chart area */}
        <div className="flex-1">
          <div className="flex h-full">
            {dates.map(date => {
              const dayData = data[date];
              const formattedDate = new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              });
              
              return (
                <div key={date} className="flex-1 flex flex-col">
                  {/* Bars */}
                  <div className="flex-1 flex items-end">
                    <div className="w-full flex justify-center">
                      {activityTypes.map(type => {
                        const value = dayData[type] || 0;
                        const height = value ? (value / maxValue) * 100 : 0;
                        
                        return (
                          <div
                            key={type}
                            className="mx-1 w-3 rounded-t"
                            style={{
                              height: `${height}%`,
                              backgroundColor: activityColors[type] || '#CBD5E1'
                            }}
                            title={`${type}: ${value}`}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* X-axis labels */}
                  <div className="text-xs text-center text-gray-500 mt-2">
                    {formattedDate}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-4 mt-4">
            {activityTypes.map(type => (
              <div key={type} className="flex items-center text-xs">
                <div 
                  className="w-3 h-3 mr-1 rounded-sm" 
                  style={{ backgroundColor: activityColors[type] || '#CBD5E1' }}
                ></div>
                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DailyActivitiesChart = ({ teamwide = false, days = 7 }) => {
  const [activities, setActivities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await dashboardApi.getDailyActivities(days, teamwide && isAdmin);
        setActivities(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching daily activities:', err);
        setError('Failed to load activity data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [teamwide, isAdmin, days]);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Daily Activities</h2>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Daily Activities</h2>
        <div className="flex items-center text-red-500">
          <AlertCircle size={20} className="mr-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const hasData = Object.keys(activities).length > 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Daily Activities</h2>
      
      {!hasData ? (
        <p className="text-gray-500 text-center py-12">No activity data available for the selected period.</p>
      ) : (
        <BarChart data={activities} />
      )}
    </div>
  );
};

export default DailyActivitiesChart; 