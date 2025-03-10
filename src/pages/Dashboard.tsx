
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { DashboardNav } from '@/components/DashboardNav';
import { RaceTimer } from '@/components/RaceTimer';
import { DriverCard } from '@/components/DriverCard';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { RaceResults } from '@/components/RaceResults';
import { SwapsAndPicks } from '@/components/SwapsAndPicks';
import { ChatWidget } from '@/components/ChatWidget';
import { RulesOverview } from '@/components/RulesOverview';
import { HelpSection } from '@/components/HelpSection';
import { useToast } from '@/hooks/use-toast';
import { Driver } from '@/types/driver';
import { allDrivers } from '@/data/mockData';
import { useAuth } from '@/auth/AuthContext';

// Dashboard tabs
type Tab = 'mySquad' | 'leaderboard' | 'raceResults' | 'swapsAndPicks' | 'chat' | 'rules' | 'help';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('mySquad');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, logout } = useAuth();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get user's drivers
  const getUserDrivers = (): Driver[] => {
    // For simplicity, we're assigning drivers based on user ID
    // In a real app, this would come from a database
    const driverIds = [
      currentUser?.id || 1, // Group A driver (1-6 matching user ID)
      6 + currentUser?.id || 7, // Group B driver (7-12)
      12 + currentUser?.id || 13, // Group C driver (13-18)
    ];
    
    return driverIds.map(id => {
      const driver = allDrivers.find(d => d.id === id);
      if (!driver) {
        // Fallback if driver not found
        return allDrivers[0];
      }
      return driver;
    });
  };

  const myDrivers = getUserDrivers();

  return (
    <div className="min-h-screen bg-gradient-to-b from-f1-darkBlue to-black text-white">
      <div className="flex flex-col h-screen">
        {/* Top Bar */}
        <header className="bg-f1-black p-4 flex justify-between items-center border-b border-f1-silver/20">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">F1 Mate Racer</h1>
            <RaceTimer nextRace="Saudi GP" date="March 9, 2025" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-medium">
              {currentUser?.name}'s Points: {currentUser?.totalPoints}
            </span>
            {currentUser?.isAdmin && (
              <button 
                onClick={() => navigate('/admin')}
                className="px-4 py-1 rounded bg-f1-silver/20 hover:bg-f1-silver/30 transition-colors"
              >
                Admin Panel
              </button>
            )}
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
          <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-6">
            {/* My Squad */}
            {activeTab === 'mySquad' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">{currentUser?.name}'s Squad</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {myDrivers.map(driver => (
                    <DriverCard 
                      key={driver.id}
                      driver={driver}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Leaderboard */}
            {activeTab === 'leaderboard' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
                <LeaderboardTable />
              </div>
            )}
            
            {/* Race Results */}
            {activeTab === 'raceResults' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">Race Results</h2>
                <RaceResults />
              </div>
            )}
            
            {/* Swaps & Picks */}
            {activeTab === 'swapsAndPicks' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">Swaps & Picks</h2>
                <SwapsAndPicks drivers={myDrivers} />
              </div>
            )}
            
            {/* Chat */}
            {activeTab === 'chat' && (
              <div className="h-full animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">Banter Zone</h2>
                <div className="h-[calc(100%-3rem)]">
                  <ChatWidget />
                </div>
              </div>
            )}
            
            {/* Rules */}
            {activeTab === 'rules' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">Rules & Points</h2>
                <RulesOverview />
              </div>
            )}
            
            {/* Help Section */}
            {activeTab === 'help' && (
              <div className="space-y-6 animate-fade-in">
                <HelpSection />
              </div>
            )}
          </main>
          
          {/* Right Sidebar - Chat Widget (only shown on larger screens) */}
          <div className="w-80 border-l border-f1-silver/20 p-4 hidden lg:block">
            <h3 className="text-lg font-bold mb-3">Banter Zone</h3>
            <ChatWidget minimal />
          </div>
        </div>
        
        {/* Bottom Bar */}
        <footer className="bg-f1-black p-3 border-t border-f1-silver/20 text-center">
          <p className="text-sm">
            Submit picks by Thursday before next race! 
            <button 
              className="ml-2 text-f1-red font-medium hover:underline"
              onClick={() => setActiveTab('help')}
            >
              Need Help?
            </button>
          </p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
};

export default Dashboard;
