
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Checks if a user is an admin
 */
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Unexpected error checking admin status:', error);
    return false;
  }
};

/**
 * Resets admin password through Supabase authentication
 */
export const resetAdminPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    // First, verify this is an admin email
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .single();
    
    if (adminError || !adminData) {
      return { 
        success: false, 
        message: 'Only existing administrators can reset admin credentials'
      };
    }

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password?admin=true`,
    });
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Password reset link sent to your email'
    };
    
  } catch (error: any) {
    console.error('Admin reset error:', error);
    return {
      success: false,
      message: error.message || 'Failed to send reset link'
    };
  }
};

/**
 * Updates admin username (profile)
 */
export const updateAdminUsername = async (userId: string, newUsername: string): Promise<{ success: boolean; message: string }> => {
  try {
    // First, verify this is an admin
    const isAdmin = await isUserAdmin(userId);
    
    if (!isAdmin) {
      return { 
        success: false, 
        message: 'Only administrators can update admin usernames'
      };
    }

    // Update username in profiles table
    const { error } = await supabase
      .from('profiles')
      .update({ username: newUsername })
      .eq('id', userId);
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Admin username updated successfully'
    };
    
  } catch (error: any) {
    console.error('Admin username update error:', error);
    return {
      success: false,
      message: error.message || 'Failed to update admin username'
    };
  }
};
