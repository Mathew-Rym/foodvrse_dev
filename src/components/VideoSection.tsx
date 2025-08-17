import { Play } from 'lucide-react';
import { useState, useEffect } from 'react';

const VideoSection = () => {
  // YouTube video URL for FoodVrse
  const defaultVideoUrl = 'https://youtu.be/OYe3_kovTrY';
  const [videoUrl, setVideoUrl] = useState(defaultVideoUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  
  // Check if this is a first-time user
  useEffect(() => {
    const hasSeenVideo = localStorage.getItem('foodvrse-video-seen');
    if (!hasSeenVideo) {
      setIsFirstTimeUser(true);
      // Auto-play for first-time users after a short delay
      const timer = setTimeout(() => {
        setIsPlaying(true);
        localStorage.setItem('foodvrse-video-seen', 'true');
      }, 2000); // 2 second delay
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  // Convert YouTube/Vimeo URLs to embeddable format
  const getEmbedUrl = (url: string, autoplay: boolean = false) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&controls=1&showinfo=0&mute=0`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&controls=1&showinfo=0&mute=0`;
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}&badge=0&autopause=0&player_id=0&app_id=58479`;
    }
    return url;
  };

  return (
    <div className="relative">
      <div className="relative bg-gradient-to-br from-orange-100 via-red-100 to-yellow-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg">
        {/* Video Container */}
        <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden relative">
          {isPlaying && videoUrl ? (
            <iframe
              src={getEmbedUrl(videoUrl, isFirstTimeUser)}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div 
              onClick={handlePlayVideo}
              className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 cursor-pointer group flex items-center justify-center"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
              {isFirstTimeUser && !isPlaying && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg text-sm">
                  🎬 Watch our story and see how FoodVrse is changing the world!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Admin: Video URL Input (hidden for users) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video URL (Dev Only):
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <button
            onClick={() => {
              localStorage.removeItem('foodvrse-video-seen');
              window.location.reload();
            }}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Reset First-Time User
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoSection;