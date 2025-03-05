
import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon } from 'lucide-react';

interface RaceTimerProps {
  nextRace: {
    name: string;
    date: string;
    time: string;
  };
}

const RaceTimer: React.FC<RaceTimerProps> = ({ nextRace }) => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date(`${nextRace.date}T${nextRace.time}`);
    
    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        // Race has started
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeRemaining({ days, hours, minutes, seconds });
    };
    
    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);
    
    return () => clearInterval(timer);
  }, [nextRace]);

  return (
    <div className="glassmorphism rounded-lg p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">Next Race</h3>
        <span className="text-primary text-sm font-medium px-2 py-1 bg-primary/10 rounded-full">Live Countdown</span>
      </div>
      
      <div className="mb-4">
        <h4 className="font-display text-xl font-bold">{nextRace.name}</h4>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1" />
            <span>{nextRace.date}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-1" />
            <span>{nextRace.time}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-background p-2 rounded-md">
          <div className="text-xl font-bold">{timeRemaining.days}</div>
          <div className="text-xs text-muted-foreground">Days</div>
        </div>
        <div className="bg-background p-2 rounded-md">
          <div className="text-xl font-bold">{timeRemaining.hours}</div>
          <div className="text-xs text-muted-foreground">Hours</div>
        </div>
        <div className="bg-background p-2 rounded-md">
          <div className="text-xl font-bold">{timeRemaining.minutes}</div>
          <div className="text-xs text-muted-foreground">Mins</div>
        </div>
        <div className="bg-background p-2 rounded-md">
          <div className="text-xl font-bold">{timeRemaining.seconds}</div>
          <div className="text-xs text-muted-foreground">Secs</div>
        </div>
      </div>
    </div>
  );
};

export default RaceTimer;
