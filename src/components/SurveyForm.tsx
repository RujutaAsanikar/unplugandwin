
import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';

// Social media platforms options
const socialMediaPlatforms = [
  { id: 'facebook', label: 'Facebook' },
  { id: 'twitter', label: 'Twitter/X' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'discord', label: 'Discord' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'snapchat', label: 'Snapchat' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'reddit', label: 'Reddit' },
];

// Concern areas
const concernAreas = [
  { id: 'physical', label: 'Reduced physical activity' },
  { id: 'social', label: 'Decreased face-to-face social interactions' },
  { id: 'anxiety', label: 'Anxiety or depression' },
  { id: 'content', label: 'Exposure to inappropriate content' },
  { id: 'other', label: 'Other' },
  { id: 'sleep', label: 'Sleep disturbances' },
  { id: 'academic', label: 'Poor academic performance' },
  { id: 'addiction', label: 'Addiction to devices' },
  { id: 'cyberbullying', label: 'Cyberbullying' },
];

// Reward options
const rewardOptions = [
  { id: 'cash', label: 'Cash rewards' },
  { id: 'events', label: 'Special events/experiences' },
  { id: 'privileges', label: 'Extra privileges' },
  { id: 'subscription', label: 'Subscription services' },
  { id: 'gift_cards', label: 'Gift cards' },
  { id: 'electronics', label: 'Electronics/gadgets' },
  { id: 'education', label: 'Educational opportunities' },
  { id: 'custom', label: 'Custom rewards (specify in comments)' },
];

// Generate age options (5-20)
const generateAgeOptions = () => {
  const options = [];
  for (let i = 5; i <= 20; i++) {
    options.push({ value: String(i), label: String(i) });
  }
  return options;
};

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  age: z.string({
    required_error: "Please select your age.",
  }),
  personal_phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits."
  }),
  parent_phone: z.string().min(10, {
    message: "Parent's phone number must be at least 10 digits."
  }),
  daily_screen_time: z.enum(["less_than_1", "1_to_2", "2_to_4", "4_to_6", "more_than_6"], {
    required_error: "Please select your average daily screen time.",
  }),
  social_media_platforms: z.array(z.string()).min(1, {
    message: "Please select at least one social media platform.",
  }),
  device_access: z.enum(["smartphone", "tablet", "computer", "multiple"], {
    required_error: "Please select the devices you have access to.",
  }),
  areas_of_concern: z.array(z.string()).min(1, {
    message: "Please select at least one area of concern.",
  }),
  preferred_rewards: z.array(z.string()).min(1, {
    message: "Please select at least one preferred reward.",
  }),
  screen_time_concern: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SurveyFormProps {
  onComplete: (data: any) => void;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  
  // Progress calculation
  const progress = (step / totalSteps) * 100;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      personal_phone: "",
      parent_phone: "",
      daily_screen_time: undefined,
      social_media_platforms: [],
      device_access: undefined,
      areas_of_concern: [],
      preferred_rewards: [],
      screen_time_concern: false,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Survey data:", data);
    onComplete(data);
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    
    if (step === 1) {
      fieldsToValidate = ["name", "age", "personal_phone", "parent_phone"];
    } else if (step === 2) {
      fieldsToValidate = ["device_access", "social_media_platforms", "daily_screen_time"];
    }
    
    const isValid = await form.trigger(fieldsToValidate as any);
    
    if (isValid) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="mt-2">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-end">
          <p className="text-sm text-gray-500">Step {step} of {totalSteps}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium flex">
                      Your Name <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your name" 
                        {...field} 
                        className="py-6 px-4 rounded-xl text-base"
                      />
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
                    <FormLabel className="text-lg font-medium flex">
                      Your Age <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="py-6 px-4 rounded-xl text-base">
                          <SelectValue placeholder="Select your age" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {generateAgeOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Please select your age between 5 and 20 years.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="personal_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium flex">
                      Your Phone Number <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. +1234567890" 
                        type="tel" 
                        {...field}
                        className="py-6 px-4 rounded-xl text-base" 
                      />
                    </FormControl>
                    <FormDescription>
                      Please enter a valid phone number with country code (e.g., +1234567890)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parent_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium flex">
                      Parent/Guardian Phone Number <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. +1234567890" 
                        type="tel" 
                        {...field}
                        className="py-6 px-4 rounded-xl text-base" 
                      />
                    </FormControl>
                    <FormDescription>
                      Please enter a valid phone number with country code (e.g., +1234567890)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="device_access"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium flex">
                      What devices do you have access to? <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="py-6 px-4 rounded-xl text-base">
                          <SelectValue placeholder="Select devices" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="smartphone">Smartphone</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="computer">Computer</SelectItem>
                        <SelectItem value="multiple">Multiple Devices</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="social_media_platforms"
                render={() => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel className="text-lg font-medium flex">
                        Which social media platforms do you use? <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormDescription>
                        Select all that apply.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {socialMediaPlatforms.map((platform) => (
                        <FormField
                          key={platform.id}
                          control={form.control}
                          name="social_media_platforms"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={platform.id}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(platform.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, platform.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== platform.id
                                            )
                                          )
                                    }}
                                    className="h-5 w-5 border-2 border-primary data-[state=checked]:bg-primary"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {platform.label}
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
                name="daily_screen_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium flex">
                      How much time do you spend on screens daily? <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="py-6 px-4 rounded-xl text-base">
                          <SelectValue placeholder="Select screen time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="less_than_1">Less than 1 hour</SelectItem>
                        <SelectItem value="1_to_2">1-2 hours</SelectItem>
                        <SelectItem value="2_to_4">2-4 hours</SelectItem>
                        <SelectItem value="4_to_6">4-6 hours</SelectItem>
                        <SelectItem value="more_than_6">More than 6 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="screen_time_concern"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 space-y-0 rounded-md p-4 bg-gray-50">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                        className="h-5 w-5 border-2 border-primary data-[state=checked]:bg-primary"
                      />
                    </FormControl>
                    <FormLabel className="font-medium cursor-pointer">
                      Are you concerned about your screen time?
                    </FormLabel>
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="areas_of_concern"
                render={() => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel className="text-lg font-medium flex">
                        What areas are you most concerned about? <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormDescription>
                        Select all that apply.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {concernAreas.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="areas_of_concern"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                    className="h-5 w-5 border-2 border-primary data-[state=checked]:bg-primary"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {item.label}
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
                name="preferred_rewards"
                render={() => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel className="text-lg font-medium flex">
                        What types of rewards would motivate you? <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormDescription>
                        Select all that apply.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {rewardOptions.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="preferred_rewards"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                    className="h-5 w-5 border-2 border-primary data-[state=checked]:bg-primary"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {item.label}
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
            </motion.div>
          )}

          <div className="flex justify-between pt-6">
            {step > 1 ? (
              <Button 
                type="button" 
                variant="outline" 
                onClick={previousStep}
                className="rounded-full px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            ) : (
              <div></div> // Empty div to maintain flex spacing
            )}

            {step < totalSteps ? (
              <Button 
                type="button" 
                onClick={nextStep}
                className="bg-primary hover:bg-primary/90 rounded-full px-6"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 rounded-full px-8"
              >
                Submit Survey
                <Send className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SurveyForm;
