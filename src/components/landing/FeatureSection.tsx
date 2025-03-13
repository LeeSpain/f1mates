
import React from 'react';
import { Users, Trophy, Clock, Medal } from 'lucide-react';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

export const FeatureSection: React.FC = () => {
  const features: Feature[] = [
    {
      icon: Users,
      title: "Strategic Driver Selection",
      description: "Draft drivers from three groups: elite (A), midfield (B), and underdogs (C). Each with their own strategic rules and opportunities."
    },
    {
      icon: Trophy,
      title: "Weekly Competitions",
      description: "Compete against your friends in weekly race challenges and see your results immediately after real F1 races."
    },
    {
      icon: Clock,
      title: "Dynamic Season Management",
      description: "Adapt your strategy with 6 Group B swaps per season and weekly Group C changes before each race."
    },
    {
      icon: Medal,
      title: "Bonus Points Opportunities",
      description: "Earn bonus points through successful predictions, group C drivers finishing in points, and special mate challenges."
    }
  ];

  return (
    <section id="features" className="py-16 bg-gradient-to-b from-f1-darkBlue/50 to-black/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How F1 Mate Racer Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="glassmorphism p-6 rounded-lg transition-transform hover:translate-y-[-5px]">
              <div className="flex justify-center mb-4">
                <div className="bg-f1-red/20 p-3 rounded-full">
                  <feature.icon className="h-6 w-6 text-f1-red" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">{feature.title}</h3>
              <p className="text-gray-300 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
