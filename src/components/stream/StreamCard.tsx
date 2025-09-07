'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, Users } from 'lucide-react';
import { Stream } from '@/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatViewerCount, truncateText } from '@/lib/utils';

interface StreamCardProps {
  stream: Stream;
  className?: string;
}

export const StreamCard: React.FC<StreamCardProps> = ({ stream, className = '' }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`stream-card group cursor-pointer ${className}`}
    >
      <Link href={`/watch/${stream.id}`}>
        <div className="relative overflow-hidden rounded-lg bg-card">
          {/* Thumbnail */}
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={stream.thumbnailUrl}
              alt={stream.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Live indicator */}
            {stream.isLive && (
              <div className="absolute left-2 top-2">
                <Badge variant="live" className="text-xs font-bold">
                  LIVE
                </Badge>
              </div>
            )}
            
            {/* Viewer count */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
              <Eye className="h-3 w-3" />
              <span>{formatViewerCount(stream.viewerCount)}</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-3">
            <div className="flex items-start gap-3">
              {/* Streamer Avatar */}
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={stream.streamer.avatar} alt={stream.streamer.displayName} />
                <AvatarFallback>
                  {stream.streamer.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {/* Stream Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {truncateText(stream.title, 60)}
                </h3>
                
                <div className="flex items-center gap-1 mt-1">
                  <p className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {stream.streamer.displayName}
                  </p>
                  {stream.streamer.isVerified && (
                    <div className="h-3 w-3 rounded-full bg-twitch-purple flex items-center justify-center">
                      <span className="text-[8px] text-white font-bold">✓</span>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mt-1">
                  {stream.category}
                </p>
                
                {/* Tags */}
                {stream.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {stream.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0.5">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
