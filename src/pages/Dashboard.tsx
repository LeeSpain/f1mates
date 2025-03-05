
import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import DashboardNav from '@/components/DashboardNav';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (localStorage.getItem('f1-mate-logged-in') !== 'true') {
      toast.error('Please log in to access the dashboard');
      navigate('/');
      return;
    }
    
    // Set document title
    document.title = 'F1 Mate Racer | Dashboard';
  }, [navigate]);

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-background">
      {/* Side Navigation */}
      <DashboardNav />
      
      {/* Main Content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
