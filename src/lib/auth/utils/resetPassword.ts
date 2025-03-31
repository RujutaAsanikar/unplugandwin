
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export async function resetPassword(email: string) {
  try {
    console.log("Attempting to send password reset email to:", email);
    
    // Add some basic client-side validation
    if (!email) {
      throw new Error("Email is required");
    }
    
    // Make sure we're using proper email formatting
    email = email.trim().toLowerCase();
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error("Password reset error:", error.message);
      throw error;
    }
    
    console.log("Password reset email sent to:", email);
    
    return { data, error: null };
  } catch (error) {
    console.error("Password reset error:", error.message);
    
    // Provide more user-friendly error messages
    let errorMessage = "An error occurred during password reset";
    
    if (error.message.includes("rate limit")) {
      errorMessage = "Too many password reset attempts. Please try again later.";
    }
    
    toast({
      title: "Password reset failed",
      description: errorMessage,
      variant: "destructive",
    });
    
    return { data: null, error };
  }
}
