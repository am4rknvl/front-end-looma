'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, Share, MoreVertical, Users, Eye, Gift } from 'lucide-react';
import { useStreamStore } from '@/store/streamStore';
import { useAuthStore } from '@/store/authStore';
import { mockAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import { ChatBox } from '@/components/chat/ChatBox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/Button';
import { formatViewerCount } from '@/lib/utils';

export default function WatchStream() {
  const params = useParams();
  const router = useRouter();
  const streamId = params.id as string;
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(true);
  
  const { currentStream, setCurrentStream } = useStreamStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const loadStream = async () => {
      try {
        // In a real app, this would fetch from API
        const mockStreams = mockAPI.getStreams();
        const stream = mockStreams.find(s => s.id === streamId);
        
        if (stream) {
          setCurrentStream(stream);
        } else {
          router.push('/browse');
        }
      } catch (error) {
        console.error('Error loading stream:', error);
        router.push('/browse');
      } finally {
        setIsLoading(false);
      }
    };

    if (streamId) {
      loadStream();
    }
  }, [streamId, setCurrentStream, router]);

  const handleFollow = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    setIsFollowing(!isFollowing);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentStream?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!currentStream) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Stream not found</h2>
            <p className="text-muted-foreground mb-4">The stream you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/browse')}>
              Browse Streams
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-0 h-0 border-l-[20px] border-l-white border-y-[12px] border-y-transparent ml-1"></div>
                  </div>
                  <p className="text-lg">Live Stream Player</p>
                  <p className="text-sm text-white/70">Video player would be integrated here</p>
                </div>
              </div>
              
              {/* Live indicator */}
              {currentStream.isLive && (
                <div className="absolute top-4 left-4">
                  <Badge variant="live" className="text-xs font-bold">
                    LIVE
                  </Badge>
                </div>
              )}
              
              {/* Viewer count */}
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{formatViewerCount(currentStream.viewerCount)}</span>
              </div>
            </div>

            {/* Stream Info */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {currentStream.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{formatViewerCount(currentStream.viewerCount)} viewers</span>
                    </div>
                    <Badge variant="outline">{currentStream.category}</Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Streamer Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={currentStream.streamer.avatar} alt={currentStream.streamer.displayName} />
                    <AvatarFallback>
                      {currentStream.streamer.displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {currentStream.streamer.displayName}
                      </h3>
                      {currentStream.streamer.isVerified && (
                        <div className="w-4 h-4 rounded-full bg-twitch-purple flex items-center justify-center">
                          <span className="text-[10px] text-white font-bold">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatViewerCount(currentStream.streamer.followerCount)} followers
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={isFollowing ? "outline" : "primary"}
                    onClick={handleFollow}
                    className={isFollowing ? "" : "bg-twitch-purple hover:bg-twitch-purple-dark"}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  
                  {isAuthenticated && (
                    <Button variant="outline">
                      <Gift className="w-4 h-4 mr-2" />
                      Tip
                    </Button>
                  )}
                </div>
              </div>

              {/* Description */}
              {currentStream.description && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-foreground">{currentStream.description}</p>
                </div>
              )}

              {/* Tags */}
              {currentStream.tags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    {currentStream.tags.map((tag:any) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="font-semibold text-foreground">Chat</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChat(!showChat)}
                >
                  {showChat ? 'Hide' : 'Show'} Chat
                </Button>
              </div>
              
              <div className={`${showChat ? 'block' : 'hidden lg:block'} h-[600px]`}>
                <ChatBox streamId={streamId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
