
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, Flag, Users, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/auth/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: `Welcome back, ${email.split('@')[0]}!`,
          description: "You've successfully logged in.",
        });
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
        toast({
          title: "Login failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError('An error occurred during login');
      toast({
        title: "Login error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password' + demoEmail.charAt(0));
    
    // Manually trigger login after state update
    setTimeout(async () => {
      setIsLoading(true);
      const success = await login(demoEmail, 'password' + demoEmail.charAt(0));
      
      if (success) {
        toast({
          title: `Welcome, ${demoEmail.split('@')[0]}!`,
          description: "You've logged in with demo credentials.",
        });
        navigate('/dashboard');
      }
      setIsLoading(false);
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-f1-darkBlue to-black text-white">
      {/* Racing line animation */}
      <div className="fixed top-0 left-0 w-full h-1 overflow-hidden">
        <div className="absolute inset-0 bg-f1-red animate-race-by"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 flex flex-col flex-1">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">F1 Mate Racer</h1>
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
                <h2 className="text-2xl font-bold mb-4">Demo Accounts</h2>
                <p className="mb-4">
                  Try out the app with one of our 6 player accounts:
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10" 
                    onClick={() => handleDemoLogin('john@f1mate.com')}
                    disabled={isLoading}
                  >
                    Login as John
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10" 
                    onClick={() => handleDemoLogin('dave@f1mate.com')}
                    disabled={isLoading}
                  >
                    Login as Dave
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10" 
                    onClick={() => handleDemoLogin('sarah@f1mate.com')}
                    disabled={isLoading}
                  >
                    Login as Sarah
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10" 
                    onClick={() => handleDemoLogin('mike@f1mate.com')}
                    disabled={isLoading}
                  >
                    Login as Mike
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10" 
                    onClick={() => handleDemoLogin('emma@f1mate.com')}
                    disabled={isLoading}
                  >
                    Login as Emma
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10" 
                    onClick={() => handleDemoLogin('alex@f1mate.com')}
                    disabled={isLoading}
                  >
                    Login as Alex
                  </Button>
                </div>
                <p className="text-xs text-center text-gray-400">
                  All demo accounts use the password format "password" + first letter of name (e.g., "password1" for John)
                </p>
              </div>
            </div>
          </div>
          
          <div id="auth-section" className="lg:w-1/2 animate-slide-from-right">
            <div className="glassmorphism rounded-xl p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email"
                    className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                  <input 
                    type="password" 
                    id="password"
                    className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {error && (
                  <div className="text-red-400 text-sm">{error}</div>
                )}
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    className="rounded mr-2"
                    defaultChecked
                  />
                  <label htmlFor="remember" className="text-sm">Stay logged in</label>
                </div>
                
                <Button 
                  className="w-full bg-f1-red hover:bg-f1-red/90"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
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
