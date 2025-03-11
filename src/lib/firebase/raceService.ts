
import { collection, query, where, getDocs, Timestamp, doc, setDoc } from 'firebase/firestore';
import { db } from './config';

/**
 * Create races collection if it doesn't exist
 */
export const createRaceCollection = async (): Promise<void> => {
  try {
    // Create races collection if doesn't exist
    const racesRef = collection(db, 'races');
    const currentYear = new Date().getFullYear();

    // Check if we already have races for current year
    const yearQuery = query(racesRef, where("season", "==", currentYear));
    const racesSnapshot = await getDocs(yearQuery);
    
    if (racesSnapshot.empty) {
      // Add 2025 F1 calendar races (example)
      const races = [
        { name: "Bahrain Grand Prix", date: new Date("2025-03-02"), season: currentYear, circuit: "Bahrain International Circuit" },
        { name: "Saudi Arabian Grand Prix", date: new Date("2025-03-09"), season: currentYear, circuit: "Jeddah Corniche Circuit" },
        { name: "Australian Grand Prix", date: new Date("2025-03-23"), season: currentYear, circuit: "Albert Park Circuit" },
        // Add more races as needed
      ];
      
      // Add each race to Firestore
      for (const race of races) {
        const raceDoc = doc(collection(db, 'races'));
        await setDoc(raceDoc, {
          ...race,
          date: Timestamp.fromDate(race.date),
          createdAt: Timestamp.now()
        });
      }
    }
  } catch (error) {
    console.error("Error creating race collection:", error);
  }
};
