
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, Flag, Users, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/auth/AuthContext';
import { Input } from '@/components/ui/input';
import { validateInviteCode, markInvitationUsed } from '@/services/inviteService';

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { currentUser, login, register } = useAuth();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for invite code in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (code) {
      setInviteCode(code);
      setIsLoginMode(false); // Switch to registration mode
      
      // Validate the invite code
      validateInviteCode(code).then(receiverEmail => {
        if (receiverEmail) {
          setEmail(receiverEmail);
          toast({
            title: "Invite Code Valid",
            description: "You've been invited to join F1 Mate Racer!",
          });
        } else {
          toast({
            title: "Invalid Invite Code",
            description: "The invite code is invalid or has already been used.",
            variant: "destructive",
          });
        }
      });
    }
  }, [location, toast]);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (isLoginMode) {
        const result = await login(email, password);
        if (result.success) {
          toast({
            title: `Welcome back!`,
            description: "You've successfully logged in.",
          });
          navigate('/dashboard');
        } else {
          setError(result.error || 'Invalid email or password');
          toast({
            title: "Login failed",
            description: result.error || "Invalid email or password.",
            variant: "destructive",
          });
        }
      } else {
        // Registration
        if (!name.trim()) {
          setError('Name is required');
          toast({
            title: "Registration failed",
            description: "Name is required.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        // Password validation
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          toast({
            title: "Registration failed",
            description: "Password must be at least 6 characters.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        // If invite code is provided, validate it again (to prevent tampering)
        if (inviteCode) {
          const validEmail = await validateInviteCode(inviteCode);
          if (!validEmail || validEmail !== email) {
            setError('Invalid invite code or email mismatch');
            toast({
              title: "Registration failed",
              description: "Invalid invite code or email doesn't match invitation.",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
        }
        
        const result = await register(name, email, password);
        if (result.success) {
          // If registration is successful and there's an invite code, mark it as used
          if (inviteCode) {
            await markInvitationUsed(inviteCode);
          }
          
          toast({
            title: "Registration successful!",
            description: "Your account has been created.",
          });
          navigate('/dashboard');
        } else {
          setError(result.error || 'Registration failed. Please try again.');
          toast({
            title: "Registration failed",
            description: result.error || "Please try a different email or check your information.",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      setError('An error occurred');
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
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
            </div>
          </div>
          
          <div id="auth-section" className="lg:w-1/2 animate-slide-from-right">
            <div className="glassmorphism rounded-xl p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">
                {isLoginMode ? 'Login' : 'Register'}
              </h2>
              
              <form onSubmit={handleAuth} className="space-y-4">
                {!isLoginMode && (
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                    <Input 
                      type="text" 
                      id="name"
                      className="w-full bg-white/10 border border-white/20 text-white"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLoginMode}
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                  <Input 
                    type="email" 
                    id="email"
                    className="w-full bg-white/10 border border-white/20 text-white"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    readOnly={!isLoginMode && !!inviteCode} // Make email readonly if it's from an invite
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                  <Input 
                    type="password" 
                    id="password"
                    className="w-full bg-white/10 border border-white/20 text-white"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {!isLoginMode && (
                    <p className="text-xs text-gray-400 mt-1">Password must be at least 6 characters</p>
                  )}
                </div>
                
                {!isLoginMode && (
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="inviteCode">Invite Code</label>
                    <Input 
                      type="text" 
                      id="inviteCode"
                      className="w-full bg-white/10 border border-white/20 text-white"
                      placeholder="Optional - Enter invite code"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                    />
                  </div>
                )}
                
                {error && (
                  <div className="text-red-400 text-sm">{error}</div>
                )}
                
                {isLoginMode && (
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="remember" 
                      className="rounded mr-2"
                      defaultChecked
                    />
                    <label htmlFor="remember" className="text-sm">Stay logged in</label>
                  </div>
                )}
                
                <Button 
                  className="w-full bg-f1-red hover:bg-f1-red/90"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading 
                    ? (isLoginMode ? 'Logging in...' : 'Registering...') 
                    : (isLoginMode ? 'Login' : 'Register')}
                </Button>
                
                <div className="text-center mt-4">
                  <button 
                    type="button"
                    className="text-f1-red hover:underline"
                    onClick={toggleMode}
                  >
                    {isLoginMode 
                      ? "Don't have an account? Register" 
                      : "Already have an account? Login"}
                  </button>
                </div>
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
