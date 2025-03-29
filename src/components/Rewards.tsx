
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { getUserPoints } from '@/lib/pointsManager';
import { Progress } from '@/components/ui/progress';
import { 
  getChallengeProgress, 
  updateChallengeProgress, 
  getEntriesCount,
  calculateProgressPercentage
} from '@/lib/challengeManager';
import { useAuth } from '@/lib/auth';

const Rewards: React.FC = () => {
  const [points, setPoints] = useState(getUserPoints());
  const [challengeProgress, setChallengeProgress] = useState<{
    completed: number;
    active: number;
    pointsEarned: number;
  }>(getChallengeProgress());
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [entriesCount, setEntriesCount] = useState(0);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      setPoints(getUserPoints());
      setChallengeProgress(getChallengeProgress());
      
      const count = await getEntriesCount(user?.id);
      setEntriesCount(count);
      
      // Force 100% progress if we have 30 or more entries
      const progress = count >= 30 ? 100 : calculateProgressPercentage(count);
      setProgressPercentage(progress);
      
      await updateChallengeProgress(user?.id);
    };
    
    fetchData();
    
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [user?.id]);

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

  const pointsLeft = points.target - points.current;
  const remainingScreenshots = Math.max(0, 30 - entriesCount);

  return (
    <div className="mt-8 mb-16">
      <motion.div 
        className="flex flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-medium">Your Progress</h2>
          </div>

          <div className="mb-8 p-5 glassmorphism rounded-xl border border-primary/20 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-lg">Challenge Progress</h3>
              <div className="text-right font-medium text-lg">{progressPercentage}% Complete</div>
            </div>
            
            <Progress value={progressPercentage} className="h-3 mb-4" />
            
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex items-center gap-2 justify-center bg-primary/10 px-4 py-3 rounded-full">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="font-medium text-primary">
                  {points.current.toLocaleString()} / {points.target.toLocaleString()} pts
                </span>
              </div>
              
              <div className="text-center">
                <span className="font-medium text-primary">{pointsLeft.toLocaleString()}</span> 
                <span className="text-muted-foreground"> points left to reach your target</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Rewards;
