
import React, { useState } from 'react';
import { Driver } from '@/types/driver';
import { allDrivers, predictions, swapHistory } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface SwapsAndPicksProps {
  drivers: Driver[];
}

export const SwapsAndPicks = ({ drivers }: SwapsAndPicksProps) => {
  const { toast } = useToast();
  const [predictionText, setPredictionText] = useState('');
  
  const groupBDriver = drivers.find(d => d.group === 'B');
  const groupCDriver = drivers.find(d => d.group === 'C');
  
  const availableGroupBDrivers = allDrivers.filter(d => 
    d.group === 'B' && !drivers.some(myD => myD.id === d.id)
  );
  
  const availableGroupCDrivers = allDrivers.filter(d => 
    d.group === 'C' && !drivers.some(myD => myD.id === d.id)
  );
  
  const handleSwap = (group: 'B' | 'C') => {
    toast({
      title: "Driver Swapped",
      description: `Your Group ${group} driver has been updated for the next race.`,
    });
  };
  
  const handleSubmitPrediction = () => {
    if (!predictionText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prediction",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Prediction Submitted",
      description: "Your prediction has been recorded for the next race.",
    });
    setPredictionText('');
  };

  return (
    <div className="space-y-8">
      {/* Group B Swaps */}
      <div className="glassmorphism p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Group B Swaps</h3>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Swaps Remaining:</span>
            <span className="font-medium">6/6</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-f1-lightBlue h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <label className="block text-sm text-gray-300 mb-1">Current Driver</label>
            <div className="p-3 bg-white/10 rounded border border-white/20">
              {groupBDriver?.name || 'No Group B driver selected'}
            </div>
          </div>
          
          <div className="hidden md:block">→</div>
          
          <div className="flex-1">
            <label className="block text-sm text-gray-300 mb-1">Swap To</label>
            <select className="w-full p-3 bg-white/10 rounded border border-white/20 text-white">
              <option value="">Select a driver</option>
              {availableGroupBDrivers.map(driver => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} ({driver.team})
                </option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={() => handleSwap('B')}
            className="px-4 py-2 bg-f1-lightBlue hover:bg-f1-lightBlue/80 rounded text-white font-medium"
          >
            Swap Driver
          </button>
        </div>
        
        {swapHistory.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-2">Swap History</h4>
            <div className="space-y-2">
              {swapHistory.map(swap => {
                const oldDriver = allDrivers.find(d => d.id === swap.oldDriverId);
                const newDriver = allDrivers.find(d => d.id === swap.newDriverId);
                
                return (
                  <div key={swap.id} className="text-sm text-gray-300 flex items-center gap-2">
                    <span className="text-xs bg-white/10 py-1 px-2 rounded">
                      {new Date(swap.date).toLocaleDateString()}
                    </span>
                    <span>{oldDriver?.name || 'Unknown'}</span>
                    <span>→</span>
                    <span className="font-medium">{newDriver?.name || 'Unknown'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Group C Weekly Picks */}
      <div className="glassmorphism p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Group C Weekly Pick</h3>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <label className="block text-sm text-gray-300 mb-1">Current Driver</label>
            <div className="p-3 bg-white/10 rounded border border-white/20">
              {groupCDriver?.name || 'No Group C driver selected'}
            </div>
          </div>
          
          <div className="hidden md:block">→</div>
          
          <div className="flex-1">
            <label className="block text-sm text-gray-300 mb-1">Next Race Pick</label>
            <select className="w-full p-3 bg-white/10 rounded border border-white/20 text-white">
              <option value="">Select a driver</option>
              {availableGroupCDrivers.map(driver => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} ({driver.team})
                </option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={() => handleSwap('C')}
            className="px-4 py-2 bg-f1-red hover:bg-f1-red/80 rounded text-white font-medium"
          >
            Lock In
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-white/5 rounded border border-white/10">
          <p className="text-sm text-gray-300">
            <span className="font-medium">Reminder:</span> You can change your Group C driver every week before the race.
          </p>
        </div>
      </div>
      
      {/* Bonus Prediction */}
      <div className="glassmorphism p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Bonus Prediction</h3>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">Your Prediction for Saudi GP</label>
          <textarea 
            value={predictionText}
            onChange={(e) => setPredictionText(e.target.value)}
            placeholder="E.g., 'Norris will get a podium' or 'Albon will score points'"
            className="w-full p-3 bg-white/10 rounded border border-white/20 text-white"
            rows={2}
          />
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={handleSubmitPrediction}
            className="px-4 py-2 bg-f1-red hover:bg-f1-red/80 rounded text-white font-medium"
          >
            Submit Prediction
          </button>
        </div>
        
        {predictions.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-2">Previous Predictions</h4>
            <div className="space-y-3">
              {predictions.map(prediction => (
                <div 
                  key={prediction.id} 
                  className="p-3 rounded border flex justify-between items-center"
                  style={{
                    borderColor: prediction.result === 'correct' ? 'rgba(34, 197, 94, 0.3)' : 
                                prediction.result === 'incorrect' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    backgroundColor: prediction.result === 'correct' ? 'rgba(34, 197, 94, 0.1)' : 
                                    prediction.result === 'incorrect' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div>
                    <div className="text-sm font-medium">{prediction.race}</div>
                    <div className="text-gray-300">{prediction.prediction}</div>
                  </div>
                  <div>
                    {prediction.result === 'pending' ? (
                      <span className="px-2 py-1 text-xs bg-white/10 rounded">Pending</span>
                    ) : prediction.result === 'correct' ? (
                      <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">+{prediction.points} points</span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">Incorrect</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
