import { create } from 'zustand';
import { Stream, Category } from '@/types';

interface StreamState {
  streams: Stream[];
  categories: Category[];
  currentStream: Stream | null;
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string | null;
  
  // Actions
  setStreams: (streams: Stream[]) => void;
  setCategories: (categories: Category[]) => void;
  setCurrentStream: (stream: Stream | null) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  addStream: (stream: Stream) => void;
  updateStream: (streamId: string, updates: Partial<Stream>) => void;
  removeStream: (streamId: string) => void;
  
  // Getters
  getFilteredStreams: () => Stream[];
  getLiveStreams: () => Stream[];
  getStreamsByCategory: (category: string) => Stream[];
}

export const useStreamStore = create<StreamState>((set, get) => ({
  streams: [],
  categories: [],
  currentStream: null,
  isLoading: false,
  searchQuery: '',
  selectedCategory: null,
  
  setStreams: (streams) => set({ streams }),
  setCategories: (categories) => set({ categories }),
  setCurrentStream: (stream) => set({ currentStream: stream }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  addStream: (stream) => set((state) => ({ 
    streams: [...state.streams, stream] 
  })),
  
  updateStream: (streamId, updates) => set((state) => ({
    streams: state.streams.map(stream => 
      stream.id === streamId ? { ...stream, ...updates } : stream
    )
  })),
  
  removeStream: (streamId) => set((state) => ({
    streams: state.streams.filter(stream => stream.id !== streamId)
  })),
  
  getFilteredStreams: () => {
    const { streams, searchQuery, selectedCategory } = get();
    return streams.filter(stream => {
      const matchesSearch = !searchQuery || 
        stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stream.streamer.displayName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || 
        stream.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  },
  
  getLiveStreams: () => {
    return get().streams.filter(stream => stream.isLive);
  },
  
  getStreamsByCategory: (category) => {
    return get().streams.filter(stream => stream.category === category);
  },
}));
