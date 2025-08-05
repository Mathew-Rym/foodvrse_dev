import React, { useEffect, useState } from 'react';
import { X, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl }) => {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Check if this is the first time user has seen the video
      const hasSeenVideo = localStorage.getItem('foodvrse-video-seen');
      if (!hasSeenVideo) {
        setIsFirstTime(true);
        setShowPlayButton(false);
        setIsPlaying(true);
        // Mark as seen after 5 seconds
        setTimeout(() => {
          localStorage.setItem('foodvrse-video-seen', 'true');
        }, 5000);
      } else {
        setShowPlayButton(true);
        setIsPlaying(false);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Convert YouTube URLs to embeddable format
  const getEmbedUrl = (url: string, autoplay: boolean = false) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&controls=1&showinfo=0`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&controls=1&showinfo=0`;
    }
    return url;
  };

  const handlePlayClick = () => {
    setShowPlayButton(false);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-full sm:max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-2 sm:p-4 border-b bg-gray-50">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate pr-2">
            {isFirstTime ? 'Welcome to FoodVrse!' : 'FoodVrse Video'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 flex-shrink-0 p-1 sm:p-2"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
        
        {/* Video Container */}
        <div className="relative aspect-video bg-black">
          {showPlayButton && !isPlaying ? (
            // Play button overlay
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Button
                onClick={handlePlayClick}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 sm:p-6 shadow-lg"
                size="lg"
              >
                <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1" />
              </Button>
            </div>
          ) : null}
          
          <iframe
            src={getEmbedUrl(videoUrl, isPlaying)}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        {/* First-time user message */}
        {isFirstTime && (
          <div className="p-3 sm:p-4 bg-green-50 border-t border-green-200">
            <p className="text-xs sm:text-sm text-green-800 text-center">
              🎉 Welcome to FoodVrse! Watch this quick intro to see how we're saving food and money together.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoModal; 