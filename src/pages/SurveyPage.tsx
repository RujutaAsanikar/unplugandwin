
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import SurveyForm from '@/components/SurveyForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

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
        <Alert className="mb-6 bg-primary/10 border-primary/20">
          <Info className="h-4 w-4 mr-2" />
          <AlertDescription>
            All questions in this survey are mandatory. Please answer all questions to proceed.
          </AlertDescription>
        </Alert>
        <SurveyForm />
      </motion.div>
    </div>
  );
};

export default SurveyPage;
