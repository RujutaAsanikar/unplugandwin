
import React from 'react';
import { Reward } from '@/lib/types';
import { motion } from 'framer-motion';
import { Star, Lock, Check } from 'lucide-react';

const Rewards: React.FC = () => {
  // Sample rewards
  const rewards: Reward[] = [
    {
      id: '1',
      title: 'Digital Minimalist',
      description: 'Reduce weekly screen time by 10%',
      unlocked: true,
      icon: '✨'
    },
    {
      id: '2',
      title: 'Focus Champion',
      description: 'Complete 3 daily challenges in a row',
      unlocked: false,
      icon: '🏆'
    },
    {
      id: '3',
      title: 'Consistency Master',
      description: 'Log screen time for 7 consecutive days',
      unlocked: false,
      icon: '📊'
    },
    {
      id: '4',
      title: 'Digital Detox Pro',
      description: 'Reduce screen time by 25% for a full week',
      unlocked: false,
      icon: '🌿'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      } 
    }
  };

  return (
    <div className="mt-8 mb-16">
      <motion.div 
        className="flex flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-medium mb-2">Rewards</h2>
          <p className="text-muted-foreground">Earn rewards as you develop healthier screen habits.</p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
          variants={containerVariants}
        >
          {rewards.map((reward) => (
            <motion.div
              key={reward.id}
              className={`glassmorphism rounded-xl p-5 border shadow-sm text-center flex flex-col items-center justify-center min-h-[180px]
                ${reward.unlocked 
                  ? 'border-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]' 
                  : 'border-border opacity-80'}`}
              variants={itemVariants}
            >
              <div className="w-12 h-12 flex items-center justify-center mb-4">
                {reward.unlocked ? (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                    {reward.icon}
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-muted-foreground">
                    <Lock className="w-5 h-5" />
                  </div>
                )}
              </div>
              
              <h3 className="font-medium mb-1">{reward.title}</h3>
              <p className="text-sm text-muted-foreground">{reward.description}</p>
              
              {reward.unlocked && (
                <div className="mt-3 inline-flex items-center text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                  <Check className="w-3 h-3 mr-1" /> Unlocked
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Rewards;
