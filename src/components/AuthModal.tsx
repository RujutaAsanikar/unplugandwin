
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';

export interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onOpenChange, 
  defaultMode = 'login' 
}) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };
  
  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{showForgotPassword ? "Reset Password" : "Account"}</DialogTitle>
          <DialogDescription>
            {showForgotPassword 
              ? "Enter your email to receive a password reset link" 
              : "Sign in or create an account to continue"}
          </DialogDescription>
        </DialogHeader>
        
        {showForgotPassword ? (
          <ForgotPasswordForm onCancel={handleBackToLogin} />
        ) : (
          <Tabs defaultValue={defaultMode} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm 
                onSuccess={() => onOpenChange(false)} 
                onForgotPassword={handleForgotPassword}
              />
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm onSuccess={() => onOpenChange(false)} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
