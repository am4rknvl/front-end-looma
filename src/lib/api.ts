import axios from 'axios';
import Cookies from 'js-cookie';
import { LoginRequest, RegisterRequest, AuthResponse, APIResponse } from '@/types/auth';
import { Stream, User, Category, ChatMessage, StreamAnalytics } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      Cookies.remove('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<APIResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<APIResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
};

// Streams API
export const streamsAPI = {
  getStreams: async (params?: { category?: string; search?: string; limit?: number }): Promise<APIResponse<Stream[]>> => {
    const response = await apiClient.get('/streams', { params });
    return response.data;
  },

  getStream: async (streamId: string): Promise<APIResponse<Stream>> => {
    const response = await apiClient.get(`/streams/${streamId}`);
    return response.data;
  },

  createStream: async (streamData: Partial<Stream>): Promise<APIResponse<Stream>> => {
    const response = await apiClient.post('/streams', streamData);
    return response.data;
  },

  updateStream: async (streamId: string, updates: Partial<Stream>): Promise<APIResponse<Stream>> => {
    const response = await apiClient.put(`/streams/${streamId}`, updates);
    return response.data;
  },

  deleteStream: async (streamId: string): Promise<APIResponse<void>> => {
    const response = await apiClient.delete(`/streams/${streamId}`);
    return response.data;
  },

  followStreamer: async (streamerId: string): Promise<APIResponse<void>> => {
    const response = await apiClient.post(`/streams/${streamerId}/follow`);
    return response.data;
  },

  unfollowStreamer: async (streamerId: string): Promise<APIResponse<void>> => {
    const response = await apiClient.delete(`/streams/${streamerId}/follow`);
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  getCategories: async (): Promise<APIResponse<Category[]>> => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  getCategory: async (categoryId: string): Promise<APIResponse<Category>> => {
    const response = await apiClient.get(`/categories/${categoryId}`);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getProfile: async (userId: string): Promise<APIResponse<User>> => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (updates: Partial<User>): Promise<APIResponse<User>> => {
    const response = await apiClient.put('/users/profile', updates);
    return response.data;
  },

  getFollowers: async (userId: string): Promise<APIResponse<User[]>> => {
    const response = await apiClient.get(`/users/${userId}/followers`);
    return response.data;
  },

  getFollowing: async (userId: string): Promise<APIResponse<User[]>> => {
    const response = await apiClient.get(`/users/${userId}/following`);
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getStreamAnalytics: async (streamId: string): Promise<APIResponse<StreamAnalytics>> => {
    const response = await apiClient.get(`/analytics/streams/${streamId}`);
    return response.data;
  },
};

// Mock data for development
export const mockAPI = {
  getStreams: (): Stream[] => [
    {
      id: '1',
      title: 'Epic Gaming Session - New Game Release!',
      description: 'Playing the latest AAA game release',
      category: 'Gaming',
      thumbnailUrl: 'https://picsum.photos/320/180?random=1',
      viewerCount: 15420,
      isLive: true,
      startedAt: new Date().toISOString(),
      tags: ['gaming', 'new release', 'action'],
      streamer: {
        id: 'user1',
        username: 'progamer123',
        displayName: 'ProGamer123',
        avatar: 'https://picsum.photos/40/40?random=user1',
        followerCount: 125000,
        followingCount: 50,
        isLive: true,
        isVerified: true,
        createdAt: '2023-01-15T00:00:00Z',
      },
    },
    {
      id: '2',
      title: 'Coding a React App Live',
      description: 'Building a full-stack application from scratch',
      category: 'Software Development',
      thumbnailUrl: 'https://picsum.photos/320/180?random=2',
      viewerCount: 8750,
      isLive: true,
      startedAt: new Date().toISOString(),
      tags: ['coding', 'react', 'tutorial'],
      streamer: {
        id: 'user2',
        username: 'devmaster',
        displayName: 'DevMaster',
        avatar: 'https://picsum.photos/40/40?random=user2',
        followerCount: 89000,
        followingCount: 120,
        isLive: true,
        isVerified: false,
        createdAt: '2022-08-20T00:00:00Z',
      },
    },
    {
      id: '3',
      title: 'Music Production Session',
      description: 'Creating beats and mixing tracks',
      category: 'Music',
      thumbnailUrl: 'https://picsum.photos/320/180?random=3',
      viewerCount: 3200,
      isLive: true,
      startedAt: new Date().toISOString(),
      tags: ['music', 'production', 'beats'],
      streamer: {
        id: 'user3',
        username: 'beatmaker',
        displayName: 'BeatMaker',
        avatar: 'https://picsum.photos/40/40?random=user3',
        followerCount: 45000,
        followingCount: 200,
        isLive: true,
        isVerified: true,
        createdAt: '2023-03-10T00:00:00Z',
      },
    },
  ],

  getCategories: (): Category[] => [
    {
      id: '1',
      name: 'Gaming',
      imageUrl: 'https://picsum.photos/200/200?random=cat1',
      viewerCount: 250000,
      streamCount: 1500,
    },
    {
      id: '2',
      name: 'Software Development',
      imageUrl: 'https://picsum.photos/200/200?random=cat2',
      viewerCount: 45000,
      streamCount: 200,
    },
    {
      id: '3',
      name: 'Music',
      imageUrl: 'https://picsum.photos/200/200?random=cat3',
      viewerCount: 80000,
      streamCount: 350,
    },
    {
      id: '4',
      name: 'Art',
      imageUrl: 'https://picsum.photos/200/200?random=cat4',
      viewerCount: 25000,
      streamCount: 180,
    },
  ],

  getChatMessages: (): ChatMessage[] => [
    {
      id: '1',
      userId: 'user1',
      username: 'viewer123',
      message: 'Great stream! Love this game!',
      timestamp: new Date().toISOString(),
      isSubscriber: true,
      isModerator: false,
      badges: ['subscriber'],
    },
    {
      id: '2',
      userId: 'user2',
      username: 'moderator1',
      message: 'Welcome everyone to the stream!',
      timestamp: new Date().toISOString(),
      isSubscriber: false,
      isModerator: true,
      badges: ['moderator'],
    },
  ],
};

export const setAuthTokens = (authResponse: AuthResponse) => {
  const expiresInDays = authResponse.expires_in / (24 * 60 * 60); // Convert seconds to days
  
  Cookies.set('access_token', authResponse.access_token, { expires: expiresInDays });
  Cookies.set('refresh_token', authResponse.refresh_token, { expires: expiresInDays * 2 });
  Cookies.set('user', JSON.stringify(authResponse.user), { expires: expiresInDays });
};

export const clearAuthTokens = () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  Cookies.remove('user');
};

export const getStoredUser = () => {
  const userCookie = Cookies.get('user');
  return userCookie ? JSON.parse(userCookie) : null;
};

export const isAuthenticated = () => {
  return !!Cookies.get('access_token');
};

export default apiClient;
