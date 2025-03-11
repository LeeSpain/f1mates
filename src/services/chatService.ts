
import { doc, collection, getDocs, addDoc, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import { ChatMessage } from '@/data/mockData';

// Collection reference
const messagesRef = collection(db, 'messages');

/**
 * Get recent chat messages
 */
export const getRecentMessages = async (limitCount: number = 20): Promise<ChatMessage[]> => {
  try {
    const messagesQuery = query(
      messagesRef,
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    
    const messagesSnapshot = await getDocs(messagesQuery);
    
    if (messagesSnapshot.empty) {
      return [];
    }
    
    const currentUserId = localStorage.getItem('currentUserId') || '';
    
    const messages = messagesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: parseInt(doc.id),
        user: data.user,
        avatar: data.avatar,
        content: data.content,
        timestamp: data.timestamp.toDate().toISOString(),
        isYou: data.userId === currentUserId
      };
    });
    
    // Sort messages in ascending order (oldest first)
    return messages.reverse();
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return [];
  }
};

/**
 * Send a chat message
 */
export const sendChatMessage = async (
  userId: string,
  userName: string,
  avatar: string,
  content: string
): Promise<boolean> => {
  try {
    if (!content.trim()) {
      return false;
    }
    
    // Store current user ID in localStorage for isYou flag
    localStorage.setItem('currentUserId', userId);
    
    await addDoc(messagesRef, {
      userId,
      user: userName,
      avatar,
      content,
      timestamp: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error sending chat message:", error);
    toast({
      title: "Message Failed",
      description: "Failed to send your message. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};
