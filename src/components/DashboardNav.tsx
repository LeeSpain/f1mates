
import React from 'react';
import { NavItem } from './nav/NavItem';
import { navItems, Tab } from './nav/navItems';
import { DeadlineNotice } from './nav/DeadlineNotice';

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
        <DeadlineNotice raceTitle="Saudi Arabia GP" />
      </div>
    </nav>
  );
};
