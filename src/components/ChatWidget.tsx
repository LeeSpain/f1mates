
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { chatMessages } from '@/data/mockData';
import { useAuth } from '@/auth/AuthContext';

interface ChatWidgetProps {
  minimal?: boolean;
}

export const ChatWidget = ({ minimal = false }: ChatWidgetProps) => {
  const [messages, setMessages] = useState(chatMessages);
  const [newMessage, setNewMessage] = useState('');
  const { currentUser } = useAuth();
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;
    
    const message = {
      id: messages.length + 1,
      user: currentUser.name,
      avatar: currentUser.avatar,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isYou: true
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };
  
  return (
    <div className={`flex flex-col h-full ${minimal ? 'max-h-[400px]' : ''}`}>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-2">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.isYou || message.user === currentUser?.name ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-2 max-w-[80%] ${message.isYou || message.user === currentUser?.name ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img src={message.avatar} alt={message.user} className="w-full h-full object-cover" />
              </div>
              <div className={`p-3 rounded-lg ${message.isYou || message.user === currentUser?.name ? 'bg-f1-red text-white' : 'bg-white/10'}`}>
                <div className="text-xs text-gray-300 mb-1">
                  {message.user === currentUser?.name ? 'You' : message.user}
                </div>
                <p>{message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded bg-white/10 border border-white/20 text-white"
        />
        <button 
          type="submit"
          className="p-2 bg-f1-red rounded hover:bg-f1-red/90"
          disabled={!newMessage.trim()}
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};
