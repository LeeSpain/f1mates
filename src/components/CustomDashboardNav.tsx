
import React from 'react';
import { 
  LayoutDashboardIcon, 
  TrophyIcon, 
  FlagIcon, 
  SwitchCameraIcon, 
  MessageSquareIcon, 
  BookOpenIcon,
  HelpCircleIcon
} from 'lucide-react';

type Tab = 'mySquad' | 'leaderboard' | 'raceResults' | 'swapsAndPicks' | 'chat' | 'rules' | 'help';

interface DashboardNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const CustomDashboardNav = ({ activeTab, setActiveTab }: DashboardNavProps) => {
  const navItems = [
    { id: 'mySquad', label: 'My Squad', icon: <LayoutDashboardIcon className="w-5 h-5" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <TrophyIcon className="w-5 h-5" /> },
    { id: 'raceResults', label: 'Race Results', icon: <FlagIcon className="w-5 h-5" /> },
    { id: 'swapsAndPicks', label: 'Swaps & Picks', icon: <SwitchCameraIcon className="w-5 h-5" /> },
    { id: 'chat', label: 'Banter Zone', icon: <MessageSquareIcon className="w-5 h-5" /> },
    { id: 'rules', label: 'Rules', icon: <BookOpenIcon className="w-5 h-5" /> },
    { id: 'help', label: 'Help', icon: <HelpCircleIcon className="w-5 h-5" /> }
  ];

  return (
    <nav className="w-20 md:w-56 bg-f1-black border-r border-f1-silver/20 shrink-0">
      <ul className="py-4">
        {navItems.map((item) => (
          <li key={item.id} className="mb-1">
            <button
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex flex-col md:flex-row items-center p-3 md:px-4 ${
                activeTab === item.id
                  ? 'bg-f1-silver/20 text-white'
                  : 'text-gray-400 hover:bg-f1-silver/10 hover:text-white'
              } transition-colors rounded-md`}
            >
              <span className="md:mr-3">{item.icon}</span>
              <span className="text-xs md:text-sm md:text-left mt-1 md:mt-0">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
