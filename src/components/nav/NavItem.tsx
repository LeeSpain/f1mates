
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Tab } from './navItems';

interface NavItemProps {
  id: Tab;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: (id: Tab) => void;
}

export const NavItem = ({ id, label, icon: Icon, isActive, onClick }: NavItemProps) => {
  return (
    <li>
      <button
        onClick={() => onClick(id)}
        className={cn(
          "nav-item w-full text-left",
          isActive && "active"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </button>
    </li>
  );
};
