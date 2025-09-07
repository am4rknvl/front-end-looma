'use client';

import React from 'react';
import { Play, Users, Bell, BellOff } from 'lucide-react';
import Button from '@/components/ui/Button';

const Following: React.FC = () => {
  const followedChannels = [
    {
      id: 1,
      username: 'ProGamer123',
      displayName: 'Pro Gamer',
      category: 'Gaming',
      isLive: true,
      viewers: 2456,
      title: 'Epic Gaming Session - Apex Legends Ranked',
      avatar: '/api/placeholder/40/40',
      thumbnail: '/api/placeholder/300/169',
      notifications: true,
    },
    {
      id: 2,
      username: 'MusicMaker',
      displayName: 'Music Maker',
      category: 'Music',
      isLive: false,
      lastSeen: '2 hours ago',
      avatar: '/api/placeholder/40/40',
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
      avatar: '/api/placeholder/40/40',
      thumbnail: '/api/placeholder/300/169',
      notifications: false,
    },
    {
      id: 4,
      username: 'DevCoder',
      displayName: 'Dev Coder',
      category: 'Tech',
      isLive: false,
      lastSeen: '1 day ago',
      avatar: '/api/placeholder/40/40',
      notifications: true,
    },
  ];

  const liveChannels = followedChannels.filter(channel => channel.isLive);
  const offlineChannels = followedChannels.filter(channel => !channel.isLive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Following</h1>
        <p className="text-gray-600 mt-1">Stay up to date with your favorite creators</p>
      </div>

      {/* Live Now Section */}
      {liveChannels.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span>Live Now ({liveChannels.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveChannels.map((channel) => (
              <div key={channel.id} className="group cursor-pointer">
                {/* Stream Thumbnail */}
                <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-3">
                  <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                    <Play className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                    LIVE
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{channel.viewers?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Channel Info */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                      {channel.title}
                    </h3>
                    <p className="text-sm text-gray-600">{channel.displayName}</p>
                    <p className="text-xs text-gray-500">{channel.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Followed Channels */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          All Followed Channels ({followedChannels.length})
        </h2>

        <div className="space-y-4">
          {followedChannels.map((channel) => (
            <div key={channel.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  {channel.isLive && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">{channel.displayName}</h3>
                    {channel.isLive && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">@{channel.username}</p>
                  {channel.isLive ? (
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                      <span>{channel.category}</span>
                      <span>•</span>
                      <span>{channel.viewers?.toLocaleString()} viewers</span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">Last seen {channel.lastSeen}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    channel.notifications
                      ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
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
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No followed channels yet</h3>
          <p className="text-gray-600 mb-6">
            Start following your favorite creators to see their content here
          </p>
          <Button onClick={() => window.location.href = '/browse'}>
            Browse Channels
          </Button>
        </div>
      )}
    </div>
  );
};

export default Following;
