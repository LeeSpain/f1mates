
import { Driver, Swap, Prediction } from '@/types/driver';

// All available drivers
export const allDrivers: Driver[] = [
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

// My squad - This will be replaced with real data from Firebase
export const mySquad: Driver[] = [
  allDrivers[0], // Verstappen
  allDrivers[6], // Albon
  allDrivers[12], // Tsunoda
];

// Swaps history - This will be replaced with real data from Firebase
export const swapHistory: Swap[] = [
  { id: 1, date: "2025-03-01", oldDriverId: 9, newDriverId: 7, group: "B" }, // Swapped Gasly for Albon
];

// Predictions - This will be replaced with real data from Firebase
export const predictions: Prediction[] = [
  { id: 1, race: "Bahrain GP", prediction: "Hamilton will finish on the podium", result: "correct", points: 10 },
  { id: 2, race: "Saudi GP", prediction: "Piastri will score points", result: "pending", points: 0 },
];

// Leaderboard data
export interface PlayerStanding {
  id: number;
  name: string;
  groupAPoints: number;
  groupBPoints: number;
  groupCPoints: number;
  bonusPoints: number;
  totalPoints: number;
  weeklyWins: number;
  bestGroupCFinish: string;
  isCurrentLeader: boolean;
  isOnHotStreak: boolean;
}

// These will be replaced by real data from Firebase in production
export const leaderboard: PlayerStanding[] = [
  { 
    id: 1, 
    name: "You", 
    groupAPoints: 350, 
    groupBPoints: 75, 
    bonusPoints: 60, 
    groupCPoints: 0, 
    totalPoints: 485, 
    weeklyWins: 3, 
    bestGroupCFinish: "P8", 
    isCurrentLeader: true,
    isOnHotStreak: true
  },
  { 
    id: 2, 
    name: "Dave", 
    groupAPoints: 325, 
    groupBPoints: 85, 
    bonusPoints: 45, 
    groupCPoints: 15, 
    totalPoints: 470, 
    weeklyWins: 2, 
    bestGroupCFinish: "P6", 
    isCurrentLeader: false,
    isOnHotStreak: false
  },
  { 
    id: 3, 
    name: "Sarah", 
    groupAPoints: 295, 
    groupBPoints: 110, 
    bonusPoints: 35, 
    groupCPoints: 20, 
    totalPoints: 460, 
    weeklyWins: 2, 
    bestGroupCFinish: "P5", 
    isCurrentLeader: false,
    isOnHotStreak: false
  },
  { 
    id: 4, 
    name: "Mike", 
    groupAPoints: 340, 
    groupBPoints: 60, 
    bonusPoints: 25, 
    groupCPoints: 0, 
    totalPoints: 425, 
    weeklyWins: 1, 
    bestGroupCFinish: "P11", 
    isCurrentLeader: false,
    isOnHotStreak: false
  },
  { 
    id: 5, 
    name: "Emma", 
    groupAPoints: 300, 
    groupBPoints: 60, 
    bonusPoints: 40, 
    groupCPoints: 15, 
    totalPoints: 415, 
    weeklyWins: 0, 
    bestGroupCFinish: "P7", 
    isCurrentLeader: false,
    isOnHotStreak: false
  },
];

// Race results data
export interface RaceResult {
  id: number;
  raceName: string;
  date: string;
  results: {
    driverId: number;
    position: number;
    points: number;
    bonusPoints: number;
    bonusReason?: string;
  }[];
}

export const raceResults: RaceResult[] = [
  {
    id: 1,
    raceName: "Bahrain GP",
    date: "2025-03-02",
    results: [
      { driverId: 1, position: 1, points: 25, bonusPoints: 5, bonusReason: "Fastest Lap" },
      { driverId: 2, position: 2, points: 18, bonusPoints: 0 },
      { driverId: 3, position: 3, points: 15, bonusPoints: 0 },
      { driverId: 4, position: 4, points: 12, bonusPoints: 0 },
      { driverId: 5, position: 5, points: 10, bonusPoints: 0 },
      { driverId: 6, position: 6, points: 8, bonusPoints: 0 },
      { driverId: 8, position: 7, points: 6, bonusPoints: 0 },
      { driverId: 10, position: 8, points: 4, bonusPoints: 0 },
      { driverId: 7, position: 9, points: 2, bonusPoints: 0 },
      { driverId: 9, position: 10, points: 1, bonusPoints: 0 },
      { driverId: 12, position: 11, points: 0, bonusPoints: 0 },
      { driverId: 11, position: 12, points: 0, bonusPoints: 0 },
      { driverId: 18, position: 13, points: 0, bonusPoints: 0 },
      { driverId: 14, position: 14, points: 0, bonusPoints: 0 },
      { driverId: 15, position: 15, points: 0, bonusPoints: 0 },
      { driverId: 16, position: 16, points: 0, bonusPoints: 0 },
      { driverId: 17, position: 17, points: 0, bonusPoints: 0 },
      { driverId: 13, position: 18, points: 0, bonusPoints: 0 },
    ]
  }
];

// Chat messages for the banter zone
export interface ChatMessage {
  id: number;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  isYou: boolean;
}

// These will be replaced by real data from Firebase in production
export const chatMessages: ChatMessage[] = [
  {
    id: 1,
    user: "You",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    content: "Max is unstoppable, losers!",
    timestamp: "2025-03-02T14:30:00Z",
    isYou: true
  },
  {
    id: 2,
    user: "Dave",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dave",
    content: "Wait till Leclerc wakes up lol",
    timestamp: "2025-03-02T14:32:00Z",
    isYou: false
  },
  {
    id: 3,
    user: "Sarah",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content: "My Alonso pick is going to crush your Albon soon",
    timestamp: "2025-03-02T14:33:00Z",
    isYou: false
  },
  {
    id: 4,
    user: "Mike",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    content: "Who's going to Saudi next week?",
    timestamp: "2025-03-02T14:35:00Z",
    isYou: false
  },
  {
    id: 5,
    user: "Emma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    content: "Anyone else making Group C swaps for Saudi? Thinking of dropping Zhou.",
    timestamp: "2025-03-02T14:40:00Z",
    isYou: false
  },
];
