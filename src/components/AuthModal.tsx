import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, AlertCircle, User, ShieldAlert } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

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
  const [showPassword, setShowPassword] = useState(false);
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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(trimmedEmail)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (mode === 'forgot-password' || mode === 'admin-reset') {
      return true;
    }
    
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (mode === 'signup' && password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateUsername = (username: string): boolean => {
    if (mode === 'signup') {
      const trimmedUsername = username.trim();
      if (!trimmedUsername) {
        setUsernameError('Username is required');
        return false;
      } else if (trimmedUsername.length < 3) {
        setUsernameError('Username must be at least 3 characters long');
        return false;
      }
      setUsernameError('');
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setEmailError('');
    setPasswordError('');
    setUsernameError('');
    setGeneralError('');
    
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();
    const isEmailValid = validateEmail(trimmedEmail);
    const isPasswordValid = validatePassword(password);
    const isUsernameValid = validateUsername(trimmedUsername);
    
    if (!isEmailValid || (mode !== 'forgot-password' && mode !== 'admin-reset' && !isPasswordValid) || (mode === 'signup' && !isUsernameValid)) {
      return;
    }
    
    setIsSubmitting(true);
    
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{renderTitle()}</DialogTitle>
          <DialogDescription>
            {renderDescription()}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {generalError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => validateEmail(email)}
                className={`pl-10 ${emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>
            {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
          </div>
          
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (usernameError) validateUsername(e.target.value);
                  }}
                  onBlur={() => validateUsername(username)}
                  className={`pl-10 ${usernameError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  placeholder="Your username"
                  required
                  autoComplete="username"
                />
              </div>
              {usernameError && <p className="text-sm text-red-500 mt-1">{usernameError}</p>}
            </div>
          )}
          
          {(mode !== 'forgot-password' && mode !== 'admin-reset') && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) validatePassword(e.target.value);
                  }}
                  onBlur={() => validatePassword(password)}
                  className={`pl-10 pr-10 ${passwordError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  placeholder="••••••••"
                  required
                  minLength={mode === 'signup' ? 6 : undefined}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
              
              {mode === 'login' && (
                <div className="text-right flex justify-between">
                  <Button 
                    type="button" 
                    variant="link" 
                    className="p-0 h-auto text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                    onClick={handleAdminReset}
                  >
                    <ShieldAlert className="h-3 w-3" />
                    Admin Reset
                  </Button>
                  <Button 
                    type="button" 
                    variant="link" 
                    className="p-0 h-auto text-sm text-primary hover:text-primary/80"
                    onClick={() => toggleMode('forgot-password')}
                  >
                    Forgot password?
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="pt-4"
            >
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
                style={{ backgroundColor: "#9b87f5" }}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {mode === 'login' 
                      ? 'Signing in...' 
                      : mode === 'signup' 
                        ? 'Creating account...'
                        : mode === 'admin-reset'
                          ? 'Sending admin reset link...'
                          : 'Sending reset link...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {mode === 'login' 
                      ? 'Sign In' 
                      : mode === 'signup' 
                        ? 'Sign Up'
                        : mode === 'admin-reset'
                          ? 'Send Admin Reset Link'
                          : 'Send Reset Link'}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </motion.div>
          </AnimatePresence>
        </form>
        
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
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
