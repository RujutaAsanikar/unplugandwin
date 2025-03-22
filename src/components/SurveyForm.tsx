
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import AuthModal from './AuthModal';

type SurveyFormData = {
  name: string;
  age: string;
  deviceAccess: string;
  socialMediaPlatforms: string[];
  dailyScreenTime: string;
  screenTimeConcern: boolean;
  areasOfConcern: string[];
  preferredRewards: string[];
  personalPhone: string;
  parentPhone: string;
};

const SurveyForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<SurveyFormData>({
    defaultValues: {
      name: '',
      age: '',
      deviceAccess: '',
      socialMediaPlatforms: [],
      dailyScreenTime: '',
      screenTimeConcern: false,
      areasOfConcern: [],
      preferredRewards: [],
      personalPhone: '',
      parentPhone: '',
    }
  });

  const socialMediaOptions = [
    "Facebook", "Instagram", "Twitter/X", "Snapchat", "TikTok", 
    "YouTube", "Discord", "WhatsApp", "Telegram", "Reddit"
  ];

  const concernOptions = [
    "Reduced physical activity", "Sleep disturbances", "Decreased face-to-face social interactions",
    "Poor academic performance", "Anxiety or depression", "Addiction to devices",
    "Exposure to inappropriate content", "Cyberbullying", "Other"
  ];

  const rewardOptions = [
    "Cash rewards", "Gift cards", "Special events/experiences", 
    "Electronics/gadgets", "Extra privileges", "Educational opportunities",
    "Subscription services", "Custom rewards (specify in comments)"
  ];

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: SurveyFormData) => {
    setSubmitting(true);
    
    try {
      // Transform the data to match the database schema
      const surveyData = {
        name: data.name,
        age: data.age,
        device_access: data.deviceAccess,
        social_media_platforms: data.socialMediaPlatforms,
        daily_screen_time: data.dailyScreenTime,
        screen_time_concern: data.screenTimeConcern,
        areas_of_concern: data.areasOfConcern,
        preferred_rewards: data.preferredRewards,
        personal_phone: data.personalPhone,
        parent_phone: data.parentPhone,
        user_id: user?.id,
      };
      
      if (user) {
        // If user is already logged in, save the survey data
        const { error } = await supabase
          .from('user_surveys')
          .insert(surveyData);
        
        if (error) throw error;
        
        toast({
          title: "Survey completed!",
          description: "Thank you for completing the survey.",
        });
        
        setCompleted(true);
        setTimeout(() => navigate('/'), 1500);
      } else {
        // If user is not logged in, store the data in session storage and open auth modal
        sessionStorage.setItem('pendingSurveyData', JSON.stringify(surveyData));
        setShowAuthModal(true);
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      toast({
        title: "Error",
        description: "There was a problem submitting your survey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAuthModalClose = async () => {
    setShowAuthModal(false);
    
    // Check if user is now logged in and there's pending survey data
    const pendingSurveyData = sessionStorage.getItem('pendingSurveyData');
    
    if (user && pendingSurveyData) {
      try {
        const surveyData = JSON.parse(pendingSurveyData);
        surveyData.user_id = user.id;
        
        const { error } = await supabase
          .from('user_surveys')
          .insert(surveyData);
        
        if (error) throw error;
        
        toast({
          title: "Survey completed!",
          description: "Thank you for completing the survey.",
        });
        
        // Clear the pending data
        sessionStorage.removeItem('pendingSurveyData');
        setCompleted(true);
        setTimeout(() => navigate('/'), 1500);
      } catch (error) {
        console.error('Error saving survey after auth:', error);
        toast({
          title: "Error",
          description: "There was a problem saving your survey data. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Render different sections based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Age</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your age range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="under13">Under 13</SelectItem>
                      <SelectItem value="13-15">13-15</SelectItem>
                      <SelectItem value="16-17">16-17</SelectItem>
                      <SelectItem value="18-20">18-20</SelectItem>
                      <SelectItem value="20-under">20 and under</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="personalPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="parentPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter parent's phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="deviceAccess"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What devices do you have access to?</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select devices" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="smartphone">Smartphone only</SelectItem>
                      <SelectItem value="tablet">Tablet only</SelectItem>
                      <SelectItem value="computer">Computer/laptop only</SelectItem>
                      <SelectItem value="multiple">Multiple devices</SelectItem>
                      <SelectItem value="all">All of the above</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="socialMediaPlatforms"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Which social media platforms do you use?</FormLabel>
                    <FormDescription>
                      Select all that apply
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {socialMediaOptions.map((platform) => (
                      <FormField
                        key={platform}
                        control={form.control}
                        name="socialMediaPlatforms"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={platform}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(platform)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, platform])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== platform
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {platform}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dailyScreenTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How much time do you spend on screens daily?</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select daily screen time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="less1">Less than 1 hour</SelectItem>
                      <SelectItem value="1-2">1-2 hours</SelectItem>
                      <SelectItem value="3-4">3-4 hours</SelectItem>
                      <SelectItem value="5-6">5-6 hours</SelectItem>
                      <SelectItem value="6+">More than 6 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="screenTimeConcern"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Are you concerned about your screen time?
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="areasOfConcern"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">What areas are you most concerned about?</FormLabel>
                    <FormDescription>
                      Select all that apply
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {concernOptions.map((concern) => (
                      <FormField
                        key={concern}
                        control={form.control}
                        name="areasOfConcern"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={concern}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(concern)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, concern])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== concern
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {concern}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="preferredRewards"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">What types of rewards would motivate you?</FormLabel>
                    <FormDescription>
                      Select all that apply
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {rewardOptions.map((reward) => (
                      <FormField
                        key={reward}
                        control={form.control}
                        name="preferredRewards"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={reward}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(reward)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, reward])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== reward
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {reward}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  if (completed) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Thank You!</CardTitle>
          <CardDescription>
            Your survey has been submitted successfully. You will be redirected to the dashboard shortly.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="container py-10 mx-auto">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">UnplugAndWin Survey</CardTitle>
          <CardDescription>
            Help us understand your needs to provide the best digital detox experience
          </CardDescription>
          <div className="w-full bg-gray-200 h-2 mt-4 rounded-full">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <div className="text-sm text-right mt-1 text-gray-500">
            Step {currentStep} of {totalSteps}
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStepContent()}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < totalSteps ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button onClick={form.handleSubmit(onSubmit)} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Survey"}
            </Button>
          )}
        </CardFooter>
      </Card>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleAuthModalClose}
        defaultMode="signup"
      />
    </div>
  );
};

export default SurveyForm;
