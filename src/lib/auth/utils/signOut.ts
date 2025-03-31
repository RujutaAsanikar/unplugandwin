
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export async function signOut() {
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
}
