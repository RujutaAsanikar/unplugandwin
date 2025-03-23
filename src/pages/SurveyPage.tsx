
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import SurveyForm from '@/components/SurveyForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const SurveyPage = () => {
  const [completed, setCompleted] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/10">
      <Header activeTab="Home" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto max-w-4xl px-4 py-8"
      >
        {!completed ? (
          <>
            <Alert className="mb-6 bg-primary/10 border-primary/20">
              <Info className="h-4 w-4 mr-2" />
              <AlertDescription>
                All questions in this survey are mandatory. Please answer all questions to proceed.
              </AlertDescription>
            </Alert>
            <SurveyForm onComplete={() => setCompleted(true)} />
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full max-w-2xl mx-auto bg-green-50 border-green-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-green-700">Survey Completed!</CardTitle>
                <CardDescription className="text-green-600">
                  Thank you for submitting your survey. Your responses have been recorded.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <p className="mb-4 text-gray-600">
                  Please create an account to track your digital detox progress and earn rewards.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SurveyPage;
