'use client';

import React, { useState, useEffect } from 'react';
import { Users, Eye, Flag, Shield, Settings, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { formatViewerCount } from '@/lib/utils';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Mock admin check - in real app this would check user permissions
  const isAdmin = user?.email === 'admin@streamhub.com' || user?.username === 'admin';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (!isAdmin) {
      router.push('/');
      return;
    }
    
    setIsLoading(false);
  }, [isAuthenticated, isAdmin, router]);

  const stats = [
    { label: 'Total Users', value: '45.2K', icon: Users, change: '+12%', color: 'bg-blue-100 text-blue-600' },
    { label: 'Active Streams', value: '1,234', icon: Eye, change: '+8%', color: 'bg-green-100 text-green-600' },
    { label: 'Reports', value: '23', icon: Flag, change: '-15%', color: 'bg-red-100 text-red-600' },
    { label: 'Moderators', value: '156', icon: Shield, change: '+3%', color: 'bg-purple-100 text-purple-600' },
  ];

  const recentReports = [
    {
      id: 1,
      type: 'Inappropriate Content',
      streamer: 'user123',
      reporter: 'viewer456',
      status: 'pending',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      type: 'Spam in Chat',
      streamer: 'streamer789',
      reporter: 'mod_user',
      status: 'resolved',
      timestamp: '4 hours ago',
    },
    {
      id: 3,
      type: 'Copyright Violation',
      streamer: 'music_lover',
      reporter: 'system',
      status: 'investigating',
      timestamp: '6 hours ago',
    },
  ];

  const recentUsers = [
    {
      id: 1,
      username: 'newstreamer1',
      email: 'new1@example.com',
      joinDate: '2024-01-15',
      status: 'active',
      streams: 5,
    },
    {
      id: 2,
      username: 'viewer_pro',
      email: 'viewer@example.com',
      joinDate: '2024-01-14',
      status: 'active',
      streams: 0,
    },
    {
      id: 3,
      username: 'suspended_user',
      email: 'suspended@example.com',
      joinDate: '2024-01-10',
      status: 'suspended',
      streams: 2,
    },
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage platform operations and monitor system health
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
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
                  <span className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">from last week</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Reports */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Recent Reports</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Flag className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{report.type}</h3>
                      <p className="text-sm text-muted-foreground">
                        Streamer: @{report.streamer} • Reporter: @{report.reporter}
                      </p>
                      <p className="text-xs text-muted-foreground">{report.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        report.status === 'resolved' ? 'default' : 
                        report.status === 'pending' ? 'destructive' : 'secondary'
                      }
                    >
                      {report.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Recent Users</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">@{user.username}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(user.joinDate).toLocaleDateString()} • {user.streams} streams
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        user.status === 'active' ? 'default' : 
                        user.status === 'suspended' ? 'destructive' : 'secondary'
                      }
                    >
                      {user.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex-col gap-2">
              <Users className="w-6 h-6" />
              <span>Manage Users</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Flag className="w-6 h-6" />
              <span>Review Reports</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Shield className="w-6 h-6" />
              <span>Moderator Tools</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BarChart3 className="w-6 h-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">System Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-foreground">Streaming Service</p>
                <p className="text-sm text-green-600">Operational</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-foreground">Chat Service</p>
                <p className="text-sm text-green-600">Operational</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="font-medium text-foreground">CDN</p>
                <p className="text-sm text-yellow-600">Degraded Performance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
