
import React from 'react';
import { AuthContext } from './AuthContext';
import { signIn, signUp, signOut, resetPassword } from './utils';
import { useAuthState } from './hooks/useAuthState';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, isLoading } = useAuthState();

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
