'use client';

import React from 'react';
import { Play, Users, Zap, Star } from 'lucide-react';
import Button from '@/components/ui/Button';

interface HeroProps {
  onShowLogin: () => void;
  onShowRegister: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShowLogin, onShowRegister }) => {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-primary-900 min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-primary-500/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-primary-500 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">StreamHub</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onShowLogin} className="text-white hover:bg-white/10">
              Sign In
            </Button>
            <Button variant="primary" onClick={onShowRegister}>
              Get Started
            </Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Stream, Connect, and
                <span className="bg-gradient-to-r from-purple-400 to-primary-400 bg-clip-text text-transparent">
                  {' '}Earn
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Join the next generation streaming platform where creators and viewers connect 
                through live content and real-time tipping. Build your community and monetize your passion.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Button size="lg" onClick={onShowRegister} className="px-8">
                  Start Streaming
                </Button>
                <Button variant="outline" size="lg" onClick={onShowLogin} className="px-8 border-white/20 text-white hover:bg-white/10">
                  Watch Live
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 text-center lg:text-left">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">10K+</div>
                  <div className="text-gray-400">Active Streamers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">1M+</div>
                  <div className="text-gray-400">Monthly Viewers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">$2M+</div>
                  <div className="text-gray-400">Tips Sent</div>
                </div>
              </div>
            </div>

            {/* Hero Image/Video Placeholder */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500/20 to-primary-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="aspect-video bg-gray-800 rounded-lg mb-6 flex items-center justify-center">
                  <Play className="w-16 h-16 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-primary-500 rounded-full"></div>
                    <div>
                      <div className="text-white font-medium">Featured Stream</div>
                      <div className="text-gray-400 text-sm">Gaming • 2.5K viewers</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">2.5K</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm">Live</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">4.9</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
