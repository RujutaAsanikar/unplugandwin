
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import ScreenTimeTracker from '@/components/ScreenTimeTracker';
import Challenges from '@/components/Challenges';
import Rewards from '@/components/Rewards';

const Index = () => {
  return (
    <motion.div
      className="min-h-screen py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Header />
      <main className="container max-w-6xl mx-auto pb-20">
        <ScreenTimeTracker />
        <Challenges />
        <Rewards />
      </main>
    </motion.div>
  );
};

export default Index;
