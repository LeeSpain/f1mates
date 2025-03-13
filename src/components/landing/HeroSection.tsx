
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onGetStartedClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStartedClick }) => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient opacity-20 z-0"></div>
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 leading-tight">
            F1 Fantasy Racing <span className="text-f1-red">with Your Mates</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Draft your F1 dream team, make strategic driver swaps, and compete against your friends in the ultimate F1 fantasy experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              size="lg" 
              className="bg-f1-red hover:bg-f1-red/90" 
              onClick={onGetStartedClick}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/20 hover:bg-white/10"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
