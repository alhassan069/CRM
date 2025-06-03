import { NavLink, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, BarChart3, LogOut } from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarProvider,
} from '../ui/sidebar';

const SidebarLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Leads', path: '/leads', icon: <Users size={20} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} />, adminOnly: true }
  ];

  return (
    <div className="flex h-screen bg-background">
      <SidebarProvider defaultOpen={true}>
        <Sidebar className="border-r">
          <SidebarHeader className="px-4 py-3">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold">Doctor CRM</h2>
              {user && (
                <p className="text-sm text-muted-foreground">
                  {user.name} ({user.role})
                </p>
              )}
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => {
                // Skip admin-only items for non-admin users
                if (item.adminOnly && !isAdmin) return null;
                
                return (
                  <NavLink key={item.name} to={item.path}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.name}
                        className="w-full justify-start"
                      >
                        {item.icon}
                        <span className="ml-2">{item.name}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="p-4 border-t">
            <button
              onClick={logout}
              className="flex items-center text-red-500 hover:text-red-700 w-full"
            >
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main content header */}
          <header className="bg-card shadow-sm z-10">
            <div className="p-4">
              <h1 className="text-2xl font-semibold">
                {navItems.find(item => item.path === location.pathname || location.pathname.startsWith(item.path + '/'))?.name || 'Dashboard'}
              </h1>
            </div>
          </header>

          {/* Main content body */}
          <main className="flex-1 overflow-y-auto  mx-18 p-4">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default SidebarLayout; 