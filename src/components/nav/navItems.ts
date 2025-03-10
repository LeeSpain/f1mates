
import { Users, Trophy, Flag, Shuffle, MessageCircle, ScrollText, HelpCircle } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export type Tab = 'mySquad' | 'leaderboard' | 'raceResults' | 'swapsAndPicks' | 'chat' | 'rules' | 'help';

export interface NavItem {
  id: Tab;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { id: 'mySquad', label: 'My Squad', icon: Users },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'raceResults', label: 'Race Results', icon: Flag },
  { id: 'swapsAndPicks', label: 'Swaps & Picks', icon: Shuffle },
  { id: 'chat', label: 'Banter Zone', icon: MessageCircle },
  { id: 'rules', label: 'Rules', icon: ScrollText },
  { id: 'help', label: 'Help', icon: HelpCircle },
];
