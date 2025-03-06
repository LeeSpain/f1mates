
import React, { useEffect, useState } from 'react';
import { Crown, Flame } from 'lucide-react';
import { getAllPlayers, useAuth, User } from '@/auth/AuthContext';

export const LeaderboardTable = () => {
  const { currentUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState<(User & { isCurrentLeader: boolean; isOnHotStreak: boolean })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const players = await getAllPlayers();
        setLeaderboard(players);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-400">Loading leaderboard data...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <h3 className="text-xl font-bold mb-4">Season Standings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-white/10">
                <th className="pb-2 font-medium">Player</th>
                <th className="pb-2 font-medium">Group A</th>
                <th className="pb-2 font-medium">Group B</th>
                <th className="pb-2 font-medium">Group C</th>
                <th className="pb-2 font-medium">Bonus</th>
                <th className="pb-2 font-medium">Total</th>
                <th className="pb-2 font-medium">Wins</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player) => (
                <tr key={player.id} className={`border-b border-white/5 hover:bg-white/5 ${currentUser?.id === player.id ? 'bg-f1-red/10' : ''}`}>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {player.isCurrentLeader && (
                        <Crown className="h-4 w-4 text-yellow-400" />
                      )}
                      {player.isOnHotStreak && (
                        <Flame className="h-4 w-4 text-orange-500" />
                      )}
                      <span>{player.name}</span>
                      {currentUser?.id === player.id && (
                        <span className="text-xs bg-f1-red/80 px-2 py-0.5 rounded ml-1">You</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3">{player.groupAPoints}</td>
                  <td className="py-3">{player.groupBPoints}</td>
                  <td className="py-3">{player.groupCPoints}</td>
                  <td className="py-3">{player.bonusPoints}</td>
                  <td className="py-3 font-bold">{player.totalPoints}</td>
                  <td className="py-3">{player.weeklyWins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <h3 className="text-xl font-bold mb-4">Best Group C Finishes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leaderboard.map((player) => (
            <div 
              key={`gc-${player.id}`} 
              className={`p-3 ${currentUser?.id === player.id ? 'bg-f1-red/20 border-f1-red/30' : 'bg-white/5 border-white/10'} rounded border`}
            >
              <div className="font-medium">
                {player.name}
                {currentUser?.id === player.id && (
                  <span className="text-xs bg-f1-red/80 px-2 py-0.5 rounded ml-2">You</span>
                )}
              </div>
              <div className="text-sm text-gray-300">Best: {player.bestGroupCFinish}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
