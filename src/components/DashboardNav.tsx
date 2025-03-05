
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, BarChart2, TrendingUp, RefreshCw, 
  MessageSquare, BookOpen, LogOut, Trophy
} from 'lucide-react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const DashboardNav: React.FC = () => {
  const { toast } = useToast();
  
  const handleLogout = () => {
    localStorage.removeItem('f1-mate-logged-in');
    toast({
      title: "Logged out successfully",
      description: "See you at the next race!",
    });
    window.location.href = '/';
  };

  return (
    <aside className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="p-4 mb-4">
        <Logo />
      </div>
      
      <nav className="flex-1 px-2 space-y-1">
        <NavLink to="/dashboard" end className={({isActive}) => 
          `nav-item ${isActive ? 'active' : ''}`
        }>
          <Trophy className="w-5 h-5" />
          <span>My Squad</span>
        </NavLink>
        
        <NavLink to="/dashboard/leaderboard" className={({isActive}) => 
          `nav-item ${isActive ? 'active' : ''}`
        }>
          <BarChart2 className="w-5 h-5" />
          <span>Leaderboard</span>
        </NavLink>
        
        <NavLink to="/dashboard/results" className={({isActive}) => 
          `nav-item ${isActive ? 'active' : ''}`
        }>
          <TrendingUp className="w-5 h-5" />
          <span>Race Results</span>
        </NavLink>
        
        <NavLink to="/dashboard/swaps" className={({isActive}) => 
          `nav-item ${isActive ? 'active' : ''}`
        }>
          <RefreshCw className="w-5 h-5" />
          <span>Swaps & Picks</span>
        </NavLink>
        
        <NavLink to="/dashboard/chat" className={({isActive}) => 
          `nav-item ${isActive ? 'active' : ''}`
        }>
          <MessageSquare className="w-5 h-5" />
          <span>Chat</span>
        </NavLink>
        
        <NavLink to="/dashboard/rules" className={({isActive}) => 
          `nav-item ${isActive ? 'active' : ''}`
        }>
          <BookOpen className="w-5 h-5" />
          <span>Rules</span>
        </NavLink>
      </nav>
      
      <div className="p-4 mt-auto border-t border-sidebar-border">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium">
              {localStorage.getItem('f1-mate-user') || 'User'}
            </div>
            <div className="text-xs text-sidebar-foreground/70">Season Points: 485</div>
          </div>
        </div>
        
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>
    </aside>
  );
};

export default DashboardNav;
