
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RaceResult } from '@/data/mockData';

// Collection references
const racesRef = collection(db, 'races');
const resultsRef = collection(db, 'results');

/**
 * Get all race results
 */
export const getRaceResults = async (): Promise<RaceResult[]> => {
  try {
    const resultsQuery = query(
      resultsRef,
      orderBy("date", "desc")
    );
    
    const resultsSnapshot = await getDocs(resultsQuery);
    
    if (resultsSnapshot.empty) {
      return [];
    }
    
    const results: RaceResult[] = [];
    
    for (const doc of resultsSnapshot.docs) {
      const data = doc.data();
      
      // Get detailed driver results
      const detailedResultsRef = collection(resultsRef, doc.id, 'driverResults');
      const detailedResultsSnapshot = await getDocs(detailedResultsRef);
      
      results.push({
        id: parseInt(doc.id),
        raceName: data.raceName,
        date: data.date.toDate().toISOString().split('T')[0],
        results: detailedResultsSnapshot.docs.map(resultDoc => {
          const resultData = resultDoc.data();
          return {
            driverId: resultData.driverId,
            position: resultData.position,
            points: resultData.points,
            bonusPoints: resultData.bonusPoints || 0,
            bonusReason: resultData.bonusReason
          };
        })
      });
    }
    
    return results;
  } catch (error) {
    console.error("Error fetching race results:", error);
    return [];
  }
};
