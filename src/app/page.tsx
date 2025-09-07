'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useStreamStore } from '@/store/streamStore';
import { mockAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import { StreamGrid } from '@/components/stream/StreamGrid';
import { Play, TrendingUp, Users, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();
  const { streams, setStreams } = useStreamStore();
  const router = useRouter();

  useEffect(() => {
    // Load mock data
    const loadData = async () => {
      try {
        const mockStreams = mockAPI.getStreams();
        setStreams(mockStreams);
      } catch (error) {
        console.error('Error loading streams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setStreams]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/browse');
    }
  }, [isAuthenticated, router]);

  const featuredStreams = streams.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Stream</span> Your Passion
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join millions of creators and viewers in the ultimate live streaming experience. 
              Share your world, discover new content, and build your community.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={() => router.push('/auth/signup')}
              className="bg-twitch-purple hover:bg-twitch-purple-dark text-lg px-8 py-4"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Streaming
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/browse')}
              className="text-lg px-8 py-4"
            >
              Explore Streams
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-twitch-purple mr-2" />
                <span className="text-3xl font-bold">10M+</span>
              </div>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-twitch-purple mr-2" />
                <span className="text-3xl font-bold">500K+</span>
              </div>
              <p className="text-muted-foreground">Live Streams</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-6 h-6 text-twitch-purple mr-2" />
                <span className="text-3xl font-bold">24/7</span>
              </div>
              <p className="text-muted-foreground">Live Content</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Streams */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trending <span className="gradient-text">Live Streams</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover the most popular content creators right now
            </p>
          </div>
          
          <StreamGrid streams={featuredStreams} isLoading={isLoading} />
          
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/browse')}
            >
              View All Streams
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">StreamHub</span>?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-twitch-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-twitch-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Streaming</h3>
              <p className="text-muted-foreground">
                Start streaming in seconds with our intuitive platform and powerful tools.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-twitch-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-twitch-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Build Community</h3>
              <p className="text-muted-foreground">
                Connect with your audience through interactive chat and engagement features.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-twitch-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-twitch-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Grow Your Brand</h3>
              <p className="text-muted-foreground">
                Monetize your content and grow your following with our creator tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your <span className="gradient-text">Streaming Journey</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators who are already building their communities on StreamHub.
          </p>
          <Button
            size="lg"
            onClick={() => router.push('/auth/signup')}
            className="bg-twitch-purple hover:bg-twitch-purple-dark text-lg px-8 py-4"
          >
            Get Started for Free
          </Button>
        </div>
      </section>
    </div>
  );
}
