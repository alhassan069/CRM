import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi } from '../../lib/api';
import { AlertCircle } from 'lucide-react';

// Simple pie chart component
const PieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  let currentAngle = 0;
  
  // Define some nice colors for the pie segments
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#6366F1', // indigo
    '#14B8A6', // teal
  ];

  return (
    <div className="relative w-full h-64 flex justify-center items-center">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {data.map((item, index) => {
          // Skip if count is 0
          if (item.count === 0) return null;
          
          const percentage = (item.count / total) * 100;
          const startAngle = currentAngle;
          const endAngle = startAngle + (percentage * 3.6); // 3.6 = 360 / 100
          
          // Calculate the SVG path for the pie segment
          const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
          
          // Determine if the arc should be drawn as a large arc
          const largeArcFlag = percentage > 50 ? 1 : 0;
          
          // Create the SVG path
          const path = `
            M 50 50
            L ${x1} ${y1}
            A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
            Z
          `;
          
          currentAngle = endAngle;
          
          return (
            <path
              key={item.status}
              d={path}
              fill={colors[index % colors.length]}
              stroke="#fff"
              strokeWidth="1"
            />
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-2 mt-4">
        {data.map((item, index) => (
          <div key={item.status} className="flex items-center text-sm">
            <div 
              className="w-3 h-3 mr-1 rounded-sm" 
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span>{item.status} ({item.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LeadsByStatusChart = ({ teamwide = false }) => {
  const [leadsByStatus, setLeadsByStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchLeadsByStatus = async () => {
      try {
        setLoading(true);
        const data = await dashboardApi.getLeadStatusAggregation(teamwide && isAdmin);
        setLeadsByStatus(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching leads by status:', err);
        setError('Failed to load lead status data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeadsByStatus();
  }, [teamwide, isAdmin]);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Leads by Status</h2>
        <div className="animate-pulse flex justify-center items-center h-64">
          <div className="w-40 h-40 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Leads by Status</h2>
        <div className="flex items-center text-red-500">
          <AlertCircle size={20} className="mr-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Leads by Status</h2>
      
      {leadsByStatus.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No leads data available.</p>
      ) : (
        <PieChart data={leadsByStatus} />
      )}
    </div>
  );
};

export default LeadsByStatusChart; 