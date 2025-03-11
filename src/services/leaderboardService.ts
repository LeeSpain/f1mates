import { collection, getDocs, doc, getDoc, query, where, orderBy, updateDoc, increment, serverTimestamp, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RaceResult, PlayerStanding } from '@/data/mockData';
import { User } from '@/auth/types';
import { toast } from '@/hooks/use-toast';

// Collection references
const racesRef = collection(db, 'races');
const resultsRef = collection(db, 'results');
const usersRef = collection(db, 'users');

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

/**
 * Get all players for the leaderboard
 */
export const getLeaderboard = async (): Promise<PlayerStanding[]> => {
  try {
    // Query non-admin users and sort by total points
    const usersQuery = query(
      usersRef,
      where("isAdmin", "==", false),
      orderBy("totalPoints", "desc")
    );
    
    const usersSnapshot = await getDocs(usersQuery);
    
    if (usersSnapshot.empty) {
      return [];
    }
    
    const currentUserId = localStorage.getItem('currentUserId') || '';
    
    return usersSnapshot.docs.map((doc, index) => {
      const userData = doc.data() as User;
      return {
        id: userData.id,
        name: userData.name,
        groupAPoints: userData.groupAPoints,
        groupBPoints: userData.groupBPoints,
        groupCPoints: userData.groupCPoints,
        bonusPoints: userData.bonusPoints,
        totalPoints: userData.totalPoints,
        weeklyWins: userData.weeklyWins,
        bestGroupCFinish: userData.bestGroupCFinish,
        isCurrentLeader: index === 0, // First player is the leader
        isOnHotStreak: userData.weeklyWins > 1 // More than 1 win is a hot streak
      };
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};

/**
 * Calculate and update user points based on race results
 */
export const calculateUserPoints = async (raceResultId: string): Promise<boolean> => {
  try {
    // Get the race result
    const raceResultRef = doc(resultsRef, raceResultId);
    const raceResultDoc = await getDoc(raceResultRef);
    
    if (!raceResultDoc.exists()) {
      throw new Error("Race result not found");
    }
    
    // Get all users
    const usersSnapshot = await getDocs(usersRef);
    
    // Get detailed driver results
    const detailedResultsRef = collection(resultsRef, raceResultId, 'driverResults');
    const detailedResultsSnapshot = await getDocs(detailedResultsRef);
    
    const driverResults = detailedResultsSnapshot.docs.map(doc => doc.data());
    
    // For each user, calculate their points
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const squadRef = doc(db, 'squads', userDoc.id);
      const squadDoc = await getDoc(squadRef);
      
      if (!squadDoc.exists()) {
        continue;
      }
      
      const squadData = squadDoc.data();
      
      // Calculate points for each driver in the user's squad
      let groupAPoints = 0;
      let groupBPoints = 0;
      let groupCPoints = 0;
      
      // Group A driver
      const driverAResult = driverResults.find(r => r.driverId === squadData.driverA);
      if (driverAResult) {
        groupAPoints = driverAResult.points + (driverAResult.bonusPoints || 0);
      }
      
      // Group B driver
      const driverBResult = driverResults.find(r => r.driverId === squadData.driverB);
      if (driverBResult) {
        groupBPoints = driverBResult.points + (driverBResult.bonusPoints || 0);
      }
      
      // Group C driver
      const driverCResult = driverResults.find(r => r.driverId === squadData.driverC);
      if (driverCResult) {
        groupCPoints = driverCResult.points + (driverCResult.bonusPoints || 0);
        
        // Update best Group C finish if applicable
        if (driverCResult.points > 0) {
          const currentBest = userData.bestGroupCFinish;
          if (currentBest === 'N/A' || parseInt(currentBest.substring(1)) > driverCResult.position) {
            await updateDoc(doc(usersRef, userDoc.id), {
              bestGroupCFinish: `P${driverCResult.position}`
            });
          }
        }
      }
      
      // Calculate total race points
      const totalRacePoints = groupAPoints + groupBPoints + groupCPoints;
      
      // Update user's points
      await updateDoc(doc(usersRef, userDoc.id), {
        groupAPoints: increment(groupAPoints),
        groupBPoints: increment(groupBPoints),
        groupCPoints: increment(groupCPoints),
        totalPoints: increment(totalRacePoints),
        lastUpdated: serverTimestamp()
      });
    }
    
    // Determine the weekly winner
    const updatedUsersQuery = query(
      usersRef,
      orderBy("totalPoints", "desc"),
      limit(1)
    );
    
    const updatedUsersSnapshot = await getDocs(updatedUsersQuery);
    
    if (!updatedUsersSnapshot.empty) {
      const weeklyWinnerDoc = updatedUsersSnapshot.docs[0];
      await updateDoc(doc(usersRef, weeklyWinnerDoc.id), {
        weeklyWins: increment(1)
      });
    }
    
    toast({
      title: "Points Calculated",
      description: "User points have been updated based on race results."
    });
    
    return true;
  } catch (error) {
    console.error("Error calculating user points:", error);
    toast({
      title: "Calculation Error",
      description: "Failed to calculate user points. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};
