
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  childName: z.string().min(2, {
    message: "Child's name must be at least 2 characters.",
  }),
  concernLevel: z.enum(["not_concerned", "somewhat_concerned", "very_concerned"], {
    required_error: "Please select your concern level.",
  }),
  knowsAppsUsed: z.enum(["yes", "no", "maybe"], {
    required_error: "Please select an option.",
  }),
  usageRating: z.enum(["very_low", "low", "moderate", "high", "very_high"], {
    required_error: "Please select a usage rating.",
  }),
  noticedChanges: z.enum(["yes", "no"], {
    required_error: "Please select an option.",
  }),
  behaviorChanges: z.string().optional(),
  supportChallenge: z.enum(["yes_definitely", "maybe", "not_interested"], {
    required_error: "Please select your level of support.",
  }),
  monitoringLikelihood: z.enum(["very_likely", "somewhat_likely", "not_very_likely", "not_at_all"], {
    required_error: "Please select how likely you are to monitor.",
  }),
  rewardTypes: z.array(z.string()).min(1, {
    message: "Please select at least one reward type.",
  }),
  benefitTypes: z.array(z.string()).min(1, {
    message: "Please select at least one benefit type.",
  }),
  challengeTypes: z.array(z.string()).min(1, {
    message: "Please select at least one challenge type.",
  }),
  monthlyBudget: z.enum(["less_than_500", "500_to_1000", "1000_to_2000", "more_than_2000", "other"], {
    required_error: "Please select a budget range.",
  }),
  otherBudget: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ParentSurveyPage = () => {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const totalSteps = 4;
  const navigate = useNavigate();
  
  // Progress calculation
  const progress = (step / totalSteps) * 100;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      childName: "",
      concernLevel: undefined,
      knowsAppsUsed: undefined,
      usageRating: undefined,
      noticedChanges: undefined,
      behaviorChanges: "",
      supportChallenge: undefined,
      monitoringLikelihood: undefined,
      rewardTypes: [],
      benefitTypes: [],
      challengeTypes: [],
      monthlyBudget: undefined,
      otherBudget: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const { error } = await supabase.from('parent_surveys').insert({
        name: data.name,
        child_name: data.childName,
        concern_level: data.concernLevel,
        knows_apps_used: data.knowsAppsUsed,
        usage_rating: data.usageRating,
        noticed_changes: data.noticedChanges,
        behavior_changes: data.behaviorChanges,
        support_challenge: data.supportChallenge,
        monitoring_likelihood: data.monitoringLikelihood,
        reward_types: data.rewardTypes,
        benefit_types: data.benefitTypes,
        challenge_types: data.challengeTypes,
        monthly_budget: data.monthlyBudget,
        other_budget: data.otherBudget,
      });

      if (error) {
        console.error("Error saving parent survey:", error);
        toast({
          title: "Error Saving Data",
          description: "There was a problem saving your survey data. We'll still proceed with your submission.",
          variant: "destructive"
        });
      }

      setCompleted(true);
      toast({
        title: "Survey Submitted",
        description: "Thank you for completing the parent survey!",
      });
    } catch (error) {
      console.error("Error in survey submission:", error);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    
    if (step === 1) {
      fieldsToValidate = ["name", "childName", "concernLevel", "knowsAppsUsed"];
    } else if (step === 2) {
      fieldsToValidate = ["usageRating", "noticedChanges", "supportChallenge"];
      if (form.getValues().noticedChanges === "yes") {
        fieldsToValidate.push("behaviorChanges");
      }
    } else if (step === 3) {
      fieldsToValidate = ["monitoringLikelihood", "rewardTypes", "benefitTypes"];
    }
    
    const isValid = await form.trigger(fieldsToValidate as any);
    
    if (isValid) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const previousStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleReturnHome = () => {
    navigate('/home');
  };

  // Define reward options
  const rewardOptions = [
    { id: "cash", label: "Cash allowance" },
    { id: "screen_time", label: "Extra screen time for non-social media activities" },
    { id: "outings", label: "Family outings or activities" },
    { id: "toys", label: "Toys or games" },
    { id: "education", label: "Educational experiences" },
    { id: "other", label: "Other" },
  ];

  // Define benefit options
  const benefitOptions = [
    { id: "focus", label: "Better focus on studies or other activities" },
    { id: "mental_health", label: "Improved mental health and well-being" },
    { id: "relationships", label: "Strengthened relationships with family and friends" },
    { id: "other", label: "Other" },
  ];

  // Define challenge options
  const challengeOptions = [
    { id: "setting_limits", label: "Difficulty setting limits" },
    { id: "balancing", label: "Balancing screen time with other activities" },
    { id: "peer_pressure", label: "Peer pressure or influence" },
    { id: "awareness", label: "Lack of awareness about their online activities" },
    { id: "other", label: "Other" },
  ];

  if (completed) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header activeTab="Home" />
        <div className="container mx-auto max-w-2xl px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-xl shadow-lg text-center"
          >
            <h2 className="text-2xl font-bold text-primary mb-6">Thank You!</h2>
            <p className="text-gray-700 mb-6">
              Your survey has been submitted successfully. We appreciate your input on helping children reduce their screen time.
            </p>
            <p className="text-gray-700 mb-8">
              We'll be in touch with more information about how your child can participate in our digital detox challenges.
            </p>
            <Button onClick={handleReturnHome} className="bg-primary hover:bg-primary/90 rounded-full px-6">
              Return to Home
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab="Home" />
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Parent Survey</h1>
          <p className="text-gray-600 text-center mb-8">
            Help us understand how we can support your child in reducing screen time
          </p>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-1">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Step {step} of {totalSteps}</p>
              <p className="text-sm text-gray-500">{Math.round(progress)}%</p>
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
                        <FormLabel className="text-lg flex">
                          Name <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your name" 
                            {...field} 
                            className="py-5 px-4 rounded-lg text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="childName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg flex">
                          Name of Child / Children <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Child's name" 
                            {...field} 
                            className="py-5 px-4 rounded-lg text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="concernLevel"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-lg flex">
                          How concerned are you about the amount of time your child spends on social media? <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="not_concerned" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Not concerned
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="somewhat_concerned" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Somewhat concerned
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="very_concerned" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Very concerned
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="knowsAppsUsed"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-lg flex">
                          Do you know which social media apps or websites your child uses most frequently? <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Yes
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="no" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                No
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="maybe" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Maybe
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
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
                  <FormField
                    control={form.control}
                    name="usageRating"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-lg flex">
                          How would you rate your child's overall social media usage? <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="very_low" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Very low
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="low" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Low
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="moderate" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Moderate
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="high" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                High
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="very_high" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Very high
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="noticedChanges"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-lg flex">
                          Have you noticed any changes in your child's behavior or mood related to their social media usage? <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Yes
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="no" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                No
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("noticedChanges") === "yes" && (
                    <FormField
                      control={form.control}
                      name="behaviorChanges"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg flex">
                            What changes have you noticed in your child's behavior? <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Describe the changes you've noticed"
                              {...field}
                              className="py-5 px-4 rounded-lg text-base"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="supportChallenge"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-lg flex">
                          Would you support your child participating in a digital detox challenge to reduce their social media usage? <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes_definitely" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Yes, definitely
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="maybe" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Maybe, if it's beneficial
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="not_interested" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                No, not interested
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
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
                  <FormField
                    control={form.control}
                    name="monitoringLikelihood"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-lg flex">
                          How likely are you to monitor or enforce limits on your child's social media usage at home? <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="very_likely" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Very likely
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="somewhat_likely" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Somewhat likely
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="not_very_likely" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Not very likely
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="not_at_all" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Not at all likely
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rewardTypes"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel className="text-lg flex">
                            What types of rewards or incentives would you be willing to offer your child for participating in a digital detox challenge? <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormDescription>
                            Select all that apply
                          </FormDescription>
                        </div>
                        <div className="space-y-2">
                          {rewardOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="rewardTypes"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={option.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, option.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== option.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {option.label}
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
                    name="benefitTypes"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel className="text-lg flex">
                            How do you think reducing social media usage could benefit your child? <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormDescription>
                            Select all that apply
                          </FormDescription>
                        </div>
                        <div className="space-y-2">
                          {benefitOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="benefitTypes"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={option.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, option.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== option.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {option.label}
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

              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="challengeTypes"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel className="text-lg flex">
                            What challenges do you face in managing your child's social media usage? <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormDescription>
                            Select all that apply
                          </FormDescription>
                        </div>
                        <div className="space-y-2">
                          {challengeOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="challengeTypes"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={option.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, option.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== option.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {option.label}
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
                    name="monthlyBudget"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-lg flex">
                          How much money would you be willing to spend every month on rewards for your child's participation in digital detox challenges? <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="less_than_500" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Less than ₹500
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="500_to_1000" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                ₹500 - ₹1,000
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="1000_to_2000" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                ₹1,000 - ₹2,000
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="more_than_2000" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                More than ₹2,000
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="other" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Other
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("monthlyBudget") === "other" && (
                    <FormField
                      control={form.control}
                      name="otherBudget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">
                            Please specify:
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your budget"
                              {...field}
                              className="py-5 px-4 rounded-lg text-base"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
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
      </div>
    </div>
  );
};

export default ParentSurveyPage;
