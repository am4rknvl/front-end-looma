'use client';

import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, TrendingUp, Users, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useStreamStore } from '@/store/streamStore';
import { mockAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import { StreamGrid } from '@/components/stream/StreamGrid';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { formatViewerCount } from '@/lib/utils';
import type { Stream, Category } from '@/types';

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const { streams, categories, setStreams, setCategories, selectedCategory, setSelectedCategory } = useStreamStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'viewers' | 'recent' | 'trending'>('viewers');
  const [filteredStreams, setFilteredStreams] = useState<Stream[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [streamsData, categoriesData] = await Promise.all([
          Promise.resolve(mockAPI.getStreams()),
          Promise.resolve(mockAPI.getCategories())
        ]);
        
        setStreams(streamsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setStreams, setCategories]);

  useEffect(() => {
    let filtered = [...streams];

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(stream => stream.category === selectedCategory);
    }

    // Sort streams
    switch (sortBy) {
      case 'viewers':
        filtered.sort((a, b) => b.viewerCount - a.viewerCount);
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'trending':
        // Mock trending algorithm - could be based on viewer growth, engagement, etc.
        filtered.sort((a, b) => (b.viewerCount * Math.random()) - (a.viewerCount * Math.random()));
        break;
    }

    setFilteredStreams(filtered);
  }, [streams, selectedCategory, sortBy]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const liveStreams = filteredStreams.filter(stream => stream.isLive);
  const totalViewers = liveStreams.reduce((sum, stream) => sum + stream.viewerCount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {isAuthenticated ? `Welcome back, ${user?.displayName || user?.username}!` : 'Discover Live Streams'}
              </h1>
              <p className="text-muted-foreground">
                {isAuthenticated ? 'Check out what your favorite creators are streaming' : 'Join millions watching live content right now'}
              </p>
            </div>
            
            {/* Live Stats */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">{liveStreams.length} live streams</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{formatViewerCount(totalViewers)} watching</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Browse by Category</h2>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCategorySelect('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory || selectedCategory === 'All'
                  ? 'bg-twitch-purple text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-twitch-purple text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-75">
                  {formatViewerCount(category.viewerCount)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-twitch-purple"
              >
                <option value="viewers">Most Viewers</option>
                <option value="recent">Recently Started</option>
                <option value="trending">Trending</option>
              </select>
            </div>
            
            {selectedCategory && (
              <Badge variant="outline" className="flex items-center gap-2">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-twitch-purple text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-twitch-purple text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-foreground">
              {selectedCategory && selectedCategory !== 'All' ? `${selectedCategory} Streams` : 'Live Streams'}
            </h3>
            <span className="text-sm text-muted-foreground">
              {filteredStreams.length} {filteredStreams.length === 1 ? 'stream' : 'streams'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>Updated live</span>
          </div>
        </div>

        {/* Streams Grid/List */}
        {viewMode === 'grid' ? (
          <StreamGrid streams={filteredStreams} isLoading={isLoading} />
        ) : (
          <div className="space-y-4">
            {isLoading ? (
              // List view loading skeleton
              [...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
                    <div className="w-32 h-20 bg-muted rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : filteredStreams.length > 0 ? (
              filteredStreams.map((stream) => (
                <div
                  key={stream.id}
                  className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/watch/${stream.id}`}
                >
                  <div className="relative w-32 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={stream.thumbnailUrl}
                      alt={stream.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling!.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center bg-muted">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[5px] border-y-transparent ml-0.5"></div>
                      </div>
                    </div>
                    {stream.isLive && (
                      <Badge variant="live" className="absolute top-2 left-2 text-xs">
                        LIVE
                      </Badge>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {formatViewerCount(stream.viewerCount)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate mb-1">
                      {stream.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stream.streamer.displayName}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{stream.category}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{formatViewerCount(stream.viewerCount)}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>2h 30m</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No streams found</h3>
                <p className="text-muted-foreground mb-6">
                  {selectedCategory 
                    ? `No live streams in ${selectedCategory} right now.`
                    : 'No live streams match your current filters.'
                  }
                </p>
                <Button onClick={() => setSelectedCategory(null)}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Load More */}
        {!isLoading && filteredStreams.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Streams
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
