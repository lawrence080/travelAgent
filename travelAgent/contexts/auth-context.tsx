import React, { createContext, useState, useEffect, ReactNode } from 'react';

type AuthContextType = {
  isSignedIn: boolean;
  setIsSignedIn: (value: boolean) => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Check AsyncStorage or your auth service here
    // For now, simulate a quick check
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}