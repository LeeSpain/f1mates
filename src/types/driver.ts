
export type DriverGroup = 'A' | 'B' | 'C';

export interface Driver {
  id: number;
  name: string;
  team: string;
  group: DriverGroup;
  image: string;
  points: number;
  locked: boolean;
}

export interface Swap {
  id: number | string; // Allow both number and string IDs
  date: string;
  oldDriverId: number;
  newDriverId: number;
  group: DriverGroup;
}

export interface Prediction {
  id: number | string; // Allow both number and string IDs
  race: string;
  prediction: string;
  result: 'pending' | 'correct' | 'incorrect';
  points: number;
}
