
import React from 'react';
import { motion } from 'framer-motion';
import ScreenTimeTracker from '@/components/ScreenTimeTracker';
import PointsDisplay from '@/components/PointsDisplay';
import ChallengeStartCard from './ChallengeStartCard';
import LoginPrompt from './LoginPrompt';
import ScreenTimeGraph from '@/components/ScreenTimeGraph';
import { PointsState } from '@/lib/types';

interface DashboardContentProps {
  user: any;
  points: PointsState;
  challengeStarted: boolean;
  onPointsEarned: (points: number) => void;
  onStartChallenge: () => void;
  onLoginClick: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  user,
  points,
  challengeStarted,
  onPointsEarned,
  onStartChallenge,
  onLoginClick
}) => {
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

  if (!user) {
    return <LoginPrompt onLoginClick={onLoginClick} />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="px-4 mb-6 flex justify-end">
        <PointsDisplay points={points} />
      </div>

      {!challengeStarted && (
        <ChallengeStartCard onStartChallenge={onStartChallenge} />
      )}

      <ScreenTimeTracker onPointsEarned={onPointsEarned} />
      
      <div className="mt-6">
        {user && <ScreenTimeGraph data={[]} />}
      </div>
    </motion.div>
  );
};

export default DashboardContent;
