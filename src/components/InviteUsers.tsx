
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2, Check } from "lucide-react";
import { useAuth } from '@/auth/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, sendInviteEmail, saveInvitation } from '@/lib/firebase';

export const InviteUsers = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sentInvites, setSentInvites] = useState<string[]>([]);
  const [remainingInvites, setRemainingInvites] = useState(5);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Load user's previously sent invites
    const loadInviteData = async () => {
      if (!currentUser) return;
      
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Get previously sent invites array, or create empty array if it doesn't exist
          const previousInvites = userData.sentInvites || [];
          
          setSentInvites(previousInvites);
          // Calculate remaining invites (default 5 total)
          setRemainingInvites(Math.max(0, 5 - previousInvites.length));
        }
      } catch (error) {
        console.error("Error loading invite data:", error);
      }
    };
    
    loadInviteData();
  }, [currentUser]);

  const generateInviteCode = () => {
    // Generate a random 8-character invite code
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleInvite = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to invite users.",
        variant: "destructive",
      });
      return;
    }
    
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

    try {
      // Generate a unique invite code
      const inviteCode = generateInviteCode();
      
      // Save the invitation to Firestore
      await saveInvitation(currentUser.uid, email, inviteCode);
      
      // Send the email
      const emailSent = await sendInviteEmail(
        email, 
        currentUser.name || "An F1 Mate", 
        inviteCode
      );
      
      if (emailSent) {
        // Update local state
        setSentInvites(prev => [...prev, email]);
        setRemainingInvites(prev => prev - 1);
        setEmail("");
        
        toast({
          title: "Invitation sent!",
          description: `An invitation has been sent to ${email}`,
        });
      } else {
        toast({
          title: "Email failed",
          description: "The invitation was saved but we couldn't send the email. Try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during invitation process:", error);
      toast({
        title: "Invitation failed",
        description: "There was an error sending the invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
