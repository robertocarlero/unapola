'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

import { auth } from '@/lib/api';

import { User } from '@/lib/types/users';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  userData: User | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
