import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { authService, type AuthState } from "./authService";

interface AuthContextType extends AuthState {
  signUp: (data: {
    email: string;
    password: string;
    fullName?: string;
  }) => Promise<{ error: string | null }>;
  signIn: (data: {
    email: string;
    password: string;
  }) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { session, error } = await authService.getSession();
        if (error) {
          setError(error);
        } else {
          setUser(session?.user || null);
        }
      } catch (err) {
        setError("Failed to load session");
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      setLoading(false);

      if (event === "SIGNED_OUT") {
        setError(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (userData: {
    email: string;
    password: string;
    fullName?: string;
  }) => {
    setLoading(true);
    setError(null);

    const { error } = await authService.signUp(userData);

    if (error) {
      setError(error);
    }

    setLoading(false);
    return { error };
  };

  const signIn = async (userData: { email: string; password: string }) => {
    setLoading(true);
    setError(null);

    const { error } = await authService.signIn(userData);

    if (error) {
      setError(error);
    }

    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await authService.signOut();

    if (error) {
      setError(error);
    }

    setLoading(false);
    return { error };
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    const { error } = await authService.resetPassword(email);

    if (error) {
      setError(error);
    }

    setLoading(false);
    return { error };
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
