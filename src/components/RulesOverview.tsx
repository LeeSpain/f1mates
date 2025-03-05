
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  BookIcon,
  CircleDotIcon,
  CoinsIcon,
  FlagIcon,
  RefreshCwIcon,
  TrophyIcon,
  UsersIcon
} from 'lucide-react';

const RulesOverview: React.FC = () => {
  return (
    <div className="glassmorphism rounded-lg p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <BookIcon className="h-6 w-6" />
        <h2 className="text-2xl font-bold">F1 Mate Racer: The Rules</h2>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="draft">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              <span>Draft Rules</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <p>
              The F1 Mate Racer draft divides the F1 grid into three tiers, ensuring a balanced and strategic selection process:
            </p>
            
            <div className="bg-card rounded-lg p-4 border border-border">
              <h4 className="font-bold mb-2">Group A (Top Tier)</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Max Verstappen, Charles Leclerc, Lando Norris, Lance Stroll, Pierre Gasly, Esteban Ocon</li>
                <li>Draft Method: Secret picks with raffle to resolve ties</li>
                <li>Season-Long: Once selected, Group A driver is locked for the season</li>
              </ul>
            </div>
            
            <div className="bg-card rounded-lg p-4 border border-border">
              <h4 className="font-bold mb-2">Group B (Midfield)</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Lewis Hamilton, George Russell, Carlos Sainz, Oscar Piastri, Fernando Alonso, Sergio Perez</li>
                <li>Draft Method: Snake draft (random order, reverses for each pick)</li>
                <li>Flexibility: 6 swaps allowed throughout the season</li>
              </ul>
            </div>
            
            <div className="bg-card rounded-lg p-4 border border-border">
              <h4 className="font-bold mb-2">Group C (Underdogs)</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Valtteri Bottas, Guanyu Zhou, Kevin Magnussen, Nico Hulkenberg, Logan Sargeant, Daniel Ricciardo</li>
                <li>Draft Method: Standard draft order (same as Group B)</li>
                <li>Flexibility: Weekly swaps allowed before each race</li>
              </ul>
            </div>
            
            <p className="text-sm bg-muted p-3 rounded-md">
              Note: With 6 drivers per group, the draft works perfectly for 6 players. 
              With 4-5 players, leftover drivers remain available for swaps.
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="swaps">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <RefreshCwIcon className="h-5 w-5" />
              <span>Swap Rules</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <p>
              Strategic driver swaps are a key part of F1 Mate Racer, allowing you to adapt to changing performance:
            </p>
            
            <div className="bg-card rounded-lg p-4 border border-border">
              <h4 className="font-bold mb-2">Group A (Top Tier)</h4>
              <p className="text-muted-foreground">
                No swaps allowed - you're committed to your Group A driver for the full season.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-4 border border-border">
              <h4 className="font-bold mb-2">Group B (Midfield)</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Limited to 6 swaps for the entire season</li>
                <li>Can swap before any race (deadline: Thursday before race weekend)</li>
                <li>Only available drivers can be selected (not owned by other players)</li>
                <li>Once 6 swaps are used, your Group B driver is locked for remaining races</li>
              </ul>
            </div>
            
            <div className="bg-card rounded-lg p-4 border border-border">
              <h4 className="font-bold mb-2">Group C (Underdogs)</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Weekly swaps allowed before each race</li>
                <li>Same deadline: Thursday before race weekend</li>
                <li>Only available drivers can be selected</li>
                <li>No limit on number of Group C swaps throughout the season</li>
              </ul>
            </div>
            
            <p className="text-sm bg-primary/10 p-3 rounded-md text-primary font-medium">
              Swap Deadline: All swaps must be confirmed by Thursday, 18:00 GMT before each race weekend.
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="points">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <CoinsIcon className="h-5 w-5" />
              <span>Points System</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <p>
              The F1 Mate Racer scoring system mirrors F1's own point structure, with additional bonuses for skill and fun:
            </p>
            
            <div className="bg-card rounded-lg p-4 border border-border">
              <h4 className="font-bold mb-2">Base Points (Per Driver)</h4>
              <div className="grid grid-cols-5 gap-2 text-sm">
                <div className="p-2 rounded-md text-center bg-muted">
                  <div className="font-bold">P1</div>
                  <div>25 pts</div>
                </div>
                <div className="p-2 rounded-md text-center bg-muted">
                  <div className="font-bold">P2</div>
                  <div>18 pts</div>
                </div>
                <div className="p-2 rounded-md text-center bg-muted">
                  <div className="font-bold">P3</div>
                  <div>15 pts</div>
                </div>
                <div className="p-2 rounded-md text-center bg-muted">
                  <div className="font-bold">P4</div>
                  <div>10 pts</div>
                </div>
                <div className="p-2 rounded-md text-center bg-muted">
                  <div className="font-bold">P5</div>
                  <div>8 pts</div>
                </div>
                <div className="p-2 rounded-md text-center bg-muted">
                  <div className="font-bold">P6</div>
                  <div>6 pts</div>
                </div>
                <div className="p-2 rounded-md text-center bg-muted">
                  <div className="font-bold">P7</div>
                  <div>4 pts</div>
                </div>
                <div className="p-2 rounded-md text-center bg-muted">
                  <div className="font-bold">P8</div>
                  <div>3 pts</div>
                </div>
                <div className="p-2 rounded-md text-center bg-muted">
                  <div className="font-bold">P9</div>
                  <div>2 pts</div>
                </div>
                <div className="p-2 rounded-md text-center bg-muted">
                  <div className="font-bold">P10</div>
                  <div>1 pt</div>
                </div>
              </div>
              <div className="mt-2 text-center text-sm text-muted-foreground">
                P11 and beyond: 0 points
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-4 border border-border">
              <h4 className="font-bold mb-2">Bonus Points</h4>
              <ul className="space-y-2">
                <li className="flex justify-between p-2 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <CircleDotIcon className="h-4 w-4 text-primary" />
                    <span>Fastest Lap</span>
                  </div>
                  <span className="font-bold">+5 points</span>
                </li>
                <li className="flex justify-between p-2 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <CircleDotIcon className="h-4 w-4 text-primary" />
                    <span>Prediction Bonus (weekly prediction)</span>
                  </div>
                  <span className="font-bold">+10 points</span>
                </li>
                <li className="flex justify-between p-2 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <CircleDotIcon className="h-4 w-4 text-primary" />
                    <span>Group C driver finishes in Top 10</span>
                  </div>
                  <span className="font-bold">+15 points</span>
                </li>
                <li className="flex justify-between p-2 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <CircleDotIcon className="h-4 w-4 text-primary" />
                    <span>Mate Challenge (with proof in chat)</span>
                  </div>
                  <span className="font-bold">+5 points</span>
                </li>
              </ul>
            </div>
            
            <p className="text-sm bg-muted p-3 rounded-md">
              Your weekly points are calculated by adding the base points earned by each of your three drivers, 
              plus any bonus points earned. Season standings accumulate all weekly points.
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="winning">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <TrophyIcon className="h-5 w-5" />
              <span>Winning & Championships</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <p>
              F1 Mate Racer offers both weekly glory and season-long bragging rights:
            </p>
            
            <div className="bg-card rounded-lg p-4 border border-border">
              <h4 className="font-bold mb-2">Weekly Winner</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Highest point scorer for that race weekend</li>
                <li>Gets a "Hot Streak" badge on the leaderboard</li>
                <li>May choose the next Mate Challenge</li>
              </ul>
            </div>
            
            <div className="bg-card rounded-lg p-4 border border-border">
              <h4 className="font-bold mb-2">Season Champion</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Highest cumulative points across all races</li>
                <li>Gets the crown icon on the final leaderboard</li>
                <li>Earns ultimate bragging rights until next season</li>
                <li>May get to choose the season prize, if applicable</li>
              </ul>
            </div>
            
            <div className="bg-card rounded-lg p-4 border border-border">
              <h4 className="font-bold mb-2">Tie-Breakers</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Most weekly wins</li>
                <li>Best Group C performance (highest finishing position)</li>
                <li>Most bonus points earned</li>
                <li>If still tied, co-champions are declared</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="season">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <FlagIcon className="h-5 w-5" />
              <span>2025 Season Calendar</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card rounded-lg p-4 border border-border">
                <h4 className="font-bold mb-2">First Half</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>March 2: Bahrain Grand Prix</li>
                  <li>March 9: Saudi Arabian Grand Prix</li>
                  <li>March 23: Australian Grand Prix</li>
                  <li>April 6: Japanese Grand Prix</li>
                  <li>April 20: Chinese Grand Prix</li>
                  <li>May 4: Miami Grand Prix</li>
                  <li>May 18: Emilia Romagna Grand Prix</li>
                  <li>May 25: Monaco Grand Prix</li>
                  <li>June 8: Canadian Grand Prix</li>
                  <li>June 22: Spanish Grand Prix</li>
                  <li>July 6: Austrian Grand Prix</li>
                  <li>July 13: British Grand Prix</li>
                </ul>
              </div>
              
              <div className="bg-card rounded-lg p-4 border border-border">
                <h4 className="font-bold mb-2">Second Half</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>July 27: Hungarian Grand Prix</li>
                  <li>August 3: Belgian Grand Prix</li>
                  <li>August 31: Dutch Grand Prix</li>
                  <li>September 7: Italian Grand Prix</li>
                  <li>September 21: Azerbaijan Grand Prix</li>
                  <li>October 5: Singapore Grand Prix</li>
                  <li>October 19: United States Grand Prix</li>
                  <li>October 26: Mexico City Grand Prix</li>
                  <li>November 9: Brazilian Grand Prix</li>
                  <li>November 23: Las Vegas Grand Prix</li>
                  <li>November 30: Qatar Grand Prix</li>
                  <li>December 7: Abu Dhabi Grand Prix</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default RulesOverview;
