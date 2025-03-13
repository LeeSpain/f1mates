
import React from 'react';
import { Button } from '@/components/ui/button';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
}

interface PricingSectionProps {
  onGetStartedClick: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onGetStartedClick }) => {
  const tiers: PricingTier[] = [
    {
      name: "Free League",
      price: "Free",
      description: "Perfect for casual friend groups",
      features: [
        "Up to 6 players per league",
        "Basic league statistics",
        "Weekly race results",
        "Group chat for banter"
      ],
      buttonText: "Start Free"
    },
    {
      name: "Premium League",
      price: "$4.99 /mo",
      description: "For the serious F1 fantasy players",
      features: [
        "Up to 12 players per league",
        "Advanced statistics & insights",
        "Driver performance predictions",
        "Custom league rules",
        "Priority support"
      ],
      buttonText: "Go Premium",
      highlighted: true
    }
  ];

  return (
    <section id="pricing" className="py-16 bg-gradient-to-b from-black/70 to-f1-darkBlue/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Simple Pricing</h2>
        <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
          Choose the plan that works for your group. All plans include core fantasy features.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier, index) => (
            <div 
              key={index} 
              className={`rounded-lg ${tier.highlighted ? 'border-2 border-f1-red relative overflow-hidden' : 'border border-white/10'}`}
            >
              {tier.highlighted && (
                <div className="absolute top-0 right-0 bg-f1-red text-white text-xs font-bold py-1 px-3 rounded-bl">
                  MOST POPULAR
                </div>
              )}
              <div className={`p-8 ${tier.highlighted ? 'bg-white/5' : 'bg-black/30'}`}>
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-end mb-4">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  {tier.price !== "Free" && <span className="text-gray-400 ml-1">per month</span>}
                </div>
                <p className="text-gray-300 mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <span className="text-f1-red mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${tier.highlighted ? 'bg-f1-red hover:bg-f1-red/90' : 'bg-white/10 hover:bg-white/20'}`}
                  onClick={onGetStartedClick}
                >
                  {tier.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8 text-sm text-gray-400">
          <p>All plans are billed monthly and can be cancelled at any time.</p>
        </div>
      </div>
    </section>
  );
};
