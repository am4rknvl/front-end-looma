'use client';

import React, { useState, useEffect } from 'react';
import { Users, Eye, DollarSign, TrendingUp, Play, Heart, Settings, BarChart3, Calendar, Upload } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useStreamStore } from '@/store/streamStore';
import { mockAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Button from '@/components/ui/Button';
import { formatViewerCount } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { streams } = useStreamStore();
  const [isLoading, setIsLoading] = useState(true);
  const [userStreams, setUserStreams] = useState([]);

  useEffect(() => {
    // Simulate loading user's streams
    const loadUserStreams = async () => {
      try {
        // In a real app, this would fetch user's streams from API
        const mockStreams = mockAPI.getStreams().slice(0, 3);
        setUserStreams(mockStreams);
      } catch (error) {
        console.error('Error loading streams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserStreams();
  }, []);

  const stats = [
    { label: 'Total Views', value: '12.5K', icon: Eye, change: '+12%', color: 'bg-blue-100 text-blue-600' },
    { label: 'Followers', value: '1,234', icon: Users, change: '+5%', color: 'bg-green-100 text-green-600' },
    { label: 'Tips Earned', value: '$456', icon: DollarSign, change: '+23%', color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Live Viewers', value: '89', icon: TrendingUp, change: '+8%', color: 'bg-purple-100 text-purple-600' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">You need to be logged in to access the dashboard.</p>
            <Button onClick={() => window.location.href = '/auth/login'}>
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Welcome Header */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.displayName || user?.username}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your channel today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                  <span className="text-sm text-muted-foreground ml-2">from last week</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Streams */}
          <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Recent Streams</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {userStreams.length > 0 ? (
                userStreams.map((stream: any) => (
                  <div key={stream.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-20 h-14 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <img 
                        src={stream.thumbnailUrl} 
                        alt={stream.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full hidden items-center justify-center">
                        <Play className="w-6 h-6 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{stream.title}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <span>{formatViewerCount(stream.viewerCount)} viewers</span>
                        <span>{stream.category}</span>
                        <span className="text-green-600 font-medium">$45.60</span>
                      </div>
                    </div>
                    <button className="p-2 text-muted-foreground hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No recent streams</p>
                  <Button className="mt-4" onClick={() => window.location.href = '/stream'}>
                    Start Your First Stream
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              <Button className="w-full bg-twitch-purple hover:bg-twitch-purple-dark">
                <Play className="w-4 h-4 mr-2" />
                Start Live Stream
              </Button>
              
              <Button variant="outline" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Stream
              </Button>
              
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload VOD
              </Button>
              
              <Button variant="outline" className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Stream Settings
              </Button>
            </div>

            {/* Recent Tips */}
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-lg font-medium text-foreground mb-4">Recent Tips</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">@viewer123</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                  <span className="text-green-600 font-medium">$5.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">@fan456</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                  <span className="text-green-600 font-medium">$10.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">@supporter789</p>
                    <p className="text-xs text-muted-foreground">6 hours ago</p>
                  </div>
                  <span className="text-green-600 font-medium">$2.50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
