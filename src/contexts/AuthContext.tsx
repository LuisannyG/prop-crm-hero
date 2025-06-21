import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (
    email: string, 
    password: string, 
    fullName: string, 
    userType: 'independent_agent' | 'small_company',
    companyName?: string,
    userRole?: string
  ) => Promise<{ error: any; data?: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string, 
    password: string, 
    fullName: string, 
    userType: 'independent_agent' | 'small_company',
    companyName?: string,
    userRole?: string
  ) => {
    try {
      // Verificar si ya existe un usuario con este email en la tabla profiles
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (existingProfile) {
        return { 
          error: { 
            message: 'User already registered',
            code: 'user_already_exists' 
          } 
        };
      }

      const userData: any = {
        full_name: fullName,
        user_type: userType,
      };

      // Agregar campos adicionales para empresas
      if (userType === 'small_company' && companyName && userRole) {
        userData.company_name = companyName;
        userData.user_role = userRole;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        
        // Manejar el caso específico de usuario ya registrado
        if (error.message?.includes('User already registered') || error.message?.includes('already been registered')) {
          return { 
            error: { 
              message: 'User already registered',
              code: 'user_already_exists' 
            } 
          };
        }
        
        return { error };
      }

      console.log('Sign up successful:', data);
      return { error: null, data };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }

      console.log('Sign in successful:', data);
      return { error: null };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
