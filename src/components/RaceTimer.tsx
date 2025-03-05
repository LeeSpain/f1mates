
import React from 'react';
import { Clock } from 'lucide-react';

interface RaceTimerProps {
  nextRace: string;
  date: string;
}

export const RaceTimer = ({ nextRace, date }: RaceTimerProps) => {
  return (
    <div className="flex items-center bg-f1-black/50 py-1 px-3 rounded-full border border-f1-silver/20">
      <Clock className="h-4 w-4 mr-2 text-f1-red" />
      <span className="text-sm">
        Next Race: <span className="font-medium">{nextRace}</span>, {date}
      </span>
    </div>
  );
};
