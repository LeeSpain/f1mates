import React, { useState, useEffect } from 'react';
import { Driver } from '@/types/driver';
import { allDrivers, predictions } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, getDoc, Timestamp, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/auth/AuthContext';

interface SwapsAndPicksProps {
  drivers: Driver[];
}

export const SwapsAndPicks = ({ drivers }: SwapsAndPicksProps) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [predictionText, setPredictionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [swapsRemaining, setSwapsRemaining] = useState(6);
  const [swapHistory, setSwapHistory] = useState<any[]>([]);
  const [selectedGroupBDriver, setSelectedGroupBDriver] = useState<string>('');
  const [selectedGroupCDriver, setSelectedGroupCDriver] = useState<string>('');
  
  const groupADriver = drivers.find(d => d.group === 'A');
  const groupBDriver = drivers.find(d => d.group === 'B');
  const groupCDriver = drivers.find(d => d.group === 'C');
  
  const availableGroupBDrivers = allDrivers.filter(d => 
    d.group === 'B' && !drivers.some(myD => myD.id === d.id)
  );
  
  const availableGroupCDrivers = allDrivers.filter(d => 
    d.group === 'C' && !drivers.some(myD => myD.id === d.id)
  );
  
  // Fetch user swap data on mount
  useEffect(() => {
    const fetchUserSwapData = async () => {
      if (!currentUser) return;
      
      try {
        // Fetch user's swap data
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setSwapsRemaining(userData.swapsRemaining || 6);
          
          // Fetch swap history
          const swapsQuery = query(
            collection(db, 'swaps'), 
            where('userId', '==', currentUser.uid)
          );
          const swapsSnap = await getDocs(swapsQuery);
          const swapsData = swapsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setSwapHistory(swapsData);
        }
      } catch (error) {
        console.error("Error fetching user swap data:", error);
        toast({
          title: "Error",
          description: "Could not load your driver swap data. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    fetchUserSwapData();
  }, [currentUser, toast]);
  
  const handleSwap = async (group: 'B' | 'C') => {
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to swap drivers.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedDriverId = group === 'B' ? selectedGroupBDriver : selectedGroupCDriver;
    
    if (!selectedDriverId) {
      toast({
        title: "Selection Required",
        description: `Please select a driver to swap with your group ${group} driver.`,
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const currentDriverId = group === 'B' ? 
        drivers.find(d => d.group === 'B')?.id.toString() : 
        drivers.find(d => d.group === 'C')?.id.toString();
      
      const selectedDriver = allDrivers.find(d => d.id.toString() === selectedDriverId);
      
      if (!selectedDriver) {
        throw new Error("Selected driver not found");
      }
      
      // For Group B, check swaps remaining
      if (group === 'B') {
        if (swapsRemaining <= 0) {
          toast({
            title: "No Swaps Remaining",
            description: "You have used all your Group B driver swaps for this season.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        // Update user's swaps remaining
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          swapsRemaining: swapsRemaining - 1,
        });
        
        setSwapsRemaining(prev => prev - 1);
      }
      
      // Record the swap in Firestore
      const swapRef = collection(db, 'swaps');
      await addDoc(swapRef, {
        userId: currentUser.uid,
        oldDriverId: currentDriverId,
        newDriverId: selectedDriverId,
        driverGroup: group,
        date: Timestamp.now(),
      });
      
      // Add to user's driver array
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        [`driver${group}`]: selectedDriverId,
        lastUpdated: Timestamp.now()
      });
      
      // Clear selection
      if (group === 'B') {
        setSelectedGroupBDriver('');
      } else {
        setSelectedGroupCDriver('');
      }
      
      toast({
        title: "Driver Swapped",
        description: `Your Group ${group} driver has been updated to ${selectedDriver.name}.`,
      });
      
      // Refresh swap history
      const swapsQuery = query(
        collection(db, 'swaps'), 
        where('userId', '==', currentUser.uid)
      );
      const swapsSnap = await getDocs(swapsQuery);
      const swapsData = swapsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setSwapHistory(swapsData);
      
    } catch (error) {
      console.error("Error swapping driver:", error);
      toast({
        title: "Swap Failed",
        description: "There was an error swapping your driver. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmitPrediction = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit predictions.",
        variant: "destructive",
      });
      return;
    }
    
    if (!predictionText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prediction",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Add prediction to Firestore
      const predictionRef = collection(db, 'predictions');
      await addDoc(predictionRef, {
        userId: currentUser.uid,
        prediction: predictionText,
        race: "Next Race", // This would be dynamic in a real app
        status: 'pending',
        createdAt: Timestamp.now()
      });
      
      toast({
        title: "Prediction Submitted",
        description: "Your prediction has been recorded for the next race.",
      });
      setPredictionText('');
      
    } catch (error) {
      console.error("Error submitting prediction:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Group B Swaps */}
      <div className="glassmorphism p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Group B Swaps</h3>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Swaps Remaining:</span>
            <span className="font-medium">{swapsRemaining}/6</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-f1-lightBlue h-2 rounded-full" 
              style={{ width: `${(swapsRemaining / 6) * 100}%` }}
            ></div>
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
            <select 
              className="w-full p-3 bg-white/10 rounded border border-white/20 text-white"
              value={selectedGroupBDriver}
              onChange={(e) => setSelectedGroupBDriver(e.target.value)}
              disabled={loading}
            >
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
            disabled={loading || !selectedGroupBDriver}
            className={`px-4 py-2 bg-f1-lightBlue ${
              loading || !selectedGroupBDriver ? 'opacity-50 cursor-not-allowed' : 'hover:bg-f1-lightBlue/80'
            } rounded text-white font-medium`}
          >
            {loading ? 'Processing...' : 'Swap Driver'}
          </button>
        </div>
        
        {swapHistory.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-2">Swap History</h4>
            <div className="space-y-2">
              {swapHistory
                .filter(swap => swap.driverGroup === 'B')
                .map(swap => {
                  const oldDriver = allDrivers.find(d => d.id.toString() === swap.oldDriverId);
                  const newDriver = allDrivers.find(d => d.id.toString() === swap.newDriverId);
                  
                  return (
                    <div key={swap.id} className="text-sm text-gray-300 flex items-center gap-2">
                      <span className="text-xs bg-white/10 py-1 px-2 rounded">
                        {swap.date?.toDate()?.toLocaleDateString() || 'Unknown date'}
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
            <select 
              className="w-full p-3 bg-white/10 rounded border border-white/20 text-white"
              value={selectedGroupCDriver}
              onChange={(e) => setSelectedGroupCDriver(e.target.value)}
              disabled={loading}
            >
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
            disabled={loading || !selectedGroupCDriver}
            className={`px-4 py-2 bg-f1-red ${
              loading || !selectedGroupCDriver ? 'opacity-50 cursor-not-allowed' : 'hover:bg-f1-red/80'
            } rounded text-white font-medium`}
          >
            {loading ? 'Processing...' : 'Lock In'}
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
          <label className="block text-sm text-gray-300 mb-1">Your Prediction for Next Race</label>
          <textarea 
            value={predictionText}
            onChange={(e) => setPredictionText(e.target.value)}
            placeholder="E.g., 'Norris will get a podium' or 'Albon will score points'"
            className="w-full p-3 bg-white/10 rounded border border-white/20 text-white"
            rows={2}
            disabled={loading}
          />
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={handleSubmitPrediction}
            disabled={loading || !predictionText.trim()}
            className={`px-4 py-2 bg-f1-red ${
              loading || !predictionText.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-f1-red/80'
            } rounded text-white font-medium`}
          >
            {loading ? 'Submitting...' : 'Submit Prediction'}
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
