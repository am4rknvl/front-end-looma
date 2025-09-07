'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Play, Search, User, LogOut, Settings, Menu, X, Gamepad2, Code, Music, Palette } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useStreamStore } from '@/store/streamStore';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Button from '@/components/ui/Button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAuthenticated } = useAuthStore();
  const { setSearchQuery: setStreamSearch, setSelectedCategory } = useStreamStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setStreamSearch(searchQuery);
      router.push('/browse');
    }
  };

  const categories = [
    { name: 'Gaming', icon: Gamepad2, path: '/browse?category=Gaming' },
    { name: 'Software Development', icon: Code, path: '/browse?category=Software Development' },
    { name: 'Music', icon: Music, path: '/browse?category=Music' },
    { name: 'Art', icon: Palette, path: '/browse?category=Art' },
  ];

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-twitch-purple to-twitch-purple-light rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">StreamHub</span>
          </Link>

          {/* Categories - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href={category.path}
                  className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search streams, categories, or users..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
              />
            </form>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Go Live Button */}
            {isAuthenticated && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="hidden sm:flex bg-twitch-purple hover:bg-twitch-purple-dark"
              >
                Go Live
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar} alt={user?.displayName} />
                    <AvatarFallback>
                      {user?.displayName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium text-foreground">
                    {user?.displayName}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-popover rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link
                      href={`/profile/${user?.username}`}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Creator Dashboard</span>
                    </Link>
                    <hr className="my-2 border-border" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/auth/login')}
                >
                  Log In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push('/auth/signup')}
                  className="bg-twitch-purple hover:bg-twitch-purple-dark"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border py-4">
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.name}
                    href={category.path}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
                    onClick={() => {
                      setSelectedCategory(category.name);
                      setIsMenuOpen(false);
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
