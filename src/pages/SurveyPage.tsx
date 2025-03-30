
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import SurveyForm from '@/components/SurveyForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SurveyPage = () => {
  const [completed, setCompleted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [surveyData, setSurveyData] = useState(null);
  
  const handleSignUpClick = () => {
    setShowAuthModal(true);
  };

  const handleComplete = (data) => {
    setSurveyData(data);
    setCompleted(true);
    
    // Store survey data in local storage for later use
    localStorage.setItem('surveyData', JSON.stringify(data));

    // Attempt to save data to Supabase if user is already logged in
    const saveDataToSupabase = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          const { error } = await supabase.from('user_surveys').insert({
            name: data.name,
            age: data.age,
            personal_phone: data.personal_phone,
            parent_phone: data.parent_phone || null,
            daily_screen_time: data.daily_screen_time,
            social_media_platforms: data.social_media_platforms,
            device_access: data.device_access,
            areas_of_concern: data.areas_of_concern,
            preferred_rewards: data.preferred_rewards,
            user_id: authData.user.id
          });
          
          if (error) {
            console.error("Error saving survey:", error);
            toast({
              title: "Error Saving Data",
              description: "There was a problem saving your survey data. Please try again.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Survey Saved",
              description: "Your survey data has been saved successfully.",
              variant: "default"
            });
          }
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      }
    };
    
    saveDataToSupabase();
  };
  
  // Handle saving data after user authenticates
  const handleAuthModalClose = async () => {
    setShowAuthModal(false);
    
    if (!surveyData) return;
    
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        const { error } = await supabase.from('user_surveys').insert({
          name: surveyData.name,
          age: surveyData.age,
          personal_phone: surveyData.personal_phone,
          parent_phone: surveyData.parent_phone || null,
          daily_screen_time: surveyData.daily_screen_time,
          social_media_platforms: surveyData.social_media_platforms,
          device_access: surveyData.device_access,
          areas_of_concern: surveyData.areas_of_concern,
          preferred_rewards: surveyData.preferred_rewards,
          user_id: authData.user.id
        });
        
        if (error) {
          console.error("Error saving survey after auth:", error);
          toast({
            title: "Error Saving Data",
            description: "There was a problem saving your survey data. Please try again.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Survey Saved",
            description: "Your survey data has been saved successfully.",
            variant: "default"
          });
        }
      }
    } catch (error) {
      console.error("Error saving survey after auth:", error);
      toast({
        title: "Error Saving Data",
        description: "There was a problem saving your survey data. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab="Home" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto max-w-4xl px-4 py-8"
      >
        {!completed ? (
          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-8 md:p-12">
              <h1 className="text-3xl font-bold mb-2">UnplugAndWin Survey</h1>
              <p className="text-gray-600 mb-6">
                Help us understand your needs to provide the best digital detox experience
              </p>
              <SurveyForm onComplete={handleComplete} />
            </CardContent>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full max-w-2xl mx-auto bg-white border-0 shadow-sm rounded-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary">Survey Completed!</CardTitle>
                <CardDescription className="text-gray-600">
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
                    className="bg-primary hover:bg-primary/90 font-medium rounded-full px-8"
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
        onClose={handleAuthModalClose}
        defaultMode="signup"
      />
    </div>
  );
};

export default SurveyPage;
