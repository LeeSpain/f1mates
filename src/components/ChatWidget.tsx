
import React, { useState } from 'react';
import { SendIcon, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: number;
  user: string;
  content: string;
  time: string;
  isCurrentUser: boolean;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    user: 'Alex',
    content: 'Max is unstoppable, losers!',
    time: '10:22 AM',
    isCurrentUser: true
  },
  {
    id: 2,
    user: 'Chris',
    content: 'Wait till Leclerc wakes up lol',
    time: '10:24 AM',
    isCurrentUser: false
  },
  {
    id: 3,
    user: 'Jamie',
    content: 'My Group C pick is going to surprise everyone this weekend',
    time: '10:30 AM',
    isCurrentUser: false
  },
  {
    id: 4,
    user: 'Taylor',
    content: 'Just submitted my prediction for +10 points',
    time: '10:35 AM',
    isCurrentUser: false
  },
  {
    id: 5,
    user: 'Alex',
    content: 'Anyone else think Albon might score points?',
    time: '10:40 AM',
    isCurrentUser: true
  }
];

const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: messages.length + 1,
      user: localStorage.getItem('f1-mate-user') || 'You',
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="glassmorphism rounded-lg h-full flex flex-col animate-fade-in">
      <div className="p-4 border-b border-border">
        <h3 className="font-bold">Banter Zone</h3>
        <p className="text-sm text-muted-foreground">Chat with your mates</p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex items-start gap-3 ${message.isCurrentUser ? 'flex-row-reverse' : ''}`}
            >
              <Avatar>
                <AvatarFallback className={message.isCurrentUser ? 'bg-primary' : 'bg-accent'}>
                  {message.user.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className={`max-w-[75%] ${message.isCurrentUser ? 'text-right' : ''}`}>
                <div className="flex items-center mb-1 text-sm gap-2">
                  <span className="font-medium">{message.user}</span>
                  <span className="text-xs text-muted-foreground">{message.time}</span>
                </div>
                
                <div 
                  className={`p-3 rounded-lg ${
                    message.isCurrentUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card text-card-foreground'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="shrink-0">
            <ImageIcon className="h-4 w-4" />
          </Button>
          
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          
          <Button size="icon" className="shrink-0" onClick={handleSendMessage}>
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
