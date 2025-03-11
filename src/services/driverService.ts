
import { doc, collection, getDocs, getDoc, setDoc, addDoc, query, where, orderBy, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/auth/types';
import { Driver, Swap, Prediction } from '@/types/driver';
import { toast } from '@/hooks/use-toast';

// Collection references
const driversRef = collection(db, 'drivers');
const squadsRef = collection(db, 'squads');
const swapsRef = collection(db, 'swaps');
const predictionsRef = collection(db, 'predictions');

/**
 * Get all drivers from Firestore
 */
export const getAllDrivers = async (): Promise<Driver[]> => {
  try {
    const querySnapshot = await getDocs(query(driversRef, orderBy('id')));
    
    if (querySnapshot.empty) {
      // If no drivers exist yet, seed the collection with initial data
      await seedDriverData();
      // Then fetch the newly seeded data
      const seededSnapshot = await getDocs(query(driversRef, orderBy('id')));
      return seededSnapshot.docs.map(doc => doc.data() as Driver);
    }
    
    return querySnapshot.docs.map(doc => doc.data() as Driver);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    toast({
      title: "Error",
      description: "Failed to load drivers. Please try again.",
      variant: "destructive"
    });
    return [];
  }
};

/**
 * Seed initial driver data if collection is empty
 */
const seedDriverData = async () => {
  try {
    // Initial driver data from the mock data
    const initialDrivers = [
      // Group A - Top Tier
      { id: 1, name: "Max Verstappen", team: "Red Bull Racing", group: "A", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/verstappen.jpg.img.1920.medium.jpg/1677069646195.jpg", points: 25, locked: true },
      { id: 2, name: "Lewis Hamilton", team: "Mercedes", group: "A", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/hamilton.jpg.img.1920.medium.jpg/1677069594164.jpg", points: 18, locked: true },
      { id: 3, name: "Charles Leclerc", team: "Ferrari", group: "A", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/leclerc.jpg.img.1920.medium.jpg/1677069223130.jpg", points: 15, locked: true },
      { id: 4, name: "Lando Norris", team: "McLaren", group: "A", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/norris.jpg.img.1920.medium.jpg/1677069505471.jpg", points: 12, locked: true },
      { id: 5, name: "Carlos Sainz", team: "Ferrari", group: "A", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/sainz.jpg.img.1920.medium.jpg/1677069189406.jpg", points: 10, locked: true },
      { id: 6, name: "George Russell", team: "Mercedes", group: "A", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/russell.jpg.img.1920.medium.jpg/1677069334466.jpg", points: 8, locked: true },
      
      // Group B - Midfield
      { id: 7, name: "Alex Albon", team: "Williams", group: "B", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/albon.jpg.img.1920.medium.jpg/1677069655110.jpg", points: 4, locked: false },
      { id: 8, name: "Oscar Piastri", team: "McLaren", group: "B", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/piastri.jpg.img.1920.medium.jpg/1677069946720.jpg", points: 6, locked: false },
      { id: 9, name: "Pierre Gasly", team: "Alpine", group: "B", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/gasly.jpg.img.1920.medium.jpg/1676983081984.jpg", points: 2, locked: false },
      { id: 10, name: "Fernando Alonso", team: "Aston Martin", group: "B", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/alonso.jpg.img.1920.medium.jpg/1677244577162.jpg", points: 8, locked: false },
      { id: 11, name: "Lance Stroll", team: "Aston Martin", group: "B", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/stroll.jpg.img.1920.medium.jpg/1677069453013.jpg", points: 0, locked: false },
      { id: 12, name: "Esteban Ocon", team: "Alpine", group: "B", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/ocon.jpg.img.1920.medium.jpg/1677069269007.jpg", points: 1, locked: false },
      
      // Group C - Underdogs
      { id: 13, name: "Yuki Tsunoda", team: "RB", group: "C", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/tsunoda.jpg.img.1920.medium.jpg/1677069888562.jpg", points: 0, locked: false },
      { id: 14, name: "Valtteri Bottas", team: "Sauber", group: "C", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/bottas.jpg.img.1920.medium.jpg/1677069810695.jpg", points: 0, locked: false },
      { id: 15, name: "Kevin Magnussen", team: "Haas F1 Team", group: "C", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/magnussen.jpg.img.1920.medium.jpg/1677069529390.jpg", points: 0, locked: false },
      { id: 16, name: "Zhou Guanyu", team: "Sauber", group: "C", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/zhou.jpg.img.1920.medium.jpg/1677069909295.jpg", points: 0, locked: false },
      { id: 17, name: "Daniel Ricciardo", team: "RB", group: "C", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/ricciardo.jpg.img.1920.medium.jpg/1689253984120.jpg", points: 0, locked: false },
      { id: 18, name: "Nico Hulkenberg", team: "Haas F1 Team", group: "C", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/hulkenberg.jpg.img.1920.medium.jpg/1677070578195.jpg", points: 0, locked: false },
    ];

    // Add each driver to Firestore
    for (const driver of initialDrivers) {
      await setDoc(doc(driversRef, driver.id.toString()), driver);
    }
    
    console.log("Drivers collection seeded successfully");
  } catch (error) {
    console.error("Error seeding driver data:", error);
  }
};

/**
 * Get the current user's squad
 */
export const getUserSquad = async (userId: string): Promise<Driver[]> => {
  try {
    const squadRef = doc(squadsRef, userId);
    const squadDoc = await getDoc(squadRef);
    
    if (!squadDoc.exists()) {
      // If no squad exists yet, create a default one
      await createDefaultSquad(userId);
      // Then fetch the newly created squad
      const newSquadDoc = await getDoc(squadRef);
      
      if (!newSquadDoc.exists()) {
        throw new Error("Failed to create default squad");
      }
      
      const squadData = newSquadDoc.data();
      const driverPromises = [
        getDoc(doc(driversRef, squadData.driverA.toString())),
        getDoc(doc(driversRef, squadData.driverB.toString())),
        getDoc(doc(driversRef, squadData.driverC.toString()))
      ];
      
      const driverDocs = await Promise.all(driverPromises);
      return driverDocs.map(doc => doc.data() as Driver);
    }
    
    const squadData = squadDoc.data();
    const driverPromises = [
      getDoc(doc(driversRef, squadData.driverA.toString())),
      getDoc(doc(driversRef, squadData.driverB.toString())),
      getDoc(doc(driversRef, squadData.driverC.toString()))
    ];
    
    const driverDocs = await Promise.all(driverPromises);
    return driverDocs.map(doc => doc.data() as Driver);
  } catch (error) {
    console.error("Error fetching user squad:", error);
    toast({
      title: "Error",
      description: "Failed to load your squad. Please try again.",
      variant: "destructive"
    });
    return [];
  }
};

/**
 * Create a default squad for a new user
 */
const createDefaultSquad = async (userId: string) => {
  try {
    // Default squad with one driver from each group
    const defaultSquad = {
      userId,
      driverA: 1, // Verstappen
      driverB: 7, // Albon
      driverC: 13, // Tsunoda
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(doc(squadsRef, userId), defaultSquad);
    console.log("Default squad created");
  } catch (error) {
    console.error("Error creating default squad:", error);
    throw error;
  }
};

/**
 * Swap a driver in the user's squad
 */
export const swapDriver = async (
  userId: string,
  oldDriverId: number,
  newDriverId: number,
  group: 'B' | 'C'
): Promise<boolean> => {
  try {
    // First check if the user has swaps remaining for Group B
    if (group === 'B') {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const swapsRemaining = userData.swapsRemaining || 0;
        
        if (swapsRemaining <= 0) {
          toast({
            title: "Swap Failed",
            description: "You have no Group B swaps remaining.",
            variant: "destructive"
          });
          return false;
        }
        
        // Update swaps remaining
        await updateDoc(userRef, {
          swapsRemaining: swapsRemaining - 1
        });
      }
    }
    
    // Record the swap
    const swap = {
      userId,
      oldDriverId,
      newDriverId,
      group,
      date: serverTimestamp()
    };
    
    await addDoc(swapsRef, swap);
    
    // Update the user's squad
    const squadRef = doc(squadsRef, userId);
    const fieldToUpdate = `driver${group}`;
    
    await updateDoc(squadRef, {
      [fieldToUpdate]: newDriverId,
      updatedAt: serverTimestamp()
    });
    
    toast({
      title: "Driver Swapped",
      description: "Your squad has been updated successfully."
    });
    
    return true;
  } catch (error) {
    console.error("Error swapping driver:", error);
    toast({
      title: "Swap Failed",
      description: "Failed to swap driver. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Get the user's swap history
 */
export const getUserSwapHistory = async (userId: string): Promise<Swap[]> => {
  try {
    const swapsQuery = query(
      swapsRef,
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    
    const swapsSnapshot = await getDocs(swapsQuery);
    
    if (swapsSnapshot.empty) {
      return [];
    }
    
    return swapsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        date: data.date.toDate().toISOString().split('T')[0],
        oldDriverId: data.oldDriverId,
        newDriverId: data.newDriverId,
        group: data.group
      };
    });
  } catch (error) {
    console.error("Error fetching swap history:", error);
    return [];
  }
};

/**
 * Submit a prediction for a race
 */
export const submitPrediction = async (
  userId: string,
  race: string,
  prediction: string
): Promise<boolean> => {
  try {
    await addDoc(predictionsRef, {
      userId,
      race,
      prediction,
      result: "pending",
      points: 0,
      createdAt: serverTimestamp()
    });
    
    toast({
      title: "Prediction Submitted",
      description: "Your prediction has been recorded."
    });
    
    return true;
  } catch (error) {
    console.error("Error submitting prediction:", error);
    toast({
      title: "Submission Failed",
      description: "Failed to submit prediction. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Get the user's predictions
 */
export const getUserPredictions = async (userId: string): Promise<Prediction[]> => {
  try {
    const predictionsQuery = query(
      predictionsRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const predictionsSnapshot = await getDocs(predictionsQuery);
    
    if (predictionsSnapshot.empty) {
      return [];
    }
    
    return predictionsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        race: data.race,
        prediction: data.prediction,
        result: data.result,
        points: data.points
      };
    });
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return [];
  }
};
