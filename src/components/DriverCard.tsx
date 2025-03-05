
import React from 'react';
import { RefreshCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DriverCardProps {
  group: 'A' | 'B' | 'C';
  driver: {
    name: string;
    team: string;
    lastRacePoints: number;
  };
  locked?: boolean;
  swapsLeft?: number;
  availableDrivers?: Array<{
    name: string;
    team: string;
  }>;
  onSwap?: (driverName: string) => void;
}

const DriverCard: React.FC<DriverCardProps> = ({ 
  group, driver, locked = false, swapsLeft, availableDrivers = [], onSwap 
}) => {
  const hasSwapOption = !locked && availableDrivers.length > 0;
  
  return (
    <div className={`driver-card transition-all duration-300 hover:-translate-y-1 driver-card-group-${group.toLowerCase()}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            Group {group}
          </span>
          {locked && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              Locked
            </span>
          )}
          {group === 'B' && swapsLeft !== undefined && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent-foreground">
              {swapsLeft}/6 Swaps Left
            </span>
          )}
          {group === 'C' && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent-foreground">
              Weekly Swap Available
            </span>
          )}
        </div>
        
        <div className="text-right">
          <div className="text-xs text-muted-foreground mb-1">Last Race</div>
          <span className={`font-bold ${driver.lastRacePoints > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
            {driver.lastRacePoints} pts
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-bold">{driver.name}</h3>
        <p className="text-sm text-muted-foreground">{driver.team}</p>
      </div>
      
      {hasSwapOption && (
        <div className="flex gap-2 items-center">
          <Select disabled={!hasSwapOption}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a driver to swap" />
            </SelectTrigger>
            <SelectContent>
              {availableDrivers.map((d) => (
                <SelectItem key={d.name} value={d.name}>
                  {d.name} ({d.team})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            size="sm" 
            disabled={!hasSwapOption || (group === 'B' && swapsLeft === 0)}
            onClick={() => onSwap && onSwap(availableDrivers[0]?.name)}
          >
            <RefreshCwIcon className="h-4 w-4 mr-2" /> Swap
          </Button>
        </div>
      )}
    </div>
  );
};

export default DriverCard;
