'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Users, Eye, Heart, Settings, Edit, MapPin, Link as LinkIcon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { mockAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/Button';
import { StreamGrid } from '@/components/stream/StreamGrid';
import { formatViewerCount } from '@/lib/utils';
import type { User, Stream } from '@/types';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userStreams, setUserStreams] = useState<Stream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'streams' | 'about' | 'followers' | 'following'>('streams');

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // In a real app, this would fetch user profile and streams from API
        if (username === 'testuser' || username === currentUser?.username) {
          setProfileUser(currentUser || {
            id: '1',
            username: 'testuser',
            displayName: 'Test User',
            email: 'test@example.com',
            avatar: 'https://picsum.photos/120/120?random=user1',
            followerCount: 12500,
            followingCount: 234,
            isLive: false,
            isVerified: true,
            createdAt: '2023-01-15T00:00:00Z',
            bio: 'Professional gamer and content creator. Streaming daily at 8 PM EST. Love playing FPS games and chatting with the community!',
            location: 'Los Angeles, CA',
            website: 'https://testuser.com',
          });
        } else {
          // Mock other user profile
          setProfileUser({
            id: '2',
            username: username,
            displayName: username.charAt(0).toUpperCase() + username.slice(1),
            email: `${username}@example.com`,
            avatar: `https://picsum.photos/120/120?random=${username}`,
            followerCount: Math.floor(Math.random() * 50000) + 1000,
            followingCount: Math.floor(Math.random() * 500) + 50,
            isLive: Math.random() > 0.7,
            isVerified: Math.random() > 0.8,
            createdAt: '2023-06-10T00:00:00Z',
            bio: `Content creator and streamer. Follow for amazing content!`,
          });
        }

        // Load user's streams
        const mockStreams = mockAPI.getStreams().slice(0, 6);
        setUserStreams(mockStreams);
        
      } catch (error) {
        console.error('Error loading profile:', error);
        router.push('/browse');
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      loadProfile();
    }
  }, [username, currentUser, router]);

  const handleFollow = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    setIsFollowing(!isFollowing);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-muted rounded-lg"></div>
            <div className="h-32 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">User not found</h1>
            <p className="text-muted-foreground mb-6">The user you're looking for doesn't exist.</p>
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
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-card rounded-lg border border-border p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileUser.avatar} alt={profileUser.displayName} />
                <AvatarFallback className="text-2xl">
                  {profileUser.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    {profileUser.displayName}
                  </h1>
                  {profileUser.isVerified && (
                    <div className="w-6 h-6 rounded-full bg-twitch-purple flex items-center justify-center">
                      <span className="text-xs text-white font-bold">✓</span>
                    </div>
                  )}
                  {profileUser.isLive && (
                    <Badge variant="live" className="ml-2">
                      LIVE
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-2">@{profileUser.username}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{formatViewerCount(profileUser.followerCount)} followers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{formatViewerCount(profileUser.followingCount)} following</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(profileUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 ml-auto">
              {isOwnProfile ? (
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
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
                      <Settings className="w-4 h-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Bio and Links */}
          {(profileUser.bio || profileUser.location || profileUser.website) && (
            <div className="mt-6 pt-6 border-t border-border">
              {profileUser.bio && (
                <p className="text-foreground mb-4">{profileUser.bio}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {profileUser.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profileUser.location}</span>
                  </div>
                )}
                {profileUser.website && (
                  <a
                    href={profileUser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-twitch-purple hover:text-twitch-purple-dark"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>{profileUser.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-border">
            <nav className="flex space-x-8">
              {[
                { id: 'streams', label: 'Streams', count: userStreams.length },
                { id: 'about', label: 'About' },
                { id: 'followers', label: 'Followers', count: profileUser.followerCount },
                { id: 'following', label: 'Following', count: profileUser.followingCount },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-twitch-purple text-twitch-purple'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                      {typeof tab.count === 'number' ? formatViewerCount(tab.count) : tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'streams' && (
            <div>
              {userStreams.length > 0 ? (
                <StreamGrid streams={userStreams} isLoading={false} />
              ) : (
                <div className="text-center py-16">
                  <Eye className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {isOwnProfile ? "You haven't streamed yet" : `${profileUser.displayName} hasn't streamed yet`}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {isOwnProfile ? "Start your first stream to build your audience!" : "Check back later for new content."}
                  </p>
                  {isOwnProfile && (
                    <Button className="bg-twitch-purple hover:bg-twitch-purple-dark">
                      Start Streaming
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="bg-card rounded-lg border border-border p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">About {profileUser.displayName}</h3>
              {profileUser.bio ? (
                <p className="text-foreground leading-relaxed">{profileUser.bio}</p>
              ) : (
                <p className="text-muted-foreground italic">
                  {isOwnProfile ? "Add a bio to tell people about yourself." : "This user hasn't added a bio yet."}
                </p>
              )}
            </div>
          )}

          {activeTab === 'followers' && (
            <div className="bg-card rounded-lg border border-border p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">Followers</h3>
              <p className="text-muted-foreground">Follower list coming soon...</p>
            </div>
          )}

          {activeTab === 'following' && (
            <div className="bg-card rounded-lg border border-border p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">Following</h3>
              <p className="text-muted-foreground">Following list coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
