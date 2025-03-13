
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import AuthForm from '@/components/AuthForm';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureSection } from '@/components/landing/FeatureSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { TestimonialSection } from '@/components/landing/TestimonialSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { DemoLoginSection } from '@/components/landing/DemoLoginSection';
import { FooterSection } from '@/components/landing/FooterSection';

const Index: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const authFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If the user is logged in, redirect to dashboard
    if (currentUser) {
      navigate('/dashboard');
    }

    // Add race line animation class to the body
    document.body.classList.add('bg-gradient-to-b', 'from-f1-darkBlue', 'to-black', 'text-white', 'min-h-screen');
    
    return () => {
      // Clean up classes when unmounting
      document.body.classList.remove('bg-gradient-to-b', 'from-f1-darkBlue', 'to-black', 'text-white', 'min-h-screen');
    };
  }, [currentUser, navigate]);

  const handleGetStartedClick = () => {
    setShowAuthForm(true);
    setTimeout(() => {
      authFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Racing line animation */}
      <div className="fixed top-0 left-0 w-full h-1 overflow-hidden">
        <div className="absolute inset-0 bg-f1-red animate-race-by"></div>
      </div>
      
      {/* Main content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection onGetStartedClick={handleGetStartedClick} />
        
        {/* Features */}
        <FeatureSection />
        
        {/* How It Works */}
        <HowItWorksSection />
        
        {/* Auth Form */}
        <section 
          ref={authFormRef} 
          className="py-16 bg-gradient-to-b from-black to-f1-darkBlue/50"
          style={{ display: showAuthForm ? 'block' : 'none' }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Get Started Now</h2>
            <div className="max-w-md mx-auto">
              <AuthForm />
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <TestimonialSection />
        
        {/* Pricing */}
        <PricingSection onGetStartedClick={handleGetStartedClick} />
        
        {/* Demo Login */}
        <DemoLoginSection />
      </main>
      
      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default Index;
