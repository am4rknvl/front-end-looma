'use client';

import React from 'react';
import { Video, DollarSign, Users, Shield, Zap, Globe } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Video,
      title: 'HD Live Streaming',
      description: 'Stream in crystal clear quality with low latency and reliable infrastructure.',
    },
    {
      icon: DollarSign,
      title: 'Real-time Tipping',
      description: 'Monetize your content instantly with secure, real-time viewer tips.',
    },
    {
      icon: Users,
      title: 'Community Building',
      description: 'Build and engage with your audience through interactive chat and follows.',
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Enterprise-grade security for all transactions and user data.',
    },
    {
      icon: Zap,
      title: 'Instant Payouts',
      description: 'Get your earnings quickly with fast and reliable payout systems.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Reach viewers worldwide with our global content delivery network.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform provides all the tools and features you need to build a thriving streaming business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-primary-500 rounded-lg flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
