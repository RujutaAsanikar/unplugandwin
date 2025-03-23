
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
import { Link } from 'react-router-dom';
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
  
  // Update points, challenge progress, and screenshot-based progress whenever component is mounted
  useEffect(() => {
    const fetchData = async () => {
      // Get latest points and challenge progress
      setPoints(getUserPoints());
      setChallengeProgress(getChallengeProgress());
      
      // Get the entries count to calculate the actual progress percentage
      const count = await getEntriesCount(user?.id);
      setEntriesCount(count);
      
      // Calculate the progress percentage based on entries count
      const progress = calculateProgressPercentage(count);
      setProgressPercentage(progress);
      
      // Update challenge progress in backend/localStorage
      await updateChallengeProgress(user?.id);
    };
    
    fetchData();
    
    // Set up interval to refresh data periodically
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, [user?.id]);

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
  
  // Calculate remaining screenshots
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
              
              <div className="text-center">
                <span className="font-medium text-primary">{pointsLeft.toLocaleString()}</span> 
                <span className="text-muted-foreground"> points left to reach your target</span>
              </div>
            </div>
          </div>
          
          {/* Challenge Progress Display */}
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
                  {entriesCount} / 30 Screenshots
                </span>
              </div>
              
              {progressPercentage < 100 ? (
                <div className="text-center">
                  <span className="font-medium text-primary">{remainingScreenshots}</span> 
                  <span className="text-muted-foreground"> more screenshots needed to complete the challenge</span>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-green-600 font-medium">Challenge completed! 🎉</span>
                </div>
              )}
              
              {progressPercentage < 100 && (
                <div className="text-center mt-2">
                  <Button asChild variant="outline" className="gap-2">
                    <Link to="/">
                      <Upload className="h-4 w-4" />
                      Upload Screenshots
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Rewards;
