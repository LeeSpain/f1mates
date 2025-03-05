
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Trophy, Zap } from 'lucide-react';

interface DriverResult {
  driver: string;
  position: number;
  basePoints: number;
  bonuses: {
    type: string;
    points: number;
  }[];
  total: number;
  isUserDriver: boolean;
}

interface Race {
  id: string;
  name: string;
  date: string;
  results: DriverResult[];
}

const MOCK_RACES: Race[] = [
  {
    id: 'bahrain-2025',
    name: 'Bahrain Grand Prix',
    date: 'March 2, 2025',
    results: [
      {
        driver: 'Max Verstappen',
        position: 1,
        basePoints: 25,
        bonuses: [{ type: 'Fastest Lap', points: 5 }],
        total: 30,
        isUserDriver: true
      },
      {
        driver: 'Charles Leclerc',
        position: 2,
        basePoints: 18,
        bonuses: [],
        total: 18,
        isUserDriver: false
      },
      {
        driver: 'Lando Norris',
        position: 3,
        basePoints: 15,
        bonuses: [],
        total: 15,
        isUserDriver: false
      },
      {
        driver: 'Lewis Hamilton',
        position: 4,
        basePoints: 10,
        bonuses: [],
        total: 10,
        isUserDriver: false
      },
      {
        driver: 'Carlos Sainz',
        position: 5,
        basePoints: 8,
        bonuses: [],
        total: 8,
        isUserDriver: false
      },
      {
        driver: 'Alex Albon',
        position: 9,
        basePoints: 2,
        bonuses: [],
        total: 2,
        isUserDriver: true
      },
      {
        driver: 'Yuki Tsunoda',
        position: 12,
        basePoints: 0,
        bonuses: [],
        total: 0,
        isUserDriver: true
      }
    ]
  },
  {
    id: 'saudi-2025',
    name: 'Saudi Arabian Grand Prix',
    date: 'March 9, 2025',
    results: []
  }
];

const RaceResults: React.FC = () => {
  const [selectedRace, setSelectedRace] = useState(MOCK_RACES[0].id);
  
  const race = MOCK_RACES.find(r => r.id === selectedRace) || MOCK_RACES[0];
  
  const userDrivers = race.results.filter(r => r.isUserDriver);
  const userTotal = userDrivers.reduce((sum, driver) => sum + driver.total, 0) + 10; // Adding bonus prediction
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glassmorphism rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl checkered-edge pb-2">Race Results</h3>
          
          <Select value={selectedRace} onValueChange={setSelectedRace}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select race" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_RACES.map(race => (
                <SelectItem key={race.id} value={race.id}>
                  {race.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {race.results.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Position</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead className="text-right">Base Points</TableHead>
                  <TableHead className="text-right">Bonuses</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {race.results.map((result) => (
                  <TableRow key={result.driver} className={result.isUserDriver ? 'bg-primary/5' : ''}>
                    <TableCell>
                      {result.position}
                      {result.position === 1 && <Trophy className="h-4 w-4 inline ml-1 text-yellow-500" />}
                    </TableCell>
                    <TableCell className="font-medium">
                      {result.driver}
                      {result.isUserDriver && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">Your Driver</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{result.basePoints}</TableCell>
                    <TableCell className="text-right">
                      {result.bonuses.length > 0 
                        ? result.bonuses.map(bonus => (
                            <div key={bonus.type} className="flex items-center justify-end gap-1">
                              <Zap className="h-3 w-3 text-primary" />
                              <span>+{bonus.points} ({bonus.type})</span>
                            </div>
                          ))
                        : '-'
                      }
                    </TableCell>
                    <TableCell className="text-right font-bold">{result.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-6 p-4 border border-border rounded-lg bg-card">
              <h4 className="font-bold mb-2">Your Race Total</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {userDrivers.map(driver => (
                  <div key={driver.driver} className="bg-muted p-3 rounded-md">
                    <div className="text-sm text-muted-foreground">
                      {driver.driver}
                    </div>
                    <div className="text-lg font-bold">
                      {driver.total} pts
                    </div>
                  </div>
                ))}
                <div className="bg-primary/10 p-3 rounded-md">
                  <div className="text-sm text-primary">
                    Prediction Bonus
                  </div>
                  <div className="text-lg font-bold text-primary">
                    +10 pts
                  </div>
                </div>
                <div className="bg-secondary p-3 rounded-md">
                  <div className="text-sm text-secondary-foreground">
                    Total
                  </div>
                  <div className="text-lg font-bold text-secondary-foreground">
                    {userTotal} pts
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-12">
            <h4 className="text-xl font-bold">Race Coming Soon</h4>
            <p className="text-muted-foreground mt-2">
              Results will be available after the race on {race.date}
            </p>
          </div>
        )}
      </div>
      
      <div className="glassmorphism rounded-lg p-4">
        <h3 className="font-bold mb-4">Points Breakdown</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Base Points</h4>
            <div className="grid grid-cols-5 gap-2 text-sm">
              <div className="bg-background p-2 rounded-md text-center">
                <div className="font-bold">P1</div>
                <div>25 pts</div>
              </div>
              <div className="bg-background p-2 rounded-md text-center">
                <div className="font-bold">P2</div>
                <div>18 pts</div>
              </div>
              <div className="bg-background p-2 rounded-md text-center">
                <div className="font-bold">P3</div>
                <div>15 pts</div>
              </div>
              <div className="bg-background p-2 rounded-md text-center">
                <div className="font-bold">P4</div>
                <div>10 pts</div>
              </div>
              <div className="bg-background p-2 rounded-md text-center">
                <div className="font-bold">P5</div>
                <div>8 pts</div>
              </div>
              <div className="bg-background p-2 rounded-md text-center">
                <div className="font-bold">P6</div>
                <div>6 pts</div>
              </div>
              <div className="bg-background p-2 rounded-md text-center">
                <div className="font-bold">P7</div>
                <div>4 pts</div>
              </div>
              <div className="bg-background p-2 rounded-md text-center">
                <div className="font-bold">P8</div>
                <div>3 pts</div>
              </div>
              <div className="bg-background p-2 rounded-md text-center">
                <div className="font-bold">P9</div>
                <div>2 pts</div>
              </div>
              <div className="bg-background p-2 rounded-md text-center">
                <div className="font-bold">P10</div>
                <div>1 pt</div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Bonus Points</h4>
            <div className="space-y-2 text-sm">
              <div className="bg-background p-3 rounded-md flex justify-between">
                <div>Fastest Lap</div>
                <div className="font-bold">+5 pts</div>
              </div>
              <div className="bg-background p-3 rounded-md flex justify-between">
                <div>Prediction Bonus</div>
                <div className="font-bold">+10 pts</div>
              </div>
              <div className="bg-background p-3 rounded-md flex justify-between">
                <div>Group C in Top 10</div>
                <div className="font-bold">+15 pts</div>
              </div>
              <div className="bg-background p-3 rounded-md flex justify-between">
                <div>Mate Challenge</div>
                <div className="font-bold">+5 pts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceResults;
