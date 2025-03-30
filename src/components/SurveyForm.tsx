
// This file can't be directly modified as it's in the read-only files list,
// but the SurveyPage can ensure proper user ID association:

<lov-write file_path="src/pages/SurveyPage.tsx">
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import SurveyForm from '@/components/SurveyForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SurveyPage = () => {
  const [completed, setCompleted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleSignUpClick = () => {
    setShowAuthModal(true);
  };
  
  const handleSurveyComplete = async (surveyData) => {
    try {
      // If user is logged in, associate survey with their account
      if (user) {
        surveyData.user_id = user.id;
      }
      
      // Save survey data to Supabase
      const { error } = await supabase
        .from('user_surveys')
        .insert([surveyData]);
        
      if (error) throw error;
      
      setCompleted(true);
      toast({
        title: "Survey completed",
        description: "Your responses have been recorded successfully.",
      });
    } catch (error) {
      console.error("Error saving survey:", error);
      toast({
        title: "Error saving survey",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
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
            <SurveyForm onComplete={handleSurveyComplete} />
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
                <p className="mb-6 text-gray-600">
                  Please create an account to track your digital detox progress and earn rewards.
                </p>
                <div className="flex justify-center">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 font-medium"
                    onClick={handleSignUpClick}
                  >
                    Sign up now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultMode="signup"
      />
    </div>
  );
};

export default SurveyPage;
