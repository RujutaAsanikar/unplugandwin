
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import SurveyForm from '@/components/SurveyForm';
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-mobile";

const SurveyPage = () => {
  const [completed, setCompleted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [surveyData, setSurveyData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width: 640px)");
  
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
  
  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
  };

  const renderSurveyContent = () => {
    if (!completed) {
      return (
        <>
          <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> All questions are compulsory. Please complete all fields.
              </p>
            </div>
          </div>
          <SurveyForm onComplete={handleComplete} />
        </>
      );
    } else {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-primary mb-3">Survey Completed!</h3>
          <p className="text-gray-600 mb-6">
            Thank you for submitting your survey. Your responses have been recorded.
          </p>
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
        </motion.div>
      );
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header activeTab="Home" />
        <Drawer open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DrawerContent className="max-h-[90vh] overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle className="text-center">UnplugAndWin Survey</DrawerTitle>
              <DrawerDescription className="text-center">
                Help us understand your needs to provide the best digital detox experience
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-8">
              {renderSurveyContent()}
            </div>
          </DrawerContent>
        </Drawer>
        
        <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 font-medium rounded-full px-8"
            onClick={() => setIsDialogOpen(true)}
          >
            Take Survey
          </Button>
        </div>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={handleAuthModalClose}
          defaultMode="signup"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab="Home" />
      
      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">UnplugAndWin Survey</DialogTitle>
            <DialogDescription className="text-center">
              Help us understand your needs to provide the best digital detox experience
            </DialogDescription>
          </DialogHeader>
          <div className="px-2 py-4">
            {renderSurveyContent()}
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
        <Button 
          size="lg" 
          className="bg-primary hover:bg-primary/90 font-medium rounded-full px-8"
          onClick={() => setIsDialogOpen(true)}
        >
          Take Survey
        </Button>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleAuthModalClose}
        defaultMode="signup"
      />
    </div>
  );
};

export default SurveyPage;
