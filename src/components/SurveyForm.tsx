import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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

// Define schema for form validation
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  age: z.string()
    .refine(val => !isNaN(Number(val)), { message: "Age must be a number" })
    .refine(val => Number(val) >= 5 && Number(val) <= 20, { message: "Age must be between 5 and 20" }),
  deviceAccess: z.string().min(1, { message: "Device access information is required" }),
  socialMediaPlatforms: z.array(z.string()).min(1, { message: "Please select at least one social media platform" }),
  dailyScreenTime: z.string().min(1, { message: "Daily screen time information is required" }),
  screenTimeConcern: z.boolean(),
  areasOfConcern: z.array(z.string()).min(1, { message: "Please select at least one area of concern" }),
  otherAreaOfConcern: z.string().optional()
    .refine(
      (val) => {
        // If "Other" is selected, otherAreaOfConcern should be specified
        return true;
      },
      { message: "Please specify your other area of concern" }
    ),
  preferredRewards: z.array(z.string()).min(1, { message: "Please select at least one reward type" }),
  customReward: z.string().optional()
    .refine(
      (val) => {
        // If "Custom rewards" is selected, customReward should be specified
        return true;
      },
      { message: "Please specify your custom reward" }
    ),
  personalPhone: z.string().min(1, { message: "Your phone number is required" }),
  parentPhone: z.string().min(1, { message: "Parent/guardian phone number is required" }),
});

type SurveyFormData = z.infer<typeof formSchema>;

const SurveyForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [showOtherConcernInput, setShowOtherConcernInput] = useState(false);
  const [showCustomRewardInput, setShowCustomRewardInput] = useState(false);

  const form = useForm<SurveyFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: '',
      deviceAccess: '',
      socialMediaPlatforms: [],
      dailyScreenTime: '',
      screenTimeConcern: false,
      areasOfConcern: [],
      otherAreaOfConcern: '',
      preferredRewards: [],
      customReward: '',
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
    const fieldsToValidate = currentStep === 1 
      ? ['name', 'age', 'personalPhone', 'parentPhone']
      : currentStep === 2
      ? ['deviceAccess', 'socialMediaPlatforms', 'dailyScreenTime']
      : ['areasOfConcern', 'preferredRewards'];

    form.trigger(fieldsToValidate as any).then(isValid => {
      if (isValid) {
        if (currentStep === 3 && 
            form.getValues().areasOfConcern.includes('Other') && 
            !form.getValues().otherAreaOfConcern) {
          form.setError('otherAreaOfConcern', {
            type: 'manual',
            message: 'Please specify your other area of concern'
          });
          return;
        }
        
        if (currentStep === 3 && 
            form.getValues().preferredRewards.includes('Custom rewards (specify in comments)') && 
            !form.getValues().customReward) {
          form.setError('customReward', {
            type: 'manual',
            message: 'Please specify your custom reward'
          });
          return;
        }
        
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      } else {
        toast({
          title: "Required fields missing",
          description: "Please fill in all required fields to proceed.",
          variant: "destructive",
        });
      }
    });
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'areasOfConcern' || name === 'preferredRewards' || !name) {
        setShowOtherConcernInput(value.areasOfConcern?.includes('Other') || false);
        setShowCustomRewardInput(value.preferredRewards?.includes('Custom rewards (specify in comments)') || false);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = async (data: SurveyFormData) => {
    if (data.areasOfConcern.includes('Other') && !data.otherAreaOfConcern) {
      form.setError('otherAreaOfConcern', {
        type: 'manual',
        message: 'Please specify your other area of concern'
      });
      return;
    }

    if (data.preferredRewards.includes('Custom rewards (specify in comments)') && !data.customReward) {
      form.setError('customReward', {
        type: 'manual',
        message: 'Please specify your custom reward'
      });
      return;
    }

    setSubmitting(true);
    
    try {
      const surveyData = {
        name: data.name,
        age: data.age,
        device_access: data.deviceAccess,
        social_media_platforms: data.socialMediaPlatforms,
        daily_screen_time: data.dailyScreenTime,
        screen_time_concern: data.screenTimeConcern,
        areas_of_concern: data.areasOfConcern,
        other_area_of_concern: data.otherAreaOfConcern,
        preferred_rewards: data.preferredRewards,
        custom_reward: data.customReward,
        personal_phone: data.personalPhone,
        parent_phone: data.parentPhone,
        user_id: user?.id,
      };
      
      if (user) {
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
                  <FormLabel>Your Name <span className="text-destructive">*</span></FormLabel>
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
                  <FormLabel>Your Age <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={5}
                      max={20}
                      placeholder="Enter your age (5-20)"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || (Number(value) >= 5 && Number(value) <= 20)) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Please enter your age between 5 and 20 years.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="personalPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Phone Number <span className="text-destructive">*</span></FormLabel>
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
                  <FormLabel>Parent/Guardian Phone Number <span className="text-destructive">*</span></FormLabel>
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
                  <FormLabel>What devices do you have access to? <span className="text-destructive">*</span></FormLabel>
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
                    <FormLabel className="text-base">Which social media platforms do you use? <span className="text-destructive">*</span></FormLabel>
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
                  <FormLabel>How much time do you spend on screens daily? <span className="text-destructive">*</span></FormLabel>
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
                    <FormLabel className="text-base">What areas are you most concerned about? <span className="text-destructive">*</span></FormLabel>
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
            
            {showOtherConcernInput && (
              <FormField
                control={form.control}
                name="otherAreaOfConcern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please specify your other area of concern <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your other area of concern" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="preferredRewards"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">What types of rewards would motivate you? <span className="text-destructive">*</span></FormLabel>
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
            
            {showCustomRewardInput && (
              <FormField
                control={form.control}
                name="customReward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please specify your custom reward <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your custom reward details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
