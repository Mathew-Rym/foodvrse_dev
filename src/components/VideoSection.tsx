import { Play } from 'lucide-react';
import { useState } from 'react';

const VideoSection = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  // Convert YouTube/Vimeo URLs to embeddable format
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
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
              src={getEmbedUrl(videoUrl)}
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
        </div>
      )}
    </div>
  );
};

export default VideoSection;