
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, Flag, Users, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('f1-mate-logged-in') === 'true';
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleDemoLogin = () => {
    // For demo purposes, set logged in state
    localStorage.setItem('f1-mate-logged-in', 'true');
    toast({
      title: "Welcome to F1 Mate Racer!",
      description: "You've successfully logged in.",
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-f1-darkBlue to-black text-white">
      {/* Racing line animation */}
      <div className="fixed top-0 left-0 w-full h-1 overflow-hidden">
        <div className="absolute inset-0 bg-f1-red animate-race-by"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 flex flex-col flex-1">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="heading-xl mb-4">F1 Mate Racer</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-300">
            Pick your drivers, swap your flops, and flex on your mates!
          </p>
        </header>
        
        <main className="flex-1 flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2 animate-slide-from-left">
            <div className="space-y-6 max-w-xl">
              <div className="glassmorphism rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4">How It Works</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-f1-red rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold">1</div>
                    <p>Draft F1 drivers from 3 tiers: Group A (top), Group B (mid), and Group C (underdogs)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-f1-red rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold">2</div>
                    <p>Score points each race based on your drivers' finishes, exactly like real F1</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-f1-red rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold">3</div>
                    <p>Make strategic swaps: Group A locked, 6 Group B swaps, weekly Group C changes</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-f1-red rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold">4</div>
                    <p>Earn bonus points with predictions, challenges, and smart picks</p>
                  </div>
                </div>
              </div>
              
              <div className="glassmorphism rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4">Perfect For Mates</h2>
                <p className="mb-4">
                  Designed for 4-6 players, F1 Mate Racer combines fantasy sports with the 
                  perfect amount of strategy and banter. Get your crew together, draft your 
                  dream team, and battle all season long!
                </p>
                <Button size="lg" className="w-full bg-f1-red hover:bg-f1-red/90" onClick={handleDemoLogin}>
                  <span>Get Started</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div id="auth-section" className="lg:w-1/2 animate-slide-from-right">
            <div className="glassmorphism rounded-xl p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Login / Register</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email"
                    className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                  <input 
                    type="password" 
                    id="password"
                    className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    className="rounded mr-2"
                    defaultChecked
                  />
                  <label htmlFor="remember" className="text-sm">Stay logged in</label>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Button 
                  className="w-full bg-f1-red hover:bg-f1-red/90" 
                  onClick={handleDemoLogin}
                >
                  Login
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10" 
                  onClick={handleDemoLogin}
                >
                  Register
                </Button>
                <p className="text-xs text-center text-gray-400 mt-4">
                  For demo purposes, all buttons will log you in
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <footer className="py-4 text-center text-sm text-gray-500">
        Built with ❤️ for F1 fans | 2025 Season
      </footer>
    </div>
  );
};

export default Index;
