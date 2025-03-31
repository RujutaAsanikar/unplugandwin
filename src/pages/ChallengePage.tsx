
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Challenges from '@/components/Challenges';
import { useToast } from '@/components/ui/use-toast';

const ChallengePage = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = "Challenges - Unplug And Win";
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header activeTab="Challenges" />
      <main className="container max-w-6xl mx-auto py-8 px-4 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Challenges</h1>
          <p className="text-lg text-gray-700">
            Take on these digital wellbeing challenges to reduce screen time and earn rewards.
          </p>
        </motion.div>
        
        <Challenges />
      </main>
    </motion.div>
  );
};

export default ChallengePage;
