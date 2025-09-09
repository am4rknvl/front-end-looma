export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  location?: string;
  website?: string;
  email?: string;
  followerCount: number;
  followingCount: number;
  isLive: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface Stream {
  id: string;
  title: string;
  description?: string;
  category: string;
  thumbnailUrl: string;
  viewerCount: number;
  isLive: boolean;
  startedAt: string;
  streamer: User;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  isSubscriber: boolean;
  isModerator: boolean;
  badges: string[];
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  viewerCount: number;
  streamCount: number;
}

export interface Subscription {
  id: string;
  userId: string;
  streamerId: string;
  tier: 1 | 2 | 3;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface StreamAnalytics {
  streamId: string;
  peakViewers: number;
  averageViewers: number;
  totalViews: number;
  duration: number;
  chatMessages: number;
  newFollowers: number;
  revenue: number;
}
