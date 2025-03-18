
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { getUserPoints } from '@/lib/pointsManager';
import { Progress } from '@/components/ui/progress';
import { getChallengeProgress } from '@/lib/challengeManager';

const Rewards: React.FC = () => {
  const [points, setPoints] = useState(getUserPoints());
  const [challengeProgress, setChallengeProgress] = useState<{
    completed: number;
    active: number;
    pointsEarned: number;
  }>(getChallengeProgress());
  
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
  const pointsLeft = points.target - points.current;

  return (
    <div className="mt-8 mb-16">
      <motion.div 
        className="flex flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-medium mb-6">Your Progress</h2>

          {/* Points Progress Display */}
          <div className="mb-8 p-5 glassmorphism rounded-xl border border-primary/20 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-lg">Points Progress</h3>
              <div className="text-right font-medium text-lg">{pointsPercentage}% Complete</div>
            </div>
            
            <Progress value={pointsPercentage} className="h-3 mb-4" />
            
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex items-center gap-2 justify-center bg-primary/10 px-4 py-3 rounded-full">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="font-medium text-primary">
                  {points.current.toLocaleString()} / {points.target.toLocaleString()} pts
                </span>
              </div>
              
              <div className="text-center text-muted-foreground">
                <span className="font-medium text-primary">{pointsLeft.toLocaleString()}</span> points left to reach your target
              </div>
            </div>
          </div>
          
          <div className="p-5 glassmorphism rounded-xl border border-primary/20 shadow-sm">
            <h3 className="font-medium text-lg mb-4">Challenge Stats</h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Completed Challenges</span>
                <span className="font-medium">{challengeProgress.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Challenges</span>
                <span className="font-medium">{challengeProgress.active}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Points Earned</span>
                <span className="font-medium">{challengeProgress.pointsEarned.toLocaleString()} pts</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Rewards;
