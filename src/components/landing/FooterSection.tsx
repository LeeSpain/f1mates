
import React from 'react';
import Logo from '@/components/Logo';

export const FooterSection: React.FC = () => {
  return (
    <footer className="bg-f1-black py-12 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <Logo />
          <div className="mt-4 md:mt-0">
            <ul className="flex flex-wrap gap-6 justify-center md:justify-end">
              <li><a href="#features" className="hover:text-f1-red transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-f1-red transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-f1-red transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-f1-red transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 mt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} F1 Mate Racer. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Not affiliated with Formula 1 or the FIA.
          </p>
        </div>
      </div>
    </footer>
  );
};
