
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type TestAccountProps = {
  onUseAccount: (email: string, password: string) => void;
};

const TestAccounts: React.FC<TestAccountProps> = ({ onUseAccount }) => {
  const testAccounts = [
    { type: 'Admin', email: 'admin@f1mates.com', password: 'Pass123!' },
    { type: 'Regular User', email: 'user@example.com', password: 'Pass123!' }
  ];

  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Test Accounts</CardTitle>
        <CardDescription className="text-gray-300">
          Use these accounts for testing or create your own
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {testAccounts.map((account) => (
            <div key={account.email} className="p-3 bg-white/5 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{account.type}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-f1-red hover:text-white hover:bg-f1-red/20"
                  onClick={() => onUseAccount(account.email, account.password)}
                >
                  Use this account
                </Button>
              </div>
              <div className="text-sm space-y-1 text-gray-300">
                <p>Email: <span className="font-mono">{account.email}</span></p>
                <p>Password: <span className="font-mono">{account.password}</span></p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestAccounts;
