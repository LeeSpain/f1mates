
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Calendar,
  CheckIcon,
  ClockIcon,
  LightbulbIcon,
  RefreshCwIcon
} from 'lucide-react';
import { toast } from 'sonner';

const GROUP_B_DRIVERS = [
  { name: 'Lewis Hamilton', team: 'Mercedes' },
  { name: 'George Russell', team: 'Mercedes' },
  { name: 'Carlos Sainz', team: 'Ferrari' },
  { name: 'Oscar Piastri', team: 'McLaren' },
  { name: 'Fernando Alonso', team: 'Aston Martin' },
  { name: 'Sergio Perez', team: 'Red Bull' },
];

const GROUP_C_DRIVERS = [
  { name: 'Valtteri Bottas', team: 'Sauber' },
  { name: 'Guanyu Zhou', team: 'Sauber' },
  { name: 'Kevin Magnussen', team: 'Haas' },
  { name: 'Nico Hulkenberg', team: 'Haas' },
  { name: 'Logan Sargeant', team: 'Williams' },
  { name: 'Daniel Ricciardo', team: 'RB' },
];

const SWAP_HISTORY = [
  { id: 1, from: 'Sergio Perez', to: 'Alex Albon', race: 'Australian GP', date: 'March 24, 2025' },
];

const SwapsAndPicks: React.FC = () => {
  const [groupBDriver, setGroupBDriver] = useState('');
  const [groupCDriver, setGroupCDriver] = useState('');
  const [prediction, setPrediction] = useState('');
  const [swapsLeft, setSwapsLeft] = useState(5); // Already used 1 swap
  
  const handleGroupBSwap = () => {
    if (!groupBDriver) {
      toast.error('Please select a driver to swap');
      return;
    }
    
    if (swapsLeft <= 0) {
      toast.error('No swaps left for Group B');
      return;
    }
    
    toast.success(`Swapped to ${groupBDriver}`);
    setSwapsLeft(prev => prev - 1);
    setGroupBDriver('');
  };
  
  const handleGroupCSwap = () => {
    if (!groupCDriver) {
      toast.error('Please select a driver to swap');
      return;
    }
    
    toast.success(`Set ${groupCDriver} as your Group C driver for the next race`);
    setGroupCDriver('');
  };
  
  const handlePredictionSubmit = () => {
    if (!prediction) {
      toast.error('Please enter a prediction');
      return;
    }
    
    toast.success('Prediction submitted for the next race!');
    setPrediction('');
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glassmorphism rounded-lg p-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl checkered-edge pb-2">Swaps & Picks</h3>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClockIcon className="h-4 w-4" />
            <span>Deadline: Thursday, March 7, 2025, 18:00 GMT</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold">Group B Swap</h4>
              <span className="text-sm font-medium px-2 py-1 bg-primary/10 rounded-full text-primary">
                {swapsLeft}/6 Swaps Left
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Current driver: <span className="font-medium">Alex Albon (Williams)</span>
            </p>
            
            <div className="flex gap-3">
              <Select value={groupBDriver} onValueChange={setGroupBDriver}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select driver to swap" />
                </SelectTrigger>
                <SelectContent>
                  {GROUP_B_DRIVERS.map(driver => (
                    <SelectItem key={driver.name} value={driver.name}>
                      {driver.name} ({driver.team})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleGroupBSwap} 
                disabled={!groupBDriver || swapsLeft <= 0}
              >
                <RefreshCwIcon className="h-4 w-4 mr-2" /> Swap
              </Button>
            </div>
            
            <div className="mt-6">
              <h5 className="text-sm font-medium mb-2">Swap History</h5>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Race</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SWAP_HISTORY.map(swap => (
                    <TableRow key={swap.id}>
                      <TableCell>{swap.from}</TableCell>
                      <TableCell className="font-medium">{swap.to}</TableCell>
                      <TableCell>{swap.race}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold">Group C Weekly Pick</h4>
              <span className="text-sm font-medium px-2 py-1 bg-accent/10 rounded-full text-accent-foreground">
                Weekly Swap Available
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Current driver: <span className="font-medium">Yuki Tsunoda (RB)</span>
            </p>
            
            <div className="flex gap-3">
              <Select value={groupCDriver} onValueChange={setGroupCDriver}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select driver for next race" />
                </SelectTrigger>
                <SelectContent>
                  {GROUP_C_DRIVERS.map(driver => (
                    <SelectItem key={driver.name} value={driver.name}>
                      {driver.name} ({driver.team})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button onClick={handleGroupCSwap} disabled={!groupCDriver}>
                <CheckIcon className="h-4 w-4 mr-2" /> Lock In
              </Button>
            </div>
            
            <div className="mt-6">
              <h4 className="font-bold mb-4">Bonus Prediction</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Enter one prediction for the Saudi Arabian GP for a chance to earn +10 points.
              </p>
              
              <div className="flex gap-3">
                <Input 
                  placeholder="E.g., 'Norris podium' or 'Sainz beats Perez'"
                  value={prediction}
                  onChange={(e) => setPrediction(e.target.value)}
                />
                
                <Button onClick={handlePredictionSubmit} disabled={!prediction}>
                  <LightbulbIcon className="h-4 w-4 mr-2" /> Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glassmorphism rounded-lg p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <span>Next Race: Saudi Arabian Grand Prix</span>
        </h3>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-card rounded-lg p-4 border border-border">
            <h4 className="font-medium mb-2">Your Current Lineup</h4>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Group A:</span>
                <span className="font-medium">Max Verstappen (Red Bull)</span>
              </li>
              <li className="flex justify-between">
                <span>Group B:</span>
                <span className="font-medium">Alex Albon (Williams)</span>
              </li>
              <li className="flex justify-between">
                <span>Group C:</span>
                <span className="font-medium">Yuki Tsunoda (RB)</span>
              </li>
            </ul>
          </div>
          
          <div className="flex-1 bg-card rounded-lg p-4 border border-border">
            <h4 className="font-medium mb-2">Draft Rules Reminder</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Group A locked for the season</li>
              <li>• 6 Group B swaps per season</li>
              <li>• Weekly Group C swaps available</li>
              <li>• Deadline: Thursday before each race weekend</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapsAndPicks;
