import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { DashboardNav } from '@/components/DashboardNav';
import { InviteUsers } from '@/components/InviteUsers';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/auth/AuthContext';

// Admin dashboard tabs
type Tab = 'inviteUsers' | 'manageRaces' | 'manageDrivers' | 'settings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('inviteUsers');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, logout } = useAuth();

  // If not admin, redirect to regular dashboard
  if (!currentUser?.isAdmin) {
    navigate('/dashboard');
    return null;
  }

  // Handle logout
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-f1-darkBlue to-black text-white">
      <div className="flex flex-col h-screen">
        {/* Top Bar */}
        <header className="bg-f1-black p-4 flex justify-between items-center border-b border-f1-silver/20">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">F1 Mate Racer <span className="text-f1-red">Admin</span></h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-4 py-1 rounded bg-f1-silver/20 hover:bg-f1-silver/30 transition-colors"
            >
              Return to Dashboard
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-1 rounded bg-f1-red hover:bg-f1-red/90 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Navigation */}
          <nav className="w-64 bg-sidebar-background border-r border-sidebar-border">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4 text-sidebar-foreground">Admin Controls</h2>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab('inviteUsers')}
                    className={`nav-item ${activeTab === 'inviteUsers' ? 'active' : ''}`}
                  >
                    Invite Users
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('manageRaces')}
                    className={`nav-item ${activeTab === 'manageRaces' ? 'active' : ''}`}
                  >
                    Manage Races
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('manageDrivers')}
                    className={`nav-item ${activeTab === 'manageDrivers' ? 'active' : ''}`}
                  >
                    Manage Drivers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                  >
                    Settings
                  </button>
                </li>
              </ul>
            </div>
          </nav>
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-6">
            {/* Invite Users */}
            {activeTab === 'inviteUsers' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">Invite Friends to Join</h2>
                <div className="p-6 bg-card rounded-lg border border-border">
                  <InviteUsers />
                </div>
              </div>
            )}
            
            {/* Other admin tabs - placeholder for future features */}
            {activeTab === 'manageRaces' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">Manage Races</h2>
                <p>Coming soon: Race management features</p>
              </div>
            )}
            
            {activeTab === 'manageDrivers' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">Manage Drivers</h2>
                <p>Coming soon: Driver management features</p>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">League Settings</h2>
                <p>Coming soon: League configuration options</p>
              </div>
            )}
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminDashboard;
