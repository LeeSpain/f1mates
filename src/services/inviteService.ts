
import { doc, collection, getDocs, addDoc, query, where, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { db, sendInviteEmail } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

// Collection reference
const invitationsRef = collection(db, 'invitations');

/**
 * Generate a random invite code
 */
const generateInviteCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

/**
 * Send an invitation to join the F1 Mate Racer
 */
export const sendInvitation = async (
  senderUid: string,
  senderName: string,
  receiverEmail: string
): Promise<boolean> => {
  try {
    // Check if this email has already been invited
    const existingInviteQuery = query(
      invitationsRef,
      where("receiverEmail", "==", receiverEmail)
    );
    
    const existingInviteSnapshot = await getDocs(existingInviteQuery);
    
    if (!existingInviteSnapshot.empty) {
      toast({
        title: "Already Invited",
        description: "This email has already been invited to join.",
        variant: "destructive"
      });
      return false;
    }
    
    // Generate a unique invite code
    const inviteCode = generateInviteCode();
    
    // Save invitation to Firestore
    await addDoc(invitationsRef, {
      senderUid,
      senderName,
      receiverEmail,
      inviteCode,
      status: "pending",
      createdAt: serverTimestamp()
    });
    
    // Update the user's sent invites
    const userRef = doc(db, 'users', senderUid);
    await updateDoc(userRef, {
      sentInvites: arrayUnion(receiverEmail)
    });
    
    // Send invitation email
    const emailSent = await sendInviteEmail(receiverEmail, senderName, inviteCode);
    
    if (emailSent) {
      toast({
        title: "Invitation Sent",
        description: `An invitation has been sent to ${receiverEmail}.`
      });
      return true;
    } else {
      toast({
        title: "Email Failed",
        description: "Invitation saved but email failed to send.",
        variant: "destructive"
      });
      return true; // Still return true as the invitation was created
    }
  } catch (error) {
    console.error("Error sending invitation:", error);
    toast({
      title: "Invitation Failed",
      description: "Failed to send invitation. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Check if an invite code is valid
 */
export const validateInviteCode = async (inviteCode: string): Promise<string | null> => {
  try {
    const inviteQuery = query(
      invitationsRef,
      where("inviteCode", "==", inviteCode),
      where("status", "==", "pending")
    );
    
    const inviteSnapshot = await getDocs(inviteQuery);
    
    if (inviteSnapshot.empty) {
      return null;
    }
    
    const inviteData = inviteSnapshot.docs[0].data();
    return inviteData.receiverEmail;
  } catch (error) {
    console.error("Error validating invite code:", error);
    return null;
  }
};

/**
 * Mark an invitation as used
 */
export const markInvitationUsed = async (inviteCode: string): Promise<boolean> => {
  try {
    const inviteQuery = query(
      invitationsRef,
      where("inviteCode", "==", inviteCode)
    );
    
    const inviteSnapshot = await getDocs(inviteQuery);
    
    if (inviteSnapshot.empty) {
      return false;
    }
    
    // Update the invitation status
    await updateDoc(doc(invitationsRef, inviteSnapshot.docs[0].id), {
      status: "used",
      usedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error marking invitation as used:", error);
    return false;
  }
};
