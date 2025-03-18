
import React, { useEffect, useState } from 'react';
import { Reward } from '@/lib/types';
import { motion } from 'framer-motion';
import { Star, Lock, Check, Trophy } from 'lucide-react';
import { getUserPoints } from '@/lib/pointsManager';
import { Progress } from '@/components/ui/progress';
import { getChallengeProgress } from '@/lib/challengeManager';

const Rewards: React.FC = () => {
  const [points, setPoints] = useState(getUserPoints());
  const [challengeProgress, setChallengeProgress] = useState(getChallengeProgress());
  
  // Update points and challenge progress whenever component is mounted
  useEffect(() => {
    // Get latest points and challenge progress
    setPoints(getUserPoints());
    setChallengeProgress(getChallengeProgress());
    
    // Set up interval to refresh points and progress periodically
    const interval = setInterval(() => {
      setPoints(getUserPoints());
      setChallengeProgress(getChallengeProgress());
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Sample rewards
  const rewards: Reward[] = [
    {
      id: '1',
      title: 'Digital Minimalist',
      description: 'Reduce weekly screen time by 10%',
      unlocked: points.current >= 5000,
      icon: '✨',
      requiredScreenshots: 5
    },
    {
      id: '2',
      title: 'Focus Champion',
      description: 'Complete 3 daily challenges in a row',
      unlocked: points.current >= 10000,
      icon: '🏆',
      requiredScreenshots: 10
    },
    {
      id: '3',
      title: 'Consistency Master',
      description: 'Log screen time for 7 consecutive days',
      unlocked: points.current >= 20000,
      icon: '📊',
      requiredScreenshots: 20
    },
    {
      id: '4',
      title: 'Digital Detox Pro',
      description: 'Reduce screen time by 25% for a full week',
      unlocked: points.current >= 30000,
      icon: '🌿',
      requiredScreenshots: 30
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

  // Calculate percentage of total points
  const pointsPercentage = Math.min(100, Math.round((points.current / points.target) * 100));

  return (
    <div className="mt-8 mb-16">
      <motion.div 
        className="flex flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-medium mb-6">Rewards</h2>

          {/* Points Progress Display */}
          <div className="mb-8 p-5 glassmorphism rounded-xl border border-primary/20 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-lg">Progress</h3>
              <div className="text-right font-medium text-lg">{pointsPercentage}%</div>
            </div>
            
            <Progress value={pointsPercentage} className="h-3 mb-4" />
            
            <div className="flex items-center gap-2 justify-center mt-4 bg-primary/10 px-4 py-3 rounded-full">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary">
                {points.current.toLocaleString()} / {points.target.toLocaleString()} pts
              </span>
            </div>
          </div>
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
              
              {reward.unlocked ? (
                <div className="mt-3 inline-flex items-center text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                  <Check className="w-3 h-3 mr-1" /> Unlocked
                </div>
              ) : (
                <div className="mt-3 inline-flex items-center text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded-full">
                  <span>{reward.requiredScreenshots} screenshots needed</span>
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
