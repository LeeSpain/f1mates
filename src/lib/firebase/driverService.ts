
import { doc, updateDoc, serverTimestamp, collection, addDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from './config';

/**
 * Function to record user's driver selection
 */
export const saveDriverSelection = async (
  userId: string, 
  driverGroup: string, 
  driverId: string
): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Update the user's driver for the specified group
    await updateDoc(userRef, {
      [`driver${driverGroup}`]: driverId,
      lastUpdated: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error saving driver selection:", error);
    return false;
  }
};

/**
 * Function to create a new prediction
 */
export const savePrediction = async (
  userId: string,
  raceId: string,
  prediction: string
): Promise<boolean> => {
  try {
    const predictionRef = collection(db, 'predictions');
    
    await addDoc(predictionRef, {
      userId,
      raceId,
      prediction,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error saving prediction:", error);
    return false;
  }
};

/**
 * Register a driver swap
 */
export const registerDriverSwap = async (
  userId: string,
  oldDriverId: string,
  newDriverId: string,
  driverGroup: 'B' | 'C'
): Promise<boolean> => {
  try {
    // First check if user has swaps remaining (for Group B)
    if (driverGroup === 'B') {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const swapsRemaining = userData.swapsRemaining || 0;
        
        if (swapsRemaining <= 0) {
          throw new Error("No swaps remaining");
        }
        
        // Update swaps remaining
        await updateDoc(userRef, {
          swapsRemaining: swapsRemaining - 1
        });
      }
    }
    
    // Record the swap
    const swapRef = collection(db, 'swaps');
    await addDoc(swapRef, {
      userId,
      oldDriverId,
      newDriverId,
      driverGroup,
      date: serverTimestamp()
    });
    
    // Update the user's driver
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      [`driver${driverGroup}`]: newDriverId,
      lastUpdated: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error registering driver swap:", error);
    return false;
  }
};
