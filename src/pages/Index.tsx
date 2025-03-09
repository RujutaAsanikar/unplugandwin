
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import ScreenTimeTracker from '@/components/ScreenTimeTracker';
import Rewards from '@/components/Rewards';
import PointsDisplay from '@/components/PointsDisplay';

const Index = () => {
  const [points, setPoints] = useState({
    current: 1500,
    target: 30000
  });

  const handlePointsEarned = (earned: number) => {
    setPoints(prev => ({
      ...prev,
      current: prev.current + earned
    }));
  };

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Header activeTab="Dashboard" />
      <main className="container max-w-6xl mx-auto py-8 pb-20">
        <div className="px-4 mb-6 flex justify-end">
          <PointsDisplay points={points} />
        </div>
        <ScreenTimeTracker onPointsEarned={handlePointsEarned} />
        <Rewards />
      </main>
    </motion.div>
  );
};

export default Index;
