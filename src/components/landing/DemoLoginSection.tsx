
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { loginWithEmailAndPassword } from '@/lib/firebase/authService';
import { createDefaultAdminAccount } from '@/auth/userService';
import { useToast } from '@/hooks/use-toast';

export const DemoLoginSection: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      // Make sure admin account exists
      await createDefaultAdminAccount();
      
      // Try to login with admin credentials
      const result = await loginWithEmailAndPassword('admin@f1mates.app', 'admin123');
      
      if (result.success) {
        toast({
          title: "Demo Login Successful",
          description: "You're now logged in with the admin account",
        });
        navigate('/dashboard');
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Demo login error:", error);
      toast({
        title: "Demo Login Failed",
        description: "Could not login with the demo account. Please try again or sign up.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-f1-darkBlue/70 to-black">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Try a Demo</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Not ready to sign up yet? Take a test drive with our demo account to see how F1 Mate Racer works.
        </p>
        <Button 
          size="lg" 
          variant="outline" 
          className="border-f1-red text-f1-red hover:bg-f1-red/10"
          onClick={handleDemoLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Try Demo Account"}
        </Button>
        <p className="mt-4 text-sm text-gray-400">
          No sign up required. One-click access to full features.
        </p>
      </div>
    </section>
  );
};
