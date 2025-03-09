
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import ScreenTimeTracker from '@/components/ScreenTimeTracker';
import { getUserPoints, saveUserPoints } from '@/lib/pointsManager';
import PointsDisplay from '@/components/PointsDisplay';

const Index = () => {
  const [points, setPoints] = useState(getUserPoints());

  // Save points to localStorage whenever they change
  useEffect(() => {
    saveUserPoints(points);
  }, [points]);

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
      </main>
    </motion.div>
  );
};

export default Index;
