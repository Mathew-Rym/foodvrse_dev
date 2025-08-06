import React, { useEffect, useState } from 'react';
import { X, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [videoType, setVideoType] = useState<'youtube' | 'vimeo' | 'unknown'>('unknown');

  useEffect(() => {
    if (isOpen) {
      console.log('🎥 VideoModal opened with URL:', videoUrl);
      console.log('▶️ Auto-playing video for all users');
      setIsPlaying(true);
      setShowPlayButton(false);
      
      // Determine video type
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        setVideoType('youtube');
        console.log('🎬 Detected YouTube video');
      } else if (videoUrl.includes('vimeo.com')) {
        setVideoType('vimeo');
        console.log('🎬 Detected Vimeo video');
      } else {
        setVideoType('unknown');
        console.log('🎬 Unknown video type, using default Vimeo');
      }
    } else {
      // Reset states when modal closes
      setIsPlaying(false);
      setShowPlayButton(false);
      setVideoType('unknown');
    }
  }, [isOpen, videoUrl]);

  if (!isOpen) return null;

  // Convert YouTube URLs to embeddable format
  const getYouTubeEmbedUrl = (url: string, autoplay: boolean = false) => {
    console.log('🔗 Converting YouTube URL:', url, 'autoplay:', autoplay);
    
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&controls=1&showinfo=0&mute=0`;
      console.log('📹 Generated YouTube embed URL:', embedUrl);
      return embedUrl;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&controls=1&showinfo=0&mute=0`;
      console.log('📹 Generated YouTube embed URL:', embedUrl);
      return embedUrl;
    }
    console.log('⚠️ No YouTube URL pattern matched');
    return url;
  };

  // Get Vimeo embed URL
  const getVimeoEmbedUrl = (url: string, autoplay: boolean = false) => {
    console.log('🔗 Converting Vimeo URL:', url, 'autoplay:', autoplay);
    
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      const embedUrl = `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=${autoplay ? 1 : 0}`;
      console.log('📹 Generated Vimeo embed URL:', embedUrl);
      return embedUrl;
    }
    console.log('⚠️ No Vimeo URL pattern matched');
    return url;
  };

  const handlePlayClick = () => {
    console.log('▶️ Play button clicked');
    setShowPlayButton(false);
    setIsPlaying(true);
  };

  const renderVideoContent = () => {
    console.log('🎬 Rendering video content for type:', videoType);
    
    if (videoType === 'youtube') {
      const embedUrl = getYouTubeEmbedUrl(videoUrl, isPlaying);
      return (
        <iframe
          src={embedUrl}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => console.log('✅ YouTube iframe loaded successfully')}
          onError={(e) => console.error('❌ YouTube iframe error:', e)}
        />
      );
    } else if (videoType === 'vimeo') {
      const embedUrl = getVimeoEmbedUrl(videoUrl, isPlaying);
      return (
        <iframe
          src={embedUrl}
          className="w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          title="FoodVrse"
          onLoad={() => console.log('✅ Vimeo iframe loaded successfully')}
          onError={(e) => console.error('❌ Vimeo iframe error:', e)}
        />
      );
    } else {
      // Default Vimeo embed for FoodVrse video (fallback)
      console.log('🎬 Using default Vimeo embed as fallback');
      return (
        <iframe
          src="https://player.vimeo.com/video/1107540626?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1"
          className="w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          title="FoodVrse"
          onLoad={() => console.log('✅ Default Vimeo iframe loaded successfully')}
          onError={(e) => console.error('❌ Default Vimeo iframe error:', e)}
        />
      );
    }
  };

  console.log('🎬 Final video type:', videoType, 'URL:', videoUrl);

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
            "Good food deserves a second chance." Join the movement and share with others about us!
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
              <Button
                onClick={handlePlayClick}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 sm:p-6 shadow-lg"
                size="lg"
              >
                <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1" />
              </Button>
            </div>
          ) : null}
          
          {renderVideoContent()}
        </div>
        
        {/* Debug info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-2 bg-gray-100 text-xs text-gray-600 border-t">
            <p>Debug: Playing: {isPlaying.toString()}, Show button: {showPlayButton.toString()}, Type: {videoType}, URL: {videoUrl}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoModal; 