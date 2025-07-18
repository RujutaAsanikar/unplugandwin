
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Check, AlertCircle, Mail, UserCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { updateAdminUsername } from '@/lib/adminUtils';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mode, setMode] = useState<'reset' | 'request'>('reset');
  const [isAdminReset, setIsAdminReset] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check if this is an admin reset
    const adminParam = searchParams.get('admin');
    setIsAdminReset(adminParam === 'true');
    
    if (user && !isAdminReset) {
      navigate('/', { replace: true });
    }
  }, [user, navigate, searchParams, isAdminReset]);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const errorCode = searchParams.get('error_code');
    const errorDescription = searchParams.get('error_description');
    
    if (errorParam || errorCode) {
      setMode('request');
      let errorMessage = "Your password reset link is invalid or has expired. Please request a new one.";
      if (errorDescription) {
        errorMessage = decodeURIComponent(errorDescription).replace(/\+/g, ' ');
      }
      setError(errorMessage);
      return;
    }
    
    if (!searchParams.get('token')) {
      setMode('request');
    }
  }, [searchParams]);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      // If this is an admin reset and username is provided, update it
      if (isAdminReset && username && user) {
        const usernameResult = await updateAdminUsername(user.id, username);
        if (!usernameResult.success) {
          toast({
            title: "Username update failed",
            description: usernameResult.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Admin username updated",
            description: "Your admin username has been updated successfully",
          });
        }
      }
      
      setSuccess(true);
      
      toast({
        title: "Password updated successfully",
        description: "You will be redirected to the login page shortly",
      });
      
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
      
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message || 'An error occurred while resetting your password');
      
      if (err.message.includes('invalid') || err.message.includes('expire')) {
        setMode('request');
        setError('Your password reset link is invalid or has expired. Please request a new one.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send reset email with admin flag if it's an admin reset
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `https://f428d67c-6a80-41d5-9c6d-63e0509c9b88.lovableproject.com/reset-password${isAdminReset ? '?admin=true' : ''}`,
      });
      
      if (error) throw error;
      
      setSuccess(true);
      toast({
        title: "Password reset link sent",
        description: "Check your email for the password reset link",
      });
      
    } catch (err: any) {
      console.error('Request password reset error:', err);
      setError(err.message || 'An error occurred while sending the reset link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRequestForm = () => (
    <form onSubmit={handleRequestSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="pl-10"
            required
          />
        </div>
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending Reset Link...
          </span>
        ) : (
          'Send Reset Link'
        )}
      </Button>
      <div className="text-center mt-4">
        <Button
          type="button"
          variant="link"
          onClick={() => navigate('/')}
          className="text-sm"
        >
          Back to Login
        </Button>
      </div>
    </form>
  );

  const renderResetForm = () => (
    <form onSubmit={handleResetSubmit} className="space-y-4">
      {isAdminReset && (
        <div className="space-y-2">
          <Label htmlFor="username">Admin Username</Label>
          <div className="relative">
            <UserCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="New admin username"
              className="pl-10"
              autoComplete="username"
            />
          </div>
          <p className="text-xs text-muted-foreground">Leave blank if you don't want to change your username</p>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="new-password"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating {isAdminReset ? 'Admin ' : ''}Password...
          </span>
        ) : (
          `Reset ${isAdminReset ? 'Admin ' : ''}Password`
        )}
      </Button>
    </form>
  );

  const renderSuccessMessage = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-6"
    >
      <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <Check className="h-6 w-6 text-green-600" />
      </div>
      {mode === 'reset' ? (
        <>
          <h3 className="text-lg font-medium text-gray-900">{isAdminReset ? 'Admin password' : 'Password'} updated successfully</h3>
          <p className="text-sm text-gray-500 mt-1">
            You will be redirected to the login page in a few seconds.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium text-gray-900">Reset link sent</h3>
          <p className="text-sm text-gray-500 mt-1">
            Please check your email for the password reset link.
          </p>
          <Button
            onClick={() => navigate('/')}
            className="mt-4"
          >
            Return to Home
          </Button>
        </>
      )}
    </motion.div>
  );
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {isAdminReset 
              ? (mode === 'reset' ? 'Reset Admin Credentials' : 'Reset Admin Password')
              : (mode === 'reset' ? 'Reset Password' : 'Forgot Password')
            }
          </CardTitle>
          <CardDescription className="text-center">
            {mode === 'reset' 
              ? (isAdminReset ? 'Update your admin username and password' : 'Enter your new password below')
              : 'Enter your email to receive a password reset link'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success ? renderSuccessMessage() : (
            mode === 'reset' ? renderResetForm() : renderRequestForm()
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResetPasswordPage;
