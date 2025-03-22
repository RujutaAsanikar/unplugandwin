
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import SurveyForm from '@/components/SurveyForm';

const SurveyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/10">
      <Header activeTab="Home" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto max-w-4xl px-4 py-8"
      >
        <SurveyForm />
      </motion.div>
    </div>
  );
};

export default SurveyPage;
