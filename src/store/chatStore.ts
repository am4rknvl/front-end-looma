import { create } from 'zustand';
import { ChatMessage } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  isLoading: boolean;
  currentStreamId: string | null;
  
  // Actions
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  setCurrentStreamId: (streamId: string | null) => void;
  clearMessages: () => void;
  removeMessage: (messageId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isConnected: false,
  isLoading: false,
  currentStreamId: null,
  
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message].slice(-100) // Keep only last 100 messages
  })),
  
  setConnected: (connected) => set({ isConnected: connected }),
  setLoading: (loading) => set({ isLoading: loading }),
  setCurrentStreamId: (streamId) => set({ currentStreamId: streamId }),
  clearMessages: () => set({ messages: [] }),
  
  removeMessage: (messageId) => set((state) => ({
    messages: state.messages.filter(msg => msg.id !== messageId)
  })),
}));
