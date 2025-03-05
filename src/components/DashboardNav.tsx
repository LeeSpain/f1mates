
import React from 'react';
import { Users, Trophy, Flag, Shuffle, MessageCircle, ScrollText } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'mySquad' | 'leaderboard' | 'raceResults' | 'swapsAndPicks' | 'chat' | 'rules';

interface DashboardNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const DashboardNav = ({ activeTab, setActiveTab }: DashboardNavProps) => {
  const tabs = [
    { id: 'mySquad', label: 'My Squad', icon: Users },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'raceResults', label: 'Race Results', icon: Flag },
    { id: 'swapsAndPicks', label: 'Swaps & Picks', icon: Shuffle },
    { id: 'chat', label: 'Banter Zone', icon: MessageCircle },
    { id: 'rules', label: 'Rules', icon: ScrollText },
  ];
  
  return (
    <nav className="w-64 bg-f1-black pt-6 border-r border-f1-silver/20 hidden md:block">
      <div className="px-3 mb-6">
        <div className="text-white font-bold text-lg px-4">F1 Mate Racer</div>
      </div>
      
      <ul className="space-y-1 px-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "nav-item w-full text-left",
                  activeTab === tab.id && "active"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
      
      <div className="mt-auto px-3 pb-6 pt-10">
        <div className="rounded-md bg-f1-darkBlue/50 p-4 border border-f1-silver/10">
          <h3 className="font-medium text-sm text-white mb-2">Next Deadline</h3>
          <p className="text-xs text-gray-300">Submit picks by Thursday before the Saudi Arabia GP</p>
        </div>
      </div>
    </nav>
  );
};
