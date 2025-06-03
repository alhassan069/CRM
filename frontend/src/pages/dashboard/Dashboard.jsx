import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import MyTasks from '../../components/dashboard/MyTasks';
import LeadsByStatusChart from '../../components/dashboard/LeadsByStatusChart';
import DailyActivitiesChart from '../../components/dashboard/DailyActivitiesChart';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [teamView, setTeamView] = useState(false);

  return (
    <main>
      <div className="space-y-6">
        {/* Admin toggle for team view */}
        {isAdmin && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <span className="mr-3">View Mode:</span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={teamView}
                  onChange={() => setTeamView(!teamView)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {teamView ? 'Team View' : 'Personal View'}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Tasks section */}
        <MyTasks teamwide={teamView && isAdmin} />

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeadsByStatusChart teamwide={teamView && isAdmin} />
          <DailyActivitiesChart teamwide={teamView && isAdmin} />
        </div>
      </div>
    </main>
  );
};

export default Dashboard; 