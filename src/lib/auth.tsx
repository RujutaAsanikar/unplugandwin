
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
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null };
  }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // THEN check for existing session
    const setData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
        } else {
          console.log("Initial session check:", session?.user?.email || "No session");
        }
        
        setSession(session);
        setUser(session?.user ?? null);
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
      let errorMessage = error.message;
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "The email or password you entered is incorrect. Please try again.";
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { data: { user: null, session: null }, error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign up with:", email);
      
      // Add some basic client-side validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      if (password.length < 6) {
        throw new Error("Password should be at least 6 characters long");
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) {
        console.error("Sign up error:", error.message);
        throw error;
      }
      
      if (data.user?.identities?.length === 0) {
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
