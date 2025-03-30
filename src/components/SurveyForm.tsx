
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Define the schema for form validation
const surveySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.string().min(1, "Age is required"),
  personal_phone: z.string().optional(),
  parent_phone: z.string().optional(),
  relationship_to_child: z.string().optional(),
  child_age: z.string().optional(),
  device_access: z.string(),
  daily_screen_time: z.string(),
  screen_time_concern: z.boolean().optional(),
  social_media_platforms: z.array(z.string()).optional(),
  areas_of_concern: z.array(z.string()).optional(),
  preferred_rewards: z.array(z.string()).optional(),
});

type SurveyFormData = z.infer<typeof surveySchema>;

interface SurveyFormProps {
  onComplete: (data: SurveyFormData) => void;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<SurveyFormData>>({});
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    mode: "onChange",
    defaultValues: {
      social_media_platforms: [],
      areas_of_concern: [],
      preferred_rewards: [],
      screen_time_concern: false
    }
  });

  const watchDeviceAccess = watch("device_access");

  // Array of social media platforms
  const socialMediaPlatforms = [
    "Instagram", 
    "TikTok", 
    "Snapchat", 
    "YouTube", 
    "Facebook", 
    "Twitter/X",
    "Discord",
    "Reddit",
    "Other"
  ];

  // Array of areas of concern
  const areasOfConcern = [
    "Reduced physical activity",
    "Sleep disruption",
    "Academic performance",
    "Social skills development",
    "Difficulty focusing",
    "Anxiety/depression",
    "Cyberbullying",
    "Inappropriate content exposure",
    "Other"
  ];

  // Array of preferred rewards
  const preferredRewards = [
    "Gift cards",
    "Cash rewards",
    "Physical prizes",
    "Experiences (movie tickets, activities)",
    "School/educational supplies",
    "Charitable donations",
    "Other"
  ];

  const handleCheckboxChange = (
    id: string, 
    field: "social_media_platforms" | "areas_of_concern" | "preferred_rewards", 
    checked: boolean
  ) => {
    const currentValues = watch(field) || [];
    const updatedValues = checked 
      ? [...currentValues, id]
      : currentValues.filter(value => value !== id);
    
    setValue(field, updatedValues);
  };

  const onSubmit = (data: SurveyFormData) => {
    console.log("Form submitted:", data);
    toast({
      title: "Form submitted",
      description: "Thank you for completing the survey!",
    });
    onComplete(data);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {currentStep === 1 && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    {...register("name")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Your Age</Label>
                  <Select onValueChange={(value) => setValue("age", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under13">Under 13</SelectItem>
                      <SelectItem value="13-17">13-17</SelectItem>
                      <SelectItem value="18-24">18-24</SelectItem>
                      <SelectItem value="25-34">25-34</SelectItem>
                      <SelectItem value="35-44">35-44</SelectItem>
                      <SelectItem value="45+">45+</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.age && (
                    <p className="text-sm text-red-500">{errors.age.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="personal_phone">Phone Number (optional)</Label>
                  <Input
                    id="personal_phone"
                    placeholder="Your phone number"
                    {...register("personal_phone")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Are you a parent/guardian answering this survey?</Label>
                  <RadioGroup
                    onValueChange={(value) => {
                      setValue("relationship_to_child", value === "yes" ? "" : undefined);
                      setValue("child_age", value === "yes" ? "" : undefined);
                      setValue("parent_phone", value === "yes" ? "" : undefined);
                    }}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="parent-yes" />
                      <Label htmlFor="parent-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="parent-no" />
                      <Label htmlFor="parent-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="relationship_to_child">Relationship to Child (if applicable)</Label>
                  <Input
                    id="relationship_to_child"
                    placeholder="Parent, Guardian, etc."
                    {...register("relationship_to_child")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="child_age">Child's Age (if applicable)</Label>
                  <Input
                    id="child_age"
                    placeholder="Child's age"
                    {...register("child_age")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parent_phone">Parent/Guardian Phone (if applicable)</Label>
                  <Input
                    id="parent_phone"
                    placeholder="Parent/Guardian phone number"
                    {...register("parent_phone")}
                  />
                </div>
              </div>
              
              <div className="pt-6 flex justify-end">
                <Button type="button" onClick={nextStep}>
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Device & Screen Time</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="device_access">Do you have access to a smartphone or tablet?</Label>
                  <RadioGroup 
                    onValueChange={(value) => setValue("device_access", value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="own_device" id="own-device" />
                      <Label htmlFor="own-device">Yes, I have my own</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="shared_device" id="shared-device" />
                      <Label htmlFor="shared-device">Yes, but I share with others</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="limited_access" id="limited-access" />
                      <Label htmlFor="limited-access">Limited access only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no_access" id="no-access" />
                      <Label htmlFor="no-access">No access</Label>
                    </div>
                  </RadioGroup>
                  {errors.device_access && (
                    <p className="text-sm text-red-500">{errors.device_access.message}</p>
                  )}
                </div>
                
                {watchDeviceAccess && watchDeviceAccess !== "no_access" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="daily_screen_time">How much time do you spend on screens daily?</Label>
                      <Select onValueChange={(value) => setValue("daily_screen_time", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select daily screen time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="less_than_1">Less than 1 hour</SelectItem>
                          <SelectItem value="1_to_2">1-2 hours</SelectItem>
                          <SelectItem value="2_to_4">2-4 hours</SelectItem>
                          <SelectItem value="4_to_6">4-6 hours</SelectItem>
                          <SelectItem value="6_to_8">6-8 hours</SelectItem>
                          <SelectItem value="more_than_8">More than 8 hours</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.daily_screen_time && (
                        <p className="text-sm text-red-500">{errors.daily_screen_time.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Are you concerned about your screen time usage?</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="screen_time_concern" 
                          onCheckedChange={(checked) => {
                            setValue("screen_time_concern", checked === true);
                          }}
                        />
                        <Label htmlFor="screen_time_concern">Yes, I'm concerned</Label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Which social media platforms do you use?</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {socialMediaPlatforms.map((platform) => (
                          <div key={platform} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`social-${platform}`} 
                              onCheckedChange={(checked) => 
                                handleCheckboxChange(platform, "social_media_platforms", checked === true)
                              }
                            />
                            <Label htmlFor={`social-${platform}`}>{platform}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="pt-6 flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
                <Button type="button" onClick={nextStep}>
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Digital Detox Program</h2>
                
                <div className="space-y-2">
                  <Label>Which areas are you most concerned about with digital usage?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {areasOfConcern.map((area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`concern-${area}`} 
                          onCheckedChange={(checked) => 
                            handleCheckboxChange(area, "areas_of_concern", checked === true)
                          }
                        />
                        <Label htmlFor={`concern-${area}`}>{area}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Which rewards would motivate you most to reduce screen time?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {preferredRewards.map((reward) => (
                      <div key={reward} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`reward-${reward}`} 
                          onCheckedChange={(checked) => 
                            handleCheckboxChange(reward, "preferred_rewards", checked === true)
                          }
                        />
                        <Label htmlFor={`reward-${reward}`}>{reward}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="pt-6 flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
                <Button type="submit">
                  Submit Survey
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </motion.div>
  );
};

export default SurveyForm;
