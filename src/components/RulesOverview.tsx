
import React from 'react';

export const RulesOverview = () => {
  return (
    <div className="space-y-8">
      <div className="glassmorphism p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Draft Rules</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-lg mb-2">Group A - Top Tier</h4>
            <p className="text-gray-300">
              Group A drivers are the elite performers. Selection is via random draw, with ties resolved by coin flip. 
              Your Group A driver is locked for the entire season.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-2">Group B - Midfield</h4>
            <p className="text-gray-300">
              Group B drivers are the solid midfield performers. Selection is via snake draft in random order.
              You get 6 swaps throughout the entire season - use them wisely!
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-2">Group C - Underdogs</h4>
            <p className="text-gray-300">
              Group C drivers are the backmarkers and underdogs. Selection is via snake draft.
              You can change your Group C driver every week before the race.
            </p>
          </div>
        </div>
      </div>
      
      <div className="glassmorphism p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Points System</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-lg mb-2">Base Points</h4>
            <div className="grid grid-cols-5 gap-4">
              <div className="p-2 bg-white/10 rounded text-center">
                <div className="font-bold">P1</div>
                <div className="text-xl">25</div>
              </div>
              <div className="p-2 bg-white/10 rounded text-center">
                <div className="font-bold">P2</div>
                <div className="text-xl">18</div>
              </div>
              <div className="p-2 bg-white/10 rounded text-center">
                <div className="font-bold">P3</div>
                <div className="text-xl">15</div>
              </div>
              <div className="p-2 bg-white/10 rounded text-center">
                <div className="font-bold">P4</div>
                <div className="text-xl">12</div>
              </div>
              <div className="p-2 bg-white/10 rounded text-center">
                <div className="font-bold">P5</div>
                <div className="text-xl">10</div>
              </div>
              <div className="p-2 bg-white/10 rounded text-center">
                <div className="font-bold">P6</div>
                <div className="text-xl">8</div>
              </div>
              <div className="p-2 bg-white/10 rounded text-center">
                <div className="font-bold">P7</div>
                <div className="text-xl">6</div>
              </div>
              <div className="p-2 bg-white/10 rounded text-center">
                <div className="font-bold">P8</div>
                <div className="text-xl">4</div>
              </div>
              <div className="p-2 bg-white/10 rounded text-center">
                <div className="font-bold">P9</div>
                <div className="text-xl">2</div>
              </div>
              <div className="p-2 bg-white/10 rounded text-center">
                <div className="font-bold">P10</div>
                <div className="text-xl">1</div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-2">Bonus Points</h4>
            <div className="space-y-2">
              <div className="p-3 bg-white/10 rounded flex justify-between">
                <span>Fastest Lap (by any of your drivers)</span>
                <span className="font-bold text-green-400">+5</span>
              </div>
              <div className="p-3 bg-white/10 rounded flex justify-between">
                <span>Correct Prediction (submitted pre-race)</span>
                <span className="font-bold text-green-400">+10</span>
              </div>
              <div className="p-3 bg-white/10 rounded flex justify-between">
                <span>Group C driver finishes in Top 10</span>
                <span className="font-bold text-green-400">+15</span>
              </div>
              <div className="p-3 bg-white/10 rounded flex justify-between">
                <span>Mate Challenge (with proof in chat)</span>
                <span className="font-bold text-green-400">+5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glassmorphism p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Deadlines</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-f1-red">•</span>
            <span>All swaps and weekly picks must be submitted by Thursday before the race weekend.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-f1-red">•</span>
            <span>Predictions must be submitted by Friday before the race.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-f1-red">•</span>
            <span>Race results are recorded after the official F1 results are published.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-f1-red">•</span>
            <span>Challenge proofs must be submitted within 24 hours of the race ending.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
