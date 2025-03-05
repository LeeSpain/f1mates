
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Flag, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-f1-darkBlue to-black text-white">
      <div className="text-center max-w-md px-4">
        <div className="mb-6">
          <Flag className="h-16 w-16 text-f1-red mx-auto mb-2" />
          <h1 className="text-4xl font-bold mb-2">404 - Pit Stop!</h1>
          <p className="text-gray-400">
            Looks like you've veered off the racing line. This page doesn't exist!
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            className="w-full bg-f1-red hover:bg-f1-red/90"
            onClick={() => navigate('/')}
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <p className="text-sm text-gray-500">
            Check your URL or head back to the starting grid.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
