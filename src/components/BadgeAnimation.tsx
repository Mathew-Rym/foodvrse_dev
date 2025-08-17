import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BadgeAnimationProps {
  badge: {
    name: string;
    icon: string;
    description: string;
    color: string;
  };
  isVisible: boolean;
  onComplete: () => void;
}

const BadgeAnimation: React.FC<BadgeAnimationProps> = ({ badge, isVisible, onComplete }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        setTimeout(onComplete, 1000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Confetti */}
          {showConfetti && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: -10,
                    rotate: 0,
                  }}
                  animate={{
                    y: window.innerHeight + 10,
                    rotate: 360,
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}

          {/* Badge Card */}
          <motion.div
            className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-sm mx-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Badge Icon */}
            <motion.div
              className="text-8xl mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {badge.icon}
            </motion.div>

            {/* Badge Title */}
            <motion.h2
              className="text-3xl font-bold text-gray-900 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              🏆 Badge Earned!
            </motion.h2>

            {/* Badge Name */}
            <motion.h3
              className="text-2xl font-semibold mb-3"
              style={{ color: badge.color }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {badge.name}
            </motion.h3>

            {/* Badge Description */}
            <motion.p
              className="text-gray-600 mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {badge.description}
            </motion.p>

            {/* Celebration Text */}
            <motion.div
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              🎉 Congratulations! 🎉
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BadgeAnimation;
