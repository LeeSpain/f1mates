
import { toast } from '@/hooks/use-toast';

// F1 Data Types
export interface F1Race {
  id: string;
  season: string;
  round: string;
  raceName: string;
  date: string;
  time?: string;
  Circuit: {
    circuitId: string;
    circuitName: string;
    Location: {
      country: string;
    }
  };
}

export interface F1Result {
  position: string;
  points: string;
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    code: string;
    nationality: string;
  };
  Constructor: {
    constructorId: string;
    name: string;
    nationality: string;
  };
  grid: string;
  laps: string;
  status: string;
  Time?: {
    time: string;
  };
  FastestLap?: {
    rank: string;
    lap: string;
    Time: {
      time: string;
    };
  };
}

export interface F1RaceResult {
  id: string;
  raceName: string;
  date: string;
  circuit: string;
  results: {
    position: number;
    driverId: string;
    driverName: string;
    driverCode: string;
    team: string;
    points: number;
    bonusPoints: number;
    bonusReason?: string;
  }[];
}

// Base URL for Ergast F1 API
const API_BASE_URL = 'https://ergast.com/api/f1';

/**
 * Fetches F1 race schedule for a given season
 * @param season The F1 season year (default: current year)
 * @returns Array of F1Race objects
 */
export const getF1RaceSchedule = async (season: string = new Date().getFullYear().toString()): Promise<F1Race[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${season}.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch race schedule');
    }
    
    const data = await response.json();
    return data.MRData.RaceTable.Races;
  } catch (error) {
    console.error('Error fetching F1 race schedule:', error);
    toast({
      title: 'Error',
      description: 'Failed to fetch F1 race schedule. Please try again later.',
      variant: 'destructive',
    });
    return [];
  }
};

/**
 * Fetches race results for a specific race
 * @param season The F1 season year
 * @param round The race round number
 * @returns Formatted F1RaceResult object
 */
export const getF1RaceResults = async (season: string, round: string): Promise<F1RaceResult | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${season}/${round}/results.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch race results');
    }
    
    const data = await response.json();
    const race = data.MRData.RaceTable.Races[0];
    
    if (!race) {
      return null;
    }
    
    // Format the race results
    const formattedResults = {
      id: `${season}-${round}`,
      raceName: race.raceName,
      date: race.date,
      circuit: race.Circuit.circuitName,
      results: race.Results.map((result: F1Result) => {
        // Calculate any bonus points (example: fastest lap)
        const hasBonusPoint = result.FastestLap && result.FastestLap.rank === "1";
        
        return {
          position: parseInt(result.position),
          driverId: result.Driver.driverId,
          driverName: `${result.Driver.givenName} ${result.Driver.familyName}`,
          driverCode: result.Driver.code,
          team: result.Constructor.name,
          points: parseFloat(result.points),
          bonusPoints: hasBonusPoint ? 1 : 0,
          bonusReason: hasBonusPoint ? 'Fastest Lap' : undefined
        };
      })
    };
    
    return formattedResults;
  } catch (error) {
    console.error('Error fetching F1 race results:', error);
    toast({
      title: 'Error',
      description: 'Failed to fetch race results. Please try again later.',
      variant: 'destructive',
    });
    return null;
  }
};

/**
 * Get the latest completed race results
 * @returns The most recent race result
 */
export const getLatestRaceResults = async (): Promise<F1RaceResult | null> => {
  const currentYear = new Date().getFullYear().toString();
  
  try {
    // First get the race schedule to find the latest race
    const races = await getF1RaceSchedule(currentYear);
    
    if (races.length === 0) {
      return null;
    }
    
    // Find the most recent race that has already happened
    const now = new Date();
    let latestPastRace = null;
    
    for (const race of races) {
      const raceDate = new Date(race.date);
      if (raceDate < now) {
        latestPastRace = race;
      } else {
        break;
      }
    }
    
    if (!latestPastRace) {
      // If no past races this season, try to get the last race of previous season
      return getF1RaceResults((parseInt(currentYear) - 1).toString(), '22');
    }
    
    // Get the results for the latest race
    return getF1RaceResults(currentYear, latestPastRace.round);
  } catch (error) {
    console.error('Error getting latest race results:', error);
    return null;
  }
};
