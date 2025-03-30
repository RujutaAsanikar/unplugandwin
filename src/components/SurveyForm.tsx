
import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

const socialMediaPlatforms = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'snapchat', label: 'Snapchat' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'twitter', label: 'Twitter/X' },
  { id: 'reddit', label: 'Reddit' },
  { id: 'discord', label: 'Discord' },
];

const concernAreas = [
  { id: 'sleep', label: 'Sleep disruption' },
  { id: 'anxiety', label: 'Anxiety' },
  { id: 'concentration', label: 'Poor concentration' },
  { id: 'social', label: 'Social comparison' },
  { id: 'addiction', label: 'Screen addiction' },
  { id: 'cyberbullying', label: 'Cyberbullying' },
];

const rewardOptions = [
  { id: 'badge', label: 'Digital badges' },
  { id: 'certificate', label: 'Digital certificates' },
  { id: 'discount', label: 'Store discounts' },
  { id: 'recognition', label: 'Public recognition' },
];

const generateAgeOptions = () => {
  const options = [];
  for (let i = 5; i <= 20; i++) {
    options.push({ value: String(i), label: String(i) });
  }
  return options;
};

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
  parent_phone: z.string().optional(),
  daily_screen_time: z.enum(["less_than_1", "1_to_2", "2_to_4", "4_to_6", "more_than_6"], {
    required_error: "Please select your average daily screen time.",
  }),
  social_media_platforms: z.array(z.string()).min(1, {
    message: "Please select at least one social media platform.",
  }),
  device_access: z.enum(["smartphone", "tablet", "computer", "multiple"], {
    required_error: "Please select your primary device.",
  }),
  areas_of_concern: z.array(z.string()).min(1, {
    message: "Please select at least one area of concern.",
  }),
  preferred_rewards: z.array(z.string()).min(1, {
    message: "Please select at least one preferred reward.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface SurveyFormProps {
  onComplete: (data: any) => void;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

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
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Survey data:", data);
    onComplete(data);
  };

  const nextStep = async () => {
    let fieldsToValidate: ("name" | "age" | "personal_phone" | "parent_phone" | "daily_screen_time" | "social_media_platforms" | "device_access" | "areas_of_concern" | "preferred_rewards")[] = [];
    
    if (step === 1) {
      fieldsToValidate = ["name", "age", "personal_phone", "parent_phone"];
    } else if (step === 2) {
      fieldsToValidate = ["daily_screen_time", "social_media_platforms", "device_access"];
    }
    
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  return (
    <Card className="border-primary/20 bg-card shadow-lg">
      <CardContent className="pt-6">
        <div className="mb-8">
          <p className="text-center text-muted-foreground mb-2">Step {step} of {totalSteps}</p>
          <Progress value={(step / totalSteps) * 100} className="h-2 bg-primary/20" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-center mb-6">Personal Information</h2>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
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
                      <FormLabel>Age</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your age" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {generateAgeOptions().map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personal_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Your phone number" type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parent_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent's Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Parent's phone number" type="tel" {...field} />
                      </FormControl>
                      <FormDescription>
                        If you're under 13, please provide a parent's phone number.
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
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-center mb-6">Digital Habits</h2>

                <FormField
                  control={form.control}
                  name="daily_screen_time"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Average Daily Screen Time on Social Media</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="less_than_1" />
                            </FormControl>
                            <FormLabel className="font-normal">Less than 1 hour</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="1_to_2" />
                            </FormControl>
                            <FormLabel className="font-normal">1-2 hours</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="2_to_4" />
                            </FormControl>
                            <FormLabel className="font-normal">2-4 hours</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="4_to_6" />
                            </FormControl>
                            <FormLabel className="font-normal">4-6 hours</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="more_than_6" />
                            </FormControl>
                            <FormLabel className="font-normal">More than 6 hours</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="social_media_platforms"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Social Media Platforms You Use</FormLabel>
                        <FormDescription>
                          Select all that apply.
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {socialMediaPlatforms.map((platform) => (
                          <FormField
                            key={platform.id}
                            control={form.control}
                            name="social_media_platforms"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={platform.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
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
                  name="device_access"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Device for Social Media</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your primary device" />
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
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-center mb-6">Concerns & Rewards</h2>

                <FormField
                  control={form.control}
                  name="areas_of_concern"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Areas of Concern</FormLabel>
                        <FormDescription>
                          Select all that apply to you.
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {concernAreas.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="areas_of_concern"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
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
                      <div className="mb-4">
                        <FormLabel className="text-base">Preferred Rewards</FormLabel>
                        <FormDescription>
                          What rewards would motivate you to reduce screen time?
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {rewardOptions.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="preferred_rewards"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
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

            <div className="flex justify-between pt-4">
              {step > 1 ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={previousStep}
                  className="flex items-center"
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
                  className="flex items-center"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SurveyForm;
