
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
  id: number;
  date: string;
  oldDriverId: number;
  newDriverId: number;
  group: DriverGroup;
}

export interface Prediction {
  id: number;
  race: string;
  prediction: string;
  result: 'pending' | 'correct' | 'incorrect';
  points: number;
}
