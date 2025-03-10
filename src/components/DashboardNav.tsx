
import React from 'react';
import { NavItem } from './nav/NavItem';
import { navItems, Tab } from './nav/navItems';

interface DashboardNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const DashboardNav = ({ activeTab, setActiveTab }: DashboardNavProps) => {
  return (
    <nav className="w-64 bg-f1-black pt-6 border-r border-f1-silver/20 hidden md:block">
      <div className="px-3 mb-6">
        <div className="text-white font-bold text-lg px-4">F1 Mate Racer</div>
      </div>
      
      <ul className="space-y-1 px-3">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            {...item}
            isActive={activeTab === item.id}
            onClick={setActiveTab}
          />
        ))}
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
