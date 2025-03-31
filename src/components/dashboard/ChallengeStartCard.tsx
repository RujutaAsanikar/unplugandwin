
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChallengeStartCardProps {
  onStartChallenge: () => void;
}

const ChallengeStartCard: React.FC<ChallengeStartCardProps> = ({ onStartChallenge }) => {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
          } 
        }
      }}
      className="mb-8 mx-4 glassmorphism rounded-xl p-6 border border-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
    >
      <div className="flex gap-6 items-start">
        <div className="w-14 h-14 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
          <Trophy className="w-7 h-7 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">Digital Detox Month</h2>
          <Button 
            className="mt-4 w-full sm:w-auto bg-primary"
            onClick={onStartChallenge}
          >
            Start Challenge
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChallengeStartCard;
