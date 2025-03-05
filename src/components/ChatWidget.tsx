
import React, { useState } from 'react';
import { chatMessages } from '@/data/mockData';
import { Send, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ChatWidgetProps {
  minimal?: boolean;
}

export const ChatWidget = ({ minimal = false }: ChatWidgetProps) => {
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  
  const handleSendMessage = () => {
    if (!message.trim()) {
      return;
    }
    
    toast({
      title: "Message sent",
      description: "Your message has been sent to the banter zone.",
    });
    
    setMessage('');
  };

  return (
    <div className={`flex flex-col ${minimal ? 'h-full' : 'h-[calc(100vh-15rem)]'}`}>
      <div className="flex-1 overflow-y-auto px-1 py-2">
        <div className="space-y-4">
          {chatMessages.map((chat) => (
            <div 
              key={chat.id} 
              className={`flex ${chat.isYou ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${chat.isYou ? 'flex-row-reverse' : 'flex-row'}`}>
                {!minimal && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img src={chat.avatar} alt={chat.user} className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
                
                <div 
                  className={`px-3 py-2 rounded-lg mx-2 ${
                    chat.isYou 
                      ? 'bg-f1-red text-white rounded-tr-none' 
                      : 'bg-white/10 text-white rounded-tl-none'
                  }`}
                >
                  {!minimal && <div className="text-xs mb-1">{chat.user}</div>}
                  <div>{chat.content}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-white/10 p-2 pt-3">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-8 w-8 bg-transparent border-white/20"
          >
            <Image className="h-4 w-4" />
          </Button>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 text-f1-red hover:text-white hover:bg-f1-red"
            onClick={handleSendMessage}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
