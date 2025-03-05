
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Crown, Flame } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  groupA: number;
  groupB: number;
  groupC: number;
  bonus: number;
  total: number;
  isLeader?: boolean;
  isHotStreak?: boolean;
}

interface LeaderboardTableProps {
  type: 'weekly' | 'season';
  players: Player[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ type, players }) => {
  const sortedPlayers = [...players].sort((a, b) => b.total - a.total);
  
  return (
    <div className="glassmorphism rounded-lg p-4 animate-fade-in">
      <h3 className="font-bold text-xl mb-4 checkered-edge pb-4">
        {type === 'weekly' ? 'This Week\'s Standings' : 'Season Standings'}
      </h3>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Position</TableHead>
            <TableHead>Driver</TableHead>
            {type === 'weekly' ? (
              <>
                <TableHead className="text-right">Group A</TableHead>
                <TableHead className="text-right">Group B</TableHead>
                <TableHead className="text-right">Group C</TableHead>
                <TableHead className="text-right">Bonus</TableHead>
              </>
            ) : (
              <>
                <TableHead className="text-right">Wins</TableHead>
                <TableHead className="text-right">Best Group C</TableHead>
              </>
            )}
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {sortedPlayers.map((player, index) => (
            <TableRow 
              key={player.id}
              className={player.name === localStorage.getItem('f1-mate-user') ? 'bg-primary/5' : ''}
            >
              <TableCell className="font-medium">
                {index + 1}
                {player.isLeader && (
                  <Crown className="h-4 w-4 inline ml-1 text-yellow-500" />
                )}
                {player.isHotStreak && (
                  <Flame className="h-4 w-4 inline ml-1 text-primary" />
                )}
              </TableCell>
              <TableCell className="font-medium">
                {player.name}
                {player.name === localStorage.getItem('f1-mate-user') && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">You</span>
                )}
              </TableCell>
              
              {type === 'weekly' ? (
                <>
                  <TableCell className="text-right">{player.groupA}</TableCell>
                  <TableCell className="text-right">{player.groupB}</TableCell>
                  <TableCell className="text-right">{player.groupC}</TableCell>
                  <TableCell className="text-right">{player.bonus}</TableCell>
                </>
              ) : (
                <>
                  <TableCell className="text-right">{Math.floor(Math.random() * 6)}</TableCell>
                  <TableCell className="text-right">P{Math.floor(Math.random() * 10) + 1}</TableCell>
                </>
              )}
              
              <TableCell className="text-right font-bold">
                {player.total}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
