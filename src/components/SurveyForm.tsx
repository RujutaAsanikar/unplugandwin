
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

// Type for survey data
type SurveyData = {
  name: string;
  age: string;
  personal_phone: string;
  parent_phone: string;
  device_access: string;
  social_media_platforms: string[];
  daily_screen_time: string;
  screen_time_concern: boolean;
  areas_of_concern: string[];
  preferred_rewards: string[];
  child_age?: string;
  relationship_to_child?: string;
};

interface SurveyFormProps {
  onComplete: (surveyData: SurveyData) => void;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SurveyData>({
    name: '',
    age: '',
    personal_phone: '',
    parent_phone: '',
    device_access: '',
    social_media_platforms: [],
    daily_screen_time: '',
    screen_time_concern: false,
    areas_of_concern: [],
    preferred_rewards: [],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Handler for form field changes
  const handleChange = (field: keyof SurveyData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field if any
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validation function
  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    // Step 0: Personal Information
    if (step === 0) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.age) newErrors.age = "Age is required";
      if (!formData.personal_phone) newErrors.personal_phone = "Phone number is required";
      if (!formData.parent_phone) newErrors.parent_phone = "Parent's phone number is required";
    }
    
    // Step 1: Digital Habits
    else if (step === 1) {
      if (!formData.device_access) newErrors.device_access = "This field is required";
      if (formData.social_media_platforms.length === 0) newErrors.social_media_platforms = "Select at least one platform";
      if (!formData.daily_screen_time) newErrors.daily_screen_time = "This field is required";
    }
    
    // Step 2: Concerns & Preferences
    else if (step === 2) {
      if (formData.areas_of_concern.length === 0) newErrors.areas_of_concern = "Select at least one area of concern";
      if (formData.preferred_rewards.length === 0) newErrors.preferred_rewards = "Select at least one preferred reward";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation functions
  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      onComplete(formData);
    }
  };

  // Age options for dropdown
  const ageOptions = Array.from({ length: 16 }, (_, i) => i + 5).map(age => (
    <SelectItem key={age} value={age.toString()}>
      {age} years old
    </SelectItem>
  ));

  // Form steps
  const steps = [
    // Step 1: Personal Information
    <motion.div
      key="step-1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <CardHeader>
        <CardTitle className="text-2xl">Personal Information</CardTitle>
        <CardDescription>Please provide your basic information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Select
            value={formData.age}
            onValueChange={(value) => handleChange('age', value)}
          >
            <SelectTrigger id="age" className={`${errors.age ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select your age" />
            </SelectTrigger>
            <SelectContent>
              {ageOptions}
            </SelectContent>
          </Select>
          {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="personal-phone">Phone Number</Label>
          <Input
            id="personal-phone"
            value={formData.personal_phone}
            onChange={(e) => handleChange('personal_phone', e.target.value)}
            className={`${errors.personal_phone ? 'border-red-500' : ''}`}
          />
          {errors.personal_phone && <p className="text-sm text-red-500">{errors.personal_phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="parent-phone">Parent's Phone Number</Label>
          <Input
            id="parent-phone"
            value={formData.parent_phone}
            onChange={(e) => handleChange('parent_phone', e.target.value)}
            className={`${errors.parent_phone ? 'border-red-500' : ''}`}
          />
          {errors.parent_phone && <p className="text-sm text-red-500">{errors.parent_phone}</p>}
        </div>
      </CardContent>
    </motion.div>,
    
    // Additional steps would go here but have been removed for brevity
    // You can expand these based on your existing functionality
    <motion.div key="step-2">
      {/* Digital Habits Step */}
    </motion.div>,
    
    <motion.div key="step-3">
      {/* Concerns & Preferences Step */}
    </motion.div>,
    
    <motion.div key="step-4">
      {/* Additional Optional Information Step */}
    </motion.div>,
    
    // Final Summary Step
    <motion.div
      key="summary"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader>
        <CardTitle className="text-2xl">Review Your Information</CardTitle>
        <CardDescription>
          Please review your information before submission
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-md p-4 bg-muted/50">
          <h3 className="font-medium mb-2">Personal Information</h3>
          <p><span className="font-semibold">Name:</span> {formData.name}</p>
          <p><span className="font-semibold">Age:</span> {formData.age}</p>
          <p><span className="font-semibold">Phone:</span> {formData.personal_phone}</p>
          <p><span className="font-semibold">Parent's Phone:</span> {formData.parent_phone}</p>
        </div>
        
        {/* Additional summary sections would go here */}
        
      </CardContent>
    </motion.div>
  ];

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        {/* Progress indicator */}
        <div className="border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <div className="flex w-2/3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Current step content */}
        {steps[currentStep]}
        
        {/* Navigation buttons */}
        <CardFooter className="flex justify-between border-t p-6">
          <Button
            type="button"
            variant="outline"
            onClick={goToPrevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={goToNextStep}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit">
              Submit Survey
              <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default SurveyForm;
