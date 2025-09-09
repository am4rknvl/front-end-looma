'use client';

import React, { useState, useEffect } from 'react';
import { Play, Users, Bell, BellOff } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useStreamStore } from '@/store/streamStore';
import { mockAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Button from '@/components/ui/Button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatViewerCount } from '@/lib/utils';

const Following: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { streams } = useStreamStore();
  const [followedChannels, setFollowedChannels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFollowedChannels = async () => {
      try {
        // In a real app, this would fetch user's followed channels from API
        const mockFollowed = [
          {
            id: 1,
            username: 'ProGamer123',
            displayName: 'Pro Gamer',
            category: 'Gaming',
            isLive: true,
            viewers: 2456,
            title: 'Epic Gaming Session - Apex Legends Ranked',
            avatar: 'https://picsum.photos/40/40?random=progamer',
            thumbnail: 'https://picsum.photos/300/169?random=stream1',
            notifications: true,
          },
          {
            id: 2,
            username: 'MusicMaker',
            displayName: 'Music Maker',
            category: 'Music',
            isLive: false,
            lastSeen: '2 hours ago',
            avatar: 'https://picsum.photos/40/40?random=music',
            notifications: true,
          },
          {
            id: 3,
            username: 'ArtistPro',
            displayName: 'Artist Pro',
            category: 'Art',
            isLive: true,
            viewers: 789,
            title: 'Digital Art Speed Paint - Fantasy Character',
            avatar: 'https://picsum.photos/40/40?random=artist',
            thumbnail: 'https://picsum.photos/300/169?random=stream3',
            notifications: false,
          },
          {
            id: 4,
            username: 'DevCoder',
            displayName: 'Dev Coder',
            category: 'Tech',
            isLive: false,
            lastSeen: '1 day ago',
            avatar: 'https://picsum.photos/40/40?random=dev',
            notifications: true,
          },
        ];
        setFollowedChannels(mockFollowed);
      } catch (error) {
        console.error('Error loading followed channels:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadFollowedChannels();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const liveChannels = followedChannels.filter((channel: any) => channel.isLive);
  const offlineChannels = followedChannels.filter((channel: any) => !channel.isLive);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Sign in to see your followed channels</h1>
            <p className="text-muted-foreground mb-6">You need to be logged in to view your following list.</p>
            <Button onClick={() => window.location.href = '/auth/login'}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-16 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Following</h1>
          <p className="text-muted-foreground mt-1">Stay up to date with your favorite creators</p>
        </div>

        {/* Live Now Section */}
        {liveChannels.length > 0 && (
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span>Live Now ({liveChannels.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveChannels.map((channel: any) => (
                <div key={channel.id} className="group cursor-pointer" onClick={() => window.location.href = `/watch/${channel.id}`}>
                  {/* Stream Thumbnail */}
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-3">
                    {channel.thumbnail ? (
                      <img src={channel.thumbnail} alt={channel.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-muted flex items-center justify-center">
                        <Play className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    <Badge variant="live" className="absolute top-3 left-3">
                      LIVE
                    </Badge>
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{formatViewerCount(channel.viewers)}</span>
                    </div>
                  </div>

                  {/* Channel Info */}
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarImage src={channel.avatar} alt={channel.displayName} />
                      <AvatarFallback>{channel.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground group-hover:text-twitch-purple transition-colors">
                        {channel.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{channel.displayName}</p>
                      <p className="text-xs text-muted-foreground">{channel.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Followed Channels */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            All Followed Channels ({followedChannels.length})
          </h2>

          <div className="space-y-4">
            {followedChannels.map((channel: any) => (
              <div key={channel.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={channel.avatar} alt={channel.displayName} />
                      <AvatarFallback>{channel.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {channel.isLive && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 border-2 border-background rounded-full"></div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-foreground">{channel.displayName}</h3>
                      {channel.isLive && (
                        <Badge variant="live">
                          LIVE
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">@{channel.username}</p>
                    {channel.isLive ? (
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                        <span>{channel.category}</span>
                        <span>•</span>
                        <span>{formatViewerCount(channel.viewers)} viewers</span>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">Last seen {channel.lastSeen}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    className={`p-2 rounded-lg transition-colors ${
                      channel.notifications
                        ? 'text-twitch-purple bg-twitch-purple/10 hover:bg-twitch-purple/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    title={channel.notifications ? 'Notifications enabled' : 'Notifications disabled'}
                  >
                    {channel.notifications ? (
                      <Bell className="w-5 h-5" />
                    ) : (
                      <BellOff className="w-5 h-5" />
                    )}
                  </button>
                  
                  <Button variant="outline" size="sm">
                    Unfollow
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {followedChannels.length === 0 && (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No followed channels yet</h3>
            <p className="text-muted-foreground mb-6">
              Start following your favorite creators to see their content here
            </p>
            <Button onClick={() => window.location.href = '/browse'}>
              Browse Channels
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Following;
