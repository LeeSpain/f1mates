
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8 overflow-hidden">
        <div className="absolute inset-0 bg-f1-red rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 w-4 h-1 bg-white -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full"></div>
      </div>
      <span className="font-display text-xl font-bold">F1 Mate Racer</span>
    </div>
  );
};

export default Logo;
