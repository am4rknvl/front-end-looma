'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Settings, Users } from 'lucide-react';
import { ChatMessage } from '@/types';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/Button';

interface ChatBoxProps {
  streamId: string;
  className?: string;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ streamId, className = '' }) => {
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { messages, addMessage } = useChatStore();
  const { user, isAuthenticated } = useAuthStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock WebSocket connection
  useEffect(() => {
    // Simulate connection
    const timer = setTimeout(() => setIsConnected(true), 1000);
    
    // Mock incoming messages
    const messageInterval = setInterval(() => {
      const mockMessages = [
        { username: 'viewer123', message: 'Great stream! 🔥', isSubscriber: true },
        { username: 'gamer456', message: 'What game is this?', isSubscriber: false },
        { username: 'moderator1', message: 'Welcome everyone!', isModerator: true },
        { username: 'subscriber789', message: 'Love this content!', isSubscriber: true },
      ];
      
      const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: 'mock-user',
        username: randomMessage.username,
        message: randomMessage.message,
        timestamp: new Date().toISOString(),
        isSubscriber: randomMessage.isSubscriber || false,
        isModerator: randomMessage.isModerator || false,
        badges: randomMessage.isModerator ? ['moderator'] : randomMessage.isSubscriber ? ['subscriber'] : [],
      };
      
      addMessage(newMessage);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(messageInterval);
    };
  }, [addMessage]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isAuthenticated || !user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      isSubscriber: false, // This would come from user data
      isModerator: false, // This would come from user data
      badges: [],
    };

    addMessage(newMessage);
    setMessage('');
    inputRef.current?.focus();
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`flex flex-col h-full bg-card border border-border rounded-lg ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Stream Chat</span>
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="chat-message flex items-start gap-2 text-sm"
            >
              <span className="text-xs text-muted-foreground mt-0.5 min-w-[40px]">
                {formatTime(msg.timestamp)}
              </span>
              
              <div className="flex items-center gap-1 min-w-0">
                {/* Badges */}
                {msg.badges.map((badge) => (
                  <Badge
                    key={badge}
                    variant={badge === 'moderator' ? 'moderator' : badge === 'subscriber' ? 'subscriber' : 'default'}
                    className="text-[10px] px-1 py-0"
                  >
                    {badge === 'moderator' ? 'MOD' : 'SUB'}
                  </Badge>
                ))}
                
                <span className={`font-medium ${
                  msg.isModerator ? 'text-green-400' : 
                  msg.isSubscriber ? 'text-twitch-purple' : 
                  'text-foreground'
                }`}>
                  {msg.username}:
                </span>
                
                <span className="text-foreground break-words">
                  {msg.message}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 border-t border-border">
        {isAuthenticated ? (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={500}
              disabled={!isConnected}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!message.trim() || !isConnected}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">
              Log in to join the conversation
            </p>
            <Button size="sm" variant="primary">
              Log In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
