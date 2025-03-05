
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(true);
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Simulate authentication
    localStorage.setItem('f1-mate-user', username);
    localStorage.setItem('f1-mate-logged-in', 'true');
    
    toast.success(`${isLogin ? 'Welcome back' : 'Account created'}! Taking you to your dashboard...`);
    
    // Redirect to dashboard after a brief delay for animation
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glassmorphism rounded-xl p-6 md:p-8 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login to Your Account' : 'Create Your Account'}
        </h2>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              placeholder="Enter your username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="stayLoggedIn" 
              checked={stayLoggedIn}
              onCheckedChange={(checked) => setStayLoggedIn(checked === true)}
            />
            <Label htmlFor="stayLoggedIn" className="text-sm">Stay logged in</Label>
          </div>
          
          <Button type="submit" className="w-full">
            {isLogin ? 'Login' : 'Create Account'}
          </Button>
          
          <div className="text-center text-sm mt-4">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button 
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-primary hover:underline"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-primary hover:underline"
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
