
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ResetPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  emailError: string;
  generalError: string;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isAdminReset?: boolean;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  email,
  setEmail,
  emailError,
  generalError,
  isSubmitting,
  handleSubmit,
  isAdminReset = false
}) => {
  return (
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
            onChange={(e) => setEmail(e.target.value)}
            className={`pl-10 ${emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            placeholder="your@email.com"
            required
            autoComplete="email"
          />
        </div>
        {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
      </div>
      
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
          style={{ backgroundColor: "#9b87f5" }}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {isAdminReset ? 'Sending admin reset link...' : 'Sending reset link...'}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {isAdminReset ? 'Send Admin Reset Link' : 'Send Reset Link'}
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
