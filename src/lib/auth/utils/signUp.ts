
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export async function signUp(email: string, password: string, username?: string) {
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
      emailRedirectTo: window.location.origin
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
}
