
import { doc, collection, updateDoc, arrayUnion, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './config';

/**
 * Send an email invitation using Firebase Cloud Functions
 */
export const sendInviteEmail = async (
  receiverEmail: string, 
  senderName: string, 
  inviteCode: string
): Promise<boolean> => {
  try {
    const response = await fetch('https://us-central1-f1mates-app.cloudfunctions.net/sendInviteEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: receiverEmail,
        sender: senderName,
        inviteCode: inviteCode,
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error("Error sending invite email:", error);
    return false;
  }
};

/**
 * Save an invitation in the database
 */
export const saveInvitation = async (
  senderUid: string, 
  receiverEmail: string, 
  inviteCode: string
): Promise<string> => {
  const inviteRef = doc(collection(db, 'invitations'));
  
  await setDoc(inviteRef, {
    senderUid,
    receiverEmail,
    inviteCode,
    createdAt: Timestamp.now(),
    status: 'pending'
  });
  
  // Also update the user's invites count
  const userRef = doc(db, 'users', senderUid);
  await updateDoc(userRef, {
    sentInvites: arrayUnion(receiverEmail)
  });
  
  return inviteRef.id;
};
