
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth';
import { AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AuthModalContent from './auth/AuthModalContent';
import { validateEmail, validatePassword, validateUsername } from './auth/authFormValidation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup' | 'forgot-password' | 'admin-reset';
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose,
  defaultMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password' | 'admin-reset'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { signIn, signUp, resetPassword, user } = useAuth();

  useEffect(() => {
    if (user) {
      onClose();
    }
  }, [user, onClose]);

  useEffect(() => {
    setMode(defaultMode);
    console.log("Mode updated to:", defaultMode);
  }, [defaultMode]);

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setUsername('');
      setEmailError('');
      setPasswordError('');
      setUsernameError('');
      setGeneralError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleValidation = () => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password, mode);
    const usernameValidation = validateUsername(username, mode);
    
    setEmailError(emailValidation.errorMessage);
    setPasswordError(passwordValidation.errorMessage);
    setUsernameError(usernameValidation.errorMessage);
    
    return emailValidation.isValid && 
           passwordValidation.isValid && 
           usernameValidation.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setEmailError('');
    setPasswordError('');
    setUsernameError('');
    setGeneralError('');
    
    if (!handleValidation()) {
      return;
    }
    
    setIsSubmitting(true);
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();
    
    try {
      let response;
      
      if (mode === 'login') {
        response = await signIn(trimmedEmail, password);
        if (response.error) {
          setGeneralError(response.error.message);
        }
      } else if (mode === 'signup') {
        response = await signUp(trimmedEmail, password, trimmedUsername);
        
        if (response.error && (
            response.error.message.includes('already exists') || 
            response.error.message.includes('Email already exists')
          )) {
          toast({
            title: "Account already exists",
            description: "This email is already registered. Please sign in instead.",
          });
          setMode('login');
          setGeneralError('');
          setIsSubmitting(false);
          return;
        }
        
        if (!response.error && !response.data.session) {
          toast({
            title: "Sign up successful",
            description: "Please check your email for a confirmation link!",
          });
          onClose();
        } else if (response.error) {
          setGeneralError(response.error.message);
        }
      } else if (mode === 'forgot-password') {
        response = await resetPassword(trimmedEmail);
        if (!response.error) {
          toast({
            title: "Password reset email sent",
            description: "Please check your email for a password reset link",
          });
          onClose();
        } else {
          setGeneralError(response.error.message);
        }
      } else if (mode === 'admin-reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo: `${window.location.origin}/reset-password?admin=true`,
        });
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Admin reset email sent",
          description: "Please check your email for the admin reset link",
        });
        onClose();
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setGeneralError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    onClose();
    navigate('/forgot-password');
  };

  const handleAdminReset = () => {
    setMode('admin-reset');
  };

  const toggleMode = (newMode: 'login' | 'signup' | 'forgot-password' | 'admin-reset') => {
    if (newMode === 'forgot-password') {
      handleForgotPassword();
      return;
    }
    
    setMode(newMode);
    setEmailError('');
    setPasswordError('');
    setUsernameError('');
    setGeneralError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          <AuthModalContent
            mode={mode}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            username={username}
            setUsername={setUsername}
            emailError={emailError}
            passwordError={passwordError}
            usernameError={usernameError}
            generalError={generalError}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
            handleForgotPassword={handleForgotPassword}
            handleAdminReset={handleAdminReset}
            toggleMode={toggleMode}
          />
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
