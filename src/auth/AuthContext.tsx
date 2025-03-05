
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlayerStanding } from '@/data/mockData';

// Define the structure for a player/user
export interface User extends Omit<PlayerStanding, 'isCurrentLeader' | 'isOnHotStreak'> {
  email: string;
  password: string;
  avatar: string;
  isAdmin?: boolean;
}

// Define the auth context structure
interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Create the players data with login credentials
const players: User[] = [
  // Admin user
  { 
    id: 0, 
    name: "Admin", 
    email: "admin@f1mate.com",
    password: "admin123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    groupAPoints: 0, 
    groupBPoints: 0, 
    groupCPoints: 0,
    bonusPoints: 0, 
    totalPoints: 0, 
    weeklyWins: 0, 
    bestGroupCFinish: "N/A",
    isAdmin: true
  },
  { 
    id: 1, 
    name: "John", 
    email: "john@f1mate.com",
    password: "password1",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    groupAPoints: 350, 
    groupBPoints: 75, 
    groupCPoints: 0,
    bonusPoints: 60, 
    totalPoints: 485, 
    weeklyWins: 3, 
    bestGroupCFinish: "P8"
  },
  { 
    id: 2, 
    name: "Dave", 
    email: "dave@f1mate.com",
    password: "password2",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dave",
    groupAPoints: 325, 
    groupBPoints: 85, 
    groupCPoints: 15,
    bonusPoints: 45, 
    totalPoints: 470, 
    weeklyWins: 2, 
    bestGroupCFinish: "P6"
  },
  { 
    id: 3, 
    name: "Sarah", 
    email: "sarah@f1mate.com",
    password: "password3",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    groupAPoints: 295, 
    groupBPoints: 110, 
    groupCPoints: 20,
    bonusPoints: 35, 
    totalPoints: 460, 
    weeklyWins: 2, 
    bestGroupCFinish: "P5"
  },
  { 
    id: 4, 
    name: "Mike", 
    email: "mike@f1mate.com",
    password: "password4",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    groupAPoints: 340, 
    groupBPoints: 60, 
    groupCPoints: 0,
    bonusPoints: 25, 
    totalPoints: 425, 
    weeklyWins: 1, 
    bestGroupCFinish: "P11"
  },
  { 
    id: 5, 
    name: "Emma", 
    email: "emma@f1mate.com",
    password: "password5",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    groupAPoints: 300, 
    groupBPoints: 60, 
    groupCPoints: 15,
    bonusPoints: 40, 
    totalPoints: 415, 
    weeklyWins: 0, 
    bestGroupCFinish: "P7"
  },
  { 
    id: 6, 
    name: "Alex", 
    email: "alex@f1mate.com",
    password: "password6",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    groupAPoints: 290, 
    groupBPoints: 70, 
    groupCPoints: 10,
    bonusPoints: 30, 
    totalPoints: 400, 
    weeklyWins: 0, 
    bestGroupCFinish: "P9"
  },
];

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
});

// Create the auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing login on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('f1-mate-user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('f1-mate-user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = players.find(p => 
      p.email.toLowerCase() === email.toLowerCase() && 
      p.password === password
    );
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('f1-mate-user', JSON.stringify(user));
      localStorage.setItem('f1-mate-logged-in', 'true');
      return true;
    }
    
    return false;
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('f1-mate-user');
    localStorage.removeItem('f1-mate-logged-in');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Function to get all players (for leaderboard)
export const getAllPlayers = (): (User & { isCurrentLeader: boolean; isOnHotStreak: boolean })[] => {
  const { currentUser } = useAuth();
  
  // Filter out the admin user from the leaderboard
  return players
    .filter(player => !player.isAdmin)
    .map(player => ({
      ...player,
      isCurrentLeader: player.id === 1, // Assuming player 1 is always the leader for simplicity
      isOnHotStreak: player.weeklyWins > 1 // Consider players with more than 1 win on a hot streak
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);
};
