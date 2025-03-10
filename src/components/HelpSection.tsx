
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { InfoIcon, HelpCircleIcon, BookOpenIcon, AwardIcon, CarIcon, UserIcon } from 'lucide-react';

export const HelpSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Help & Documentation</h2>
        <div className="flex gap-2">
          <HelpCircleIcon className="h-5 w-5 text-f1-silver" />
          <BookOpenIcon className="h-5 w-5 text-f1-silver" />
        </div>
      </div>
      
      {/* Getting Started Card */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <InfoIcon className="h-5 w-5 mr-2 text-f1-lightBlue" />
            Getting Started
          </CardTitle>
          <CardDescription>
            Essential information to get you racing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-300 mb-4">
            Welcome to F1 Mate Racer! This fantasy F1 game lets you pick drivers, make predictions, 
            and compete with friends throughout the season.
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-white hover:no-underline">
                How to Play
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Select your drivers from each group (A, B, and C)</li>
                  <li>Lock in your Group C driver before each race</li>
                  <li>Make bonus predictions for extra points</li>
                  <li>Earn points based on your drivers' performance</li>
                  <li>Compete on the leaderboard with other players</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-white hover:no-underline">
                Driver Groups Explained
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                <ul className="space-y-3">
                  <li>
                    <strong className="text-f1-red">Group A:</strong> Top-tier drivers from leading teams. You're locked into one driver for the season.
                  </li>
                  <li>
                    <strong className="text-f1-lightBlue">Group B:</strong> Mid-field drivers. You get 6 swaps per season to change your Group B driver.
                  </li>
                  <li>
                    <strong className="text-white">Group C:</strong> Backmarker teams. You can pick a different driver for each race.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      {/* Scoring Rules Card */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <AwardIcon className="h-5 w-5 mr-2 text-f1-red" />
            Scoring Rules
          </CardTitle>
          <CardDescription>
            How points are calculated in the game
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="scoring-1" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-white hover:no-underline">
                Race Result Points
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                <p className="mb-2">You earn the same points that your drivers earn in the actual F1 race:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>1st place: 25 points</li>
                  <li>2nd place: 18 points</li>
                  <li>3rd place: 15 points</li>
                  <li>4th place: 12 points</li>
                  <li>5th place: 10 points</li>
                  <li>6th-10th place: 8, 6, 4, 2, 1 points</li>
                  <li>Fastest lap (if in top 10): 1 point</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="scoring-2" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-white hover:no-underline">
                Bonus Prediction Points
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                <p>For each race, you can submit one bonus prediction. If it comes true, you earn 10 extra points.</p>
                <p className="mt-2">Examples of valid predictions:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>"Both Ferrari drivers will finish on the podium"</li>
                  <li>"There will be a safety car during the race"</li>
                  <li>"Albon will score points"</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="scoring-3" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-white hover:no-underline">
                Weekly and Season Standings
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                <p>Your weekly score is the sum of:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>Group A driver points</li>
                  <li>Group B driver points</li>
                  <li>Group C driver points</li>
                  <li>Bonus prediction points (if correct)</li>
                </ul>
                <p className="mt-2">Season standings are the cumulative total of all your weekly scores.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      {/* Driver Swaps Card */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <CarIcon className="h-5 w-5 mr-2 text-f1-lightBlue" />
            Driver Swaps & Picks
          </CardTitle>
          <CardDescription>
            How to manage your driver selections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="swap-1" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-white hover:no-underline">
                Group B Swaps
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                <p>You have 6 swaps for your Group B driver during the entire season:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>Use them strategically based on upcoming tracks</li>
                  <li>Swaps are permanent until you use another swap</li>
                  <li>The swap counter updates immediately when you make a change</li>
                  <li>You cannot get additional swaps once you've used all 6</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="swap-2" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-white hover:no-underline">
                Group C Weekly Picks
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                <p>For Group C, you can select a different driver for every race:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>Select your Group C driver before race qualifying begins</li>
                  <li>You don't have to change your driver every week</li>
                  <li>Once qualifying starts, your pick is locked for that race</li>
                  <li>There's no limit to how often you can change your Group C driver</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="swap-3" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-white hover:no-underline">
                Deadlines & Locks
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                <p>Important deadlines to remember:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>All driver selections and swaps must be made before qualifying starts</li>
                  <li>Bonus predictions must be submitted before the race starts</li>
                  <li>You cannot change selections after the deadlines have passed</li>
                  <li>The race countdown timer shows you how much time is left</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      {/* Account Management Card */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-green-500" />
            Account Management
          </CardTitle>
          <CardDescription>
            Manage your profile and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="account-1" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-white hover:no-underline">
                Email Verification
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                <p>After registration, check your email for a verification link:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>Verification ensures account security</li>
                  <li>Click the link in the email to verify your account</li>
                  <li>If you don't receive the email, check your spam folder</li>
                  <li>You can request a new verification email from your profile</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="account-2" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-white hover:no-underline">
                Password Reset
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                <p>If you forget your password:</p>
                <ol className="list-decimal list-inside space-y-1 mt-1">
                  <li>Click "Forgot Password" on the login screen</li>
                  <li>Enter your email address</li>
                  <li>Check your email for the reset link</li>
                  <li>Create a new password</li>
                </ol>
                <p className="mt-2">Always use a strong, unique password for your account.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="account-3" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-white hover:no-underline">
                Contact Support
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                <p>If you need help with your account:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>Email: support@f1mates.com</li>
                  <li>Response time: 24-48 hours</li>
                  <li>Include your username and a detailed description of your issue</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};
