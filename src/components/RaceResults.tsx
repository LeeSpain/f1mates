
import React, { useState } from 'react';
import { raceResults, allDrivers } from '@/data/mockData';

export const RaceResults = () => {
  const [selectedRace, setSelectedRace] = useState(raceResults[0].id);
  
  const currentRace = raceResults.find(race => race.id === selectedRace);
  
  if (!currentRace) return <div>No race data available</div>;
  
  const getDriverName = (driverId: number) => {
    const driver = allDrivers.find(d => d.id === driverId);
    return driver ? driver.name : 'Unknown Driver';
  };
  
  const getDriverTeam = (driverId: number) => {
    const driver = allDrivers.find(d => d.id === driverId);
    return driver ? driver.team : 'Unknown Team';
  };
  
  const getPositionClass = (position: number) => {
    if (position === 1) return "text-yellow-400 font-bold";
    if (position === 2) return "text-gray-300 font-bold";
    if (position === 3) return "text-amber-600 font-bold";
    return "";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-bold">Race: {currentRace.raceName}</h3>
        <div>
          <select 
            value={selectedRace}
            onChange={(e) => setSelectedRace(Number(e.target.value))}
            className="bg-white/10 border border-white/20 rounded p-2 text-white"
          >
            {raceResults.map(race => (
              <option key={race.id} value={race.id}>
                {race.raceName} - {new Date(race.date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
      </div>
      
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
                  <td className="p-3">{getDriverName(result.driverId)}</td>
                  <td className="p-3">{getDriverTeam(result.driverId)}</td>
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
      
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <h3 className="text-lg font-bold mb-2">Your Race Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-white/10 rounded border border-white/10">
            <div className="text-sm text-gray-300">Group A: Verstappen</div>
            <div className="font-bold text-lg">30 points</div>
          </div>
          <div className="p-3 bg-white/10 rounded border border-white/10">
            <div className="text-sm text-gray-300">Group B: Albon</div>
            <div className="font-bold text-lg">2 points</div>
          </div>
          <div className="p-3 bg-white/10 rounded border border-white/10">
            <div className="text-sm text-gray-300">Bonus Prediction</div>
            <div className="font-bold text-lg">10 points</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-f1-red/20 rounded border border-f1-red/30">
          <div className="text-sm">Race Total</div>
          <div className="font-bold text-2xl">42 points</div>
        </div>
      </div>
    </div>
  );
};
