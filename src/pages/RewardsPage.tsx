
import React from 'react';
import { motion } from 'framer-motion';
import Rewards from '@/components/Rewards';

const RewardsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Rewards</h1>
        <Rewards />
      </div>
    </motion.div>
  );
};

export default RewardsPage;
