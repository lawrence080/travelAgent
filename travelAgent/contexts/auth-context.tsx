import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REMEMBER_ME_KEY = 'rememberMe';

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
    const checkRememberedSession = async () => {
      try {
        const rememberValue = await AsyncStorage.getItem(REMEMBER_ME_KEY);
        setIsSignedIn(rememberValue === 'true');
      } catch (error) {
        setIsSignedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkRememberedSession();
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
