
import React from 'react';
import { motion } from 'framer-motion';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ResetPasswordForm from './ResetPasswordForm';

interface AuthModalContentProps {
  mode: 'login' | 'signup' | 'forgot-password' | 'admin-reset';
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  username: string;
  setUsername: (username: string) => void;
  emailError: string;
  passwordError: string;
  usernameError: string;
  generalError: string;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleForgotPassword: () => void;
  handleAdminReset: () => void;
  toggleMode: (newMode: 'login' | 'signup' | 'forgot-password' | 'admin-reset') => void;
}

const AuthModalContent: React.FC<AuthModalContentProps> = ({
  mode,
  email,
  setEmail,
  password,
  setPassword,
  username,
  setUsername,
  emailError,
  passwordError,
  usernameError,
  generalError,
  isSubmitting,
  handleSubmit,
  handleForgotPassword,
  handleAdminReset,
  toggleMode
}) => {
  const renderTitle = () => {
    switch(mode) {
      case 'login':
        return 'Welcome Back';
      case 'signup':
        return 'Welcome';
      case 'forgot-password':
        return 'Reset Password';
      case 'admin-reset':
        return 'Admin Reset';
    }
  };

  const renderDescription = () => {
    switch(mode) {
      case 'login':
        return 'Sign in to continue';
      case 'signup':
        return 'Sign up to track your digital detox progress';
      case 'forgot-password':
        return 'Enter your email to receive a password reset link';
      case 'admin-reset':
        return 'Reset admin username and password';
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{renderTitle()}</DialogTitle>
        <DialogDescription>{renderDescription()}</DialogDescription>
      </DialogHeader>
      
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {mode === 'login' && (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            emailError={emailError}
            passwordError={passwordError}
            generalError={generalError}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
            handleForgotPassword={handleForgotPassword}
            handleAdminReset={handleAdminReset}
          />
        )}
        
        {mode === 'signup' && (
          <SignupForm
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
          />
        )}
        
        {(mode === 'forgot-password' || mode === 'admin-reset') && (
          <ResetPasswordForm
            email={email}
            setEmail={setEmail}
            emailError={emailError}
            generalError={generalError}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
            isAdminReset={mode === 'admin-reset'}
          />
        )}
      </motion.div>
      
      <DialogFooter className="flex flex-col items-center sm:flex-row sm:justify-center">
        {mode === 'login' && (
          <Button
            type="button"
            variant="link"
            onClick={() => toggleMode('signup')}
            className="text-primary hover:text-primary/80"
          >
            Don't have an account? Sign Up
          </Button>
        )}
        {mode === 'signup' && (
          <Button
            type="button"
            variant="link"
            onClick={() => toggleMode('login')}
            className="text-primary hover:text-primary/80"
          >
            Already have an account? Sign In
          </Button>
        )}
        {(mode === 'forgot-password' || mode === 'admin-reset') && (
          <Button
            type="button"
            variant="link"
            onClick={() => toggleMode('login')}
            className="text-primary hover:text-primary/80"
          >
            Back to Sign In
          </Button>
        )}
      </DialogFooter>
    </>
  );
};

export default AuthModalContent;
