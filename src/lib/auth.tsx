
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null };
  }>;
  signUp: (email: string, password: string, username?: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null };
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null; data: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log("Auth state changed:", _event, newSession?.user?.email);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLoading(false);
    });

    // THEN check for existing session
    const setData = async () => {
      try {
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
        } else {
          console.log("Initial session check:", existingSession?.user?.email || "No session");
        }
        
        setSession(existingSession);
        setUser(existingSession?.user ?? null);
        setIsLoading(false);
      } catch (err) {
        console.error("Unexpected error during session check:", err);
        setIsLoading(false);
      }
    };

    setData();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in with:", email);
      
      // Add some basic client-side validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      // Make sure we're using proper email formatting
      email = email.trim().toLowerCase();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
        throw error;
      }
      
      console.log("Sign in successful for:", email);
      toast({
        title: "Sign in successful",
        description: "Welcome back!",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error("Sign in error:", error.message);
      
      // Provide more user-friendly error messages
      let errorMessage = "An error occurred during sign in";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "The email or password you entered is incorrect. Please try again.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please verify your email address before signing in.";
      } else if (error.message.includes("rate limit")) {
        errorMessage = "Too many sign in attempts. Please try again later.";
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { data: { user: null, session: null }, error };
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      console.log("Attempting to sign up with:", email);
      
      // Add some basic client-side validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      if (password.length < 6) {
        throw new Error("Password should be at least 6 characters long");
      }
      
      // Make sure we're using proper email formatting
      email = email.trim().toLowerCase();
      
      // Add username to user metadata if provided
      const options: {
        emailRedirectTo: string;
        data?: { username: string }
      } = {
        emailRedirectTo: `${window.location.origin}`
      };

      if (username) {
        options.data = { username };
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options
      });
      
      if (error) {
        console.error("Sign up error:", error.message);
        throw error;
      }
      
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast({
          title: "Account already exists",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
        return { data: { user: null, session: null }, error: new Error("Email already exists") };
      }
      
      console.log("Sign up successful for:", email);
      toast({
        title: "Sign up successful",
        description: "Please check your email for a confirmation link!",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error("Sign up error:", error.message);
      
      // Provide more user-friendly error messages
      let errorMessage = error.message;
      if (error.message.includes("duplicate key")) {
        errorMessage = "This email is already registered. Please sign in instead.";
      }
      
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { data: { user: null, session: null }, error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Password reset link sent",
        description: "Check your email for a password reset link",
      });

      return { data, error: null };
    } catch (error) {
      console.error("Password reset error:", error.message);
      
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive",
      });
      
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error) {
      console.error("Sign out error:", error.message);
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
