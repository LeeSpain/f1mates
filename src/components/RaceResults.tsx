
import React, { useState, useEffect } from 'react';
import { getF1RaceSchedule, getF1RaceResults, getLatestRaceResults, F1RaceResult, F1Race } from '@/services/f1DataService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/auth/AuthContext';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export const RaceResults = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [races, setRaces] = useState<F1Race[]>([]);
  const [selectedRaceId, setSelectedRaceId] = useState<string>('');
  const [currentRace, setCurrentRace] = useState<F1RaceResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRaceResults, setUserRaceResults] = useState<{
    groupA: { driver: string; points: number };
    groupB: { driver: string; points: number };
    groupC: { driver: string; points: number };
    bonus: { prediction: string; points: number };
    total: number;
  } | null>(null);

  // Fetch race schedule when component mounts
  useEffect(() => {
    const fetchRaceSchedule = async () => {
      try {
        const currentYear = new Date().getFullYear().toString();
        const raceData = await getF1RaceSchedule(currentYear);
        setRaces(raceData);
        
        // Get the latest race results by default
        const latestResults = await getLatestRaceResults();
        if (latestResults) {
          setCurrentRace(latestResults);
          setSelectedRaceId(latestResults.id);
          fetchUserResults(latestResults.id);
        }
      } catch (error) {
        console.error('Error fetching race data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load race data. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRaceSchedule();
  }, [toast]);

  // Fetch race results when selected race changes
  const handleRaceChange = async (raceId: string) => {
    if (!raceId) return;
    
    setIsLoading(true);
    try {
      const [season, round] = raceId.split('-');
      const raceResults = await getF1RaceResults(season, round);
      if (raceResults) {
        setCurrentRace(raceResults);
        setSelectedRaceId(raceId);
        fetchUserResults(raceId);
      }
    } catch (error) {
      console.error('Error fetching race results:', error);
      toast({
        title: 'Error',
        description: 'Failed to load race results. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch user's results for the selected race
  const fetchUserResults = async (raceId: string) => {
    if (!currentUser) return;
    
    try {
      // Query the user results collection
      const resultsQuery = query(
        collection(db, 'userResults'),
        where('userId', '==', currentUser.uid),
        where('raceId', '==', raceId)
      );
      
      const resultsSnap = await getDocs(resultsQuery);
      
      if (!resultsSnap.empty) {
        const resultData = resultsSnap.docs[0].data();
        
        setUserRaceResults({
          groupA: {
            driver: resultData.groupADriver || 'Not available',
            points: resultData.groupAPoints || 0
          },
          groupB: {
            driver: resultData.groupBDriver || 'Not available',
            points: resultData.groupBPoints || 0
          },
          groupC: {
            driver: resultData.groupCDriver || 'Not available',
            points: resultData.groupCPoints || 0
          },
          bonus: {
            prediction: resultData.bonusPrediction || 'None',
            points: resultData.bonusPoints || 0
          },
          total: resultData.totalPoints || 0
        });
      } else {
        // If no result data found for this race, set default values
        setUserRaceResults({
          groupA: { driver: 'No data', points: 0 },
          groupB: { driver: 'No data', points: 0 },
          groupC: { driver: 'No data', points: 0 },
          bonus: { prediction: 'No prediction', points: 0 },
          total: 0
        });
      }
    } catch (error) {
      console.error('Error fetching user race results:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your race results. Please try again later.',
        variant: 'destructive',
      });
    }
  };
  
  const getPositionClass = (position: number) => {
    if (position === 1) return "text-yellow-400 font-bold";
    if (position === 2) return "text-gray-300 font-bold";
    if (position === 3) return "text-amber-600 font-bold";
    return "";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-f1-red" />
        <span className="ml-2 text-white">Loading race data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-bold">
          {currentRace ? `Race: ${currentRace.raceName}` : 'No race data available'}
        </h3>
        <div>
          <select 
            value={selectedRaceId}
            onChange={(e) => handleRaceChange(e.target.value)}
            className="bg-white/10 border border-white/20 rounded p-2 text-white"
          >
            {races.map(race => (
              <option key={`${race.season}-${race.round}`} value={`${race.season}-${race.round}`}>
                {race.raceName} - {new Date(race.date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {currentRace ? (
        <div className="glassmorphism rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-white/5">
                  <th className="p-3 font-medium">Pos</th>
                  <th className="p-3 font-medium">Driver</th>
                  <th className="p-3 font-medium">Team</th>
                  <th className="p-3 font-medium">Base Pts</th>
                  <th className="p-3 font-medium">Bonus</th>
                  <th className="p-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {currentRace.results.map((result) => (
                  <tr key={result.driverId} className="border-t border-white/5 hover:bg-white/5">
                    <td className={`p-3 ${getPositionClass(result.position)}`}>P{result.position}</td>
                    <td className="p-3">{result.driverName} ({result.driverCode})</td>
                    <td className="p-3">{result.team}</td>
                    <td className="p-3">{result.points}</td>
                    <td className="p-3">
                      {result.bonusPoints > 0 && (
                        <div className="flex items-center">
                          <span className="text-green-400">+{result.bonusPoints}</span>
                          {result.bonusReason && (
                            <span className="ml-1 text-xs text-gray-400">({result.bonusReason})</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-bold">{result.points + result.bonusPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-white/5 rounded-lg border border-white/10 text-center">
          <p>No race results available for this selection.</p>
        </div>
      )}
      
      {userRaceResults && (
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-lg font-bold mb-2">Your Race Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-white/10 rounded border border-white/10">
              <div className="text-sm text-gray-300">Group A: {userRaceResults.groupA.driver}</div>
              <div className="font-bold text-lg">{userRaceResults.groupA.points} points</div>
            </div>
            <div className="p-3 bg-white/10 rounded border border-white/10">
              <div className="text-sm text-gray-300">Group B: {userRaceResults.groupB.driver}</div>
              <div className="font-bold text-lg">{userRaceResults.groupB.points} points</div>
            </div>
            <div className="p-3 bg-white/10 rounded border border-white/10">
              <div className="text-sm text-gray-300">Bonus Prediction</div>
              <div className="font-bold text-lg">{userRaceResults.bonus.points} points</div>
              <div className="text-xs text-gray-400 mt-1 truncate">"{userRaceResults.bonus.prediction}"</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-f1-red/20 rounded border border-f1-red/30">
            <div className="text-sm">Race Total</div>
            <div className="font-bold text-2xl">{userRaceResults.total} points</div>
          </div>
        </div>
      )}
    </div>
  );
};
