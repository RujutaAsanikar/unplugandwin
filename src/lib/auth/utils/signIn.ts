
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export async function signIn(email: string, password: string) {
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
}
