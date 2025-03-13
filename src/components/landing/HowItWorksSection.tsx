
import React from 'react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-black/70 to-f1-darkBlue/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How to Play</h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3 flex justify-center">
                <div className="bg-f1-red rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold">1</div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-bold mb-2">Join or Create a League</h3>
                <p className="text-gray-300">
                  Sign up for an account, then either create your own league to invite your friends or join an existing league with an invite code.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3 flex justify-center">
                <div className="bg-f1-red rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold">2</div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-bold mb-2">Draft Your Drivers</h3>
                <p className="text-gray-300">
                  Participate in the season draft to select your drivers from three groups: Group A (top drivers), Group B (midfield), and Group C (underdogs).
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3 flex justify-center">
                <div className="bg-f1-red rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold">3</div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-bold mb-2">Make Strategic Swaps</h3>
                <p className="text-gray-300">
                  Use your 6 seasonal Group B swaps wisely and change your Group C driver weekly to maximize your points potential based on upcoming tracks.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3 flex justify-center">
                <div className="bg-f1-red rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold">4</div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-bold mb-2">Submit Predictions & Compete</h3>
                <p className="text-gray-300">
                  Make weekly predictions for bonus points, challenge your mates, and watch your score climb after each race as your drivers earn points.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
