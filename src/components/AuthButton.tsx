
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import AuthModal from './AuthModal';
import { User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/integrations/supabase/client';

const AuthButton: React.FC = () => {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchUsername = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
          
        if (!error && data) {
          setUsername(data.username);
        }
      };
      
      fetchUsername();
    } else {
      setUsername(null);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  const openSignIn = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const openSignUp = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline-block">{username || 'My Account'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-sm text-muted-foreground">
              {user.email}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-2">
          <Button variant="outline" onClick={openSignIn}>
            Sign In
          </Button>
          <Button className="bg-primary" onClick={openSignUp}>
            Sign Up
          </Button>
        </div>
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        defaultMode={authMode}
      />
    </>
  );
};

export default AuthButton;
