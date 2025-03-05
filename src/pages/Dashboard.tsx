
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
import { useToast } from '@/hooks/use-toast';
import { Driver, DriverGroup } from '@/types/driver';
import { mySquad, allDrivers } from '@/data/mockData';

// Dashboard tabs
type Tab = 'mySquad' | 'leaderboard' | 'raceResults' | 'swapsAndPicks' | 'chat' | 'rules';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('mySquad');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sample data for demo with correct typing for DriverGroup
  const myDrivers: Driver[] = [
    { id: 1, name: "Max Verstappen", team: "Red Bull Racing", group: "A" as DriverGroup, image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/verstappen.jpg.img.1920.medium.jpg/1677069646195.jpg", points: 25, locked: true },
    { id: 2, name: "Alex Albon", team: "Williams", group: "B" as DriverGroup, image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/albon.jpg.img.1920.medium.jpg/1677069655110.jpg", points: 4, locked: false },
    { id: 3, name: "Yuki Tsunoda", team: "RB", group: "C" as DriverGroup, image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/tsunoda.jpg.img.1920.medium.jpg/1677069888562.jpg", points: 0, locked: false }
  ];

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('f1-mate-logged-in');
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
            <h1 className="text-xl font-bold">F1 Mate Racer</h1>
            <RaceTimer nextRace="Saudi GP" date="March 9, 2025" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-medium">Your Season Points: 485</span>
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
                <h2 className="text-2xl font-bold mb-4">My Squad</h2>
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
              onClick={() => setActiveTab('rules')}
            >
              View Rules
            </button>
          </p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
};

export default Dashboard;
