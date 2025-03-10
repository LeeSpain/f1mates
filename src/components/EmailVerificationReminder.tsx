
import React, { useState } from 'react';
import { auth, sendVerificationEmail } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { MailIcon, CheckCircleIcon } from 'lucide-react';

interface EmailVerificationReminderProps {
  isVerified: boolean;
}

export const EmailVerificationReminder = ({ isVerified }: EmailVerificationReminderProps) => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  
  if (isVerified) return null;
  
  const handleResendVerification = async () => {
    if (!auth.currentUser) return;
    
    setSending(true);
    try {
      const success = await sendVerificationEmail(auth.currentUser);
      
      if (success) {
        toast({
          title: "Email Sent",
          description: "Verification email has been sent. Please check your inbox.",
        });
      } else {
        throw new Error("Failed to send verification email");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast({
        title: "Error",
        description: "Could not send verification email. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };
  
  return (
    <div className="bg-amber-500/20 border border-amber-500/30 p-4 rounded-md flex items-center justify-between">
      <div className="flex items-center">
        <MailIcon className="h-5 w-5 text-amber-500 mr-3" />
        <div>
          <h3 className="font-medium">Please verify your email</h3>
          <p className="text-sm text-gray-300">Check your inbox for a verification link</p>
        </div>
      </div>
      
      <button
        onClick={handleResendVerification}
        disabled={sending}
        className={`px-3 py-1.5 text-sm rounded bg-amber-600 hover:bg-amber-700 text-white flex items-center ${
          sending ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {sending ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full mr-2"></span>
            Sending...
          </>
        ) : (
          <>
            <MailIcon className="h-3.5 w-3.5 mr-1.5" />
            Resend Email
          </>
        )}
      </button>
    </div>
  );
};
