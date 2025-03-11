
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PlayerStanding } from '@/data/mockData';
import { User } from '@/auth/types';

// Collection references
const usersRef = collection(db, 'users');

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

// Re-export functions from other services for backward compatibility
export { getRaceResults } from './raceResultsService';
export { calculateUserPoints } from './pointsCalculationService';
