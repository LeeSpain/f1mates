
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2, Check } from "lucide-react";

export const InviteUsers = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sentInvites, setSentInvites] = useState<string[]>([]);
  const [remainingInvites, setRemainingInvites] = useState(5);
  const { toast } = useToast();

  const handleInvite = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (remainingInvites <= 0) {
      toast({
        title: "No invites left",
        description: "You've used all your available invites.",
        variant: "destructive",
      });
      return;
    }

    if (sentInvites.includes(email)) {
      toast({
        title: "Already invited",
        description: "This email has already been invited.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, you would send an actual invitation email here
    setSentInvites([...sentInvites, email]);
    setRemainingInvites(prev => prev - 1);
    setEmail("");
    
    toast({
      title: "Invitation sent!",
      description: `An invitation has been sent to ${email}`,
    });
    
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Invite Friends</h3>
        <div className="text-sm font-medium">
          {remainingInvites} invites remaining
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            type="email"
            placeholder="friend@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            disabled={isLoading || remainingInvites <= 0}
          />
          <Button 
            onClick={handleInvite} 
            disabled={!email || isLoading || remainingInvites <= 0}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Send className="mr-1" />}
            Invite
          </Button>
        </div>

        {sentInvites.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Sent Invitations</h4>
            <ul className="bg-background/50 rounded-md p-2 space-y-1">
              {sentInvites.map((invitedEmail, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Check className="text-green-500 mr-2 h-4 w-4" />
                  {invitedEmail}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
