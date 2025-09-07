'use client';

import React, { useState, useEffect } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import { useStreamStore } from '@/store/streamStore';
import { mockAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import { StreamGrid } from '@/components/stream/StreamGrid';
import Button from '@/components/ui/Button';

const Browse: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { 
    streams, 
    categories, 
    selectedCategory, 
    searchQuery,
    setStreams, 
    setCategories,
    setSelectedCategory,
    getFilteredStreams 
  } = useStreamStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        const mockStreams = mockAPI.getStreams();
        const mockCategories = mockAPI.getCategories();
        setStreams(mockStreams);
        setCategories(mockCategories);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setStreams, setCategories]);

  const filteredStreams = getFilteredStreams();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Browse Live Streams
            </h1>
            <p className="text-muted-foreground">
              {searchQuery ? `Search results for "${searchQuery}"` : 'Discover amazing content from creators around the world'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredStreams.length} streams found
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="ml-2">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-card rounded-lg border border-border p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Streams Grid */}
        <StreamGrid streams={filteredStreams} isLoading={isLoading} />

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
};

export default Browse;
