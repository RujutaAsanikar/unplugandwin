
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, Award, PartyPopper } from 'lucide-react';

interface ConfettiOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const ConfettiOverlay: React.FC<ConfettiOverlayProps> = ({ isVisible, onClose }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowModal(true);
      
      // Trigger confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };
      
      const confettiInstance = confetti.create(undefined, { 
        resize: true,
        useWorker: true
      });
      
      // Basic confetti burst
      confettiInstance({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Confetti cannon animation
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }
        
        // Random colors
        const colors = [
          '#9b87f5', '#7E69AB', '#D6BCFA', 
          '#FEF7CD', '#FEC6A1', '#E5DEFF', 
          '#FFDEE2', '#D3E4FD', '#8B5CF6'
        ];
        
        confettiInstance({
          particleCount: 3,
          angle: randomInRange(60, 120),
          spread: randomInRange(50, 70),
          origin: { x: randomInRange(0.1, 0.9), y: randomInRange(0.2, 0.4) },
          colors: [colors[Math.floor(Math.random() * colors.length)]],
          ticks: 200,
          gravity: 1.2,
          decay: 0.94,
          startVelocity: randomInRange(25, 40),
          scalar: 0.9
        });
      }, 150);
      
      return () => {
        clearInterval(interval);
        confettiInstance.reset();
      };
    }
  }, [isVisible]);

  if (!showModal) return null;
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white rounded-xl p-8 max-w-md mx-auto text-center shadow-lg border border-primary/20"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex justify-center">
          <div className="relative">
            <div className="absolute -top-3 -left-3">
              <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
            </div>
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
            <div className="absolute -top-3 -right-3">
              <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 right-0">
              <PartyPopper className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        
        <motion.h2 
          className="text-2xl font-bold text-primary mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Congratulations!
        </motion.h2>
        
        <motion.p 
          className="text-gray-600 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          You've successfully completed the 30-day Digital Detox Challenge! 
          Your dedication to reducing social media usage has earned you the full reward!
        </motion.p>
        
        <motion.div 
          className="flex justify-center items-center gap-2 mb-4 py-3 px-4 bg-primary/5 rounded-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Award className="h-5 w-5 text-amber-500" />
          <span className="text-lg font-semibold">+30,000 points earned!</span>
        </motion.div>
        
        <motion.button
          className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          onClick={onClose}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Awesome!
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ConfettiOverlay;
