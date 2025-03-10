
import React from 'react';

interface DeadlineNoticeProps {
  raceTitle: string;
  dayOfWeek?: string;
}

export const DeadlineNotice = ({ 
  raceTitle, 
  dayOfWeek = "Thursday" 
}: DeadlineNoticeProps) => {
  return (
    <div className="rounded-md bg-f1-darkBlue/50 p-4 border border-f1-silver/10">
      <h3 className="font-medium text-sm text-white mb-2">Next Deadline</h3>
      <p className="text-xs text-gray-300">Submit picks by {dayOfWeek} before the {raceTitle}</p>
    </div>
  );
};
