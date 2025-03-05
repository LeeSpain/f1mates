
import React from 'react';
import { Driver } from '@/types/driver';
import { cn } from '@/lib/utils';
import { Lock, Shuffle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DriverCardProps {
  driver: Driver;
}

export const DriverCard = ({ driver }: DriverCardProps) => {
  // Get the appropriate class for the driver card based on the group
  const getDriverCardClass = () => {
    switch (driver.group) {
      case 'A':
        return 'driver-card-group-a';
      case 'B':
        return 'driver-card-group-b';
      case 'C':
        return 'driver-card-group-c';
      default:
        return '';
    }
  };

  return (
    <div className={cn("driver-card", getDriverCardClass())}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-xs text-gray-400">Group {driver.group}</span>
          <h3 className="font-bold text-lg">{driver.name}</h3>
          <p className="text-sm text-gray-300">{driver.team}</p>
        </div>
        
        <div className="flex items-center">
          {driver.locked ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Lock className="h-4 w-4 text-f1-silver" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Locked for the season</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Shuffle className="h-4 w-4 text-f1-lightBlue" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Available for swap</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      
      <div className="relative h-40 mb-3 rounded overflow-hidden">
        <img 
          src={driver.image} 
          alt={driver.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs text-gray-400">Last Race</span>
          <p className="font-bold">{driver.points} points</p>
        </div>
        
        {!driver.locked && (
          <button className="py-1 px-3 text-sm rounded bg-f1-lightBlue hover:bg-f1-lightBlue/90 text-white">
            Swap
          </button>
        )}
      </div>
    </div>
  );
};
