import { Play } from 'lucide-react';
import { useState } from 'react';

const VideoSection = () => {
  const [videoUrl, setVideoUrl] = useState('');
  
  const handleVideoClick = () => {
    // For now, we'll use a placeholder. User can replace with their actual video URL
    const sampleVideoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    } else {
      window.open(sampleVideoUrl, '_blank');
    }
  };

  return (
    <div className="relative">
      <div 
        onClick={handleVideoClick}
        className="relative bg-gradient-to-br from-orange-100 via-red-100 to-yellow-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg cursor-pointer hover:shadow-xl transition-shadow group"
      >
        {/* Video Placeholder */}
        <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20"></div>
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
            <p className="text-white font-medium">How to Use FoodVrse</p>
            <p className="text-white/80 text-sm mt-1">Watch intro video</p>
          </div>
        </div>
        
        {/* Content */}
        <div className="text-center">
          <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2">
            Discover How FoodVrse Works
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mb-4">
            Learn how to find, save, and enjoy surplus food while reducing waste
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
            <div className="text-center">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-1">
                <span className="text-orange-600">🔍</span>
              </div>
              <p className="text-gray-600 font-medium">Search</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
                <span className="text-green-600">💰</span>
              </div>
              <p className="text-gray-600 font-medium">Save</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
                <span className="text-blue-600">🍽️</span>
              </div>
              <p className="text-gray-600 font-medium">Enjoy</p>
            </div>
          </div>
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