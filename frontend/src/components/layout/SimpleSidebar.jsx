import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const SimpleSidebar = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isAdmin = user?.role === 'admin';
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Leads', path: '/leads', icon: <Users size={20} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative w-64 h-full bg-card shadow-md transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Doctor CRM</h2>
          <p className="text-sm text-muted-foreground">
            {user?.name} ({user?.role})
          </p>
        </div>
        
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => {
              // Skip admin-only items for non-admin users
              if (item.adminOnly && !isAdmin) return null;
              
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center px-6 py-3 hover:bg-accent/50
                      ${isActive ? 'bg-accent/50 border-l-4 border-primary' : ''}
                    `}
                  >
                    <span className="mr-3 text-foreground">{item.icon}</span>
                    <span className="text-foreground">{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center text-red-500 hover:text-red-700"
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main content header */}
        <header className="bg-card shadow-sm z-30">
          <div className="p-4">
            <h1 className="text-2xl font-semibold">
              {navItems.find(item => item.path === location.pathname || location.pathname.startsWith(item.path + '/'))?.name || 'Dashboard'}
            </h1>
          </div>
        </header>

        {/* Main content body */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SimpleSidebar; 