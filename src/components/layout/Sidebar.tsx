'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Compass, Users, Heart, TrendingUp, Settings } from 'lucide-react';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Compass, label: 'Browse', path: '/browse' },
    { icon: Users, label: 'Following', path: '/following' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: TrendingUp, label: 'Trending', path: '/trending' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                  ${isActive 
                    ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Categories
          </h3>
          <div className="space-y-2">
            {['Gaming', 'Music', 'Art', 'Tech', 'Sports'].map((category) => (
              <button
                key={category}
                onClick={() => router.push(`/category/${category.toLowerCase()}`)}
                className="w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
