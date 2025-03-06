
import { PlayerStanding } from '@/data/mockData';

// Define the structure for a player/user
export interface User extends Omit<PlayerStanding, 'isCurrentLeader' | 'isOnHotStreak'> {
  email: string;
  avatar: string;
  isAdmin?: boolean;
  uid?: string; // Firebase UID
  sentInvites?: string[]; // Emails of people invited
}

// Define the auth context structure
export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  isLoading: boolean;
}
