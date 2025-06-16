
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string;
  role: 'admin' | 'operator' | 'viewer';
  department: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Sistema de alertas para debugging
const authLogger = {
  info: (message: string, data?: any) => {
    console.log(`🔵 AUTH INFO: ${message}`, data || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`🟡 AUTH WARNING: ${message}`, data || '');
  },
  error: (message: string, error?: any) => {
    console.error(`🔴 AUTH ERROR: ${message}`, error || '');
  },
  success: (message: string, data?: any) => {
    console.log(`🟢 AUTH SUCCESS: ${message}`, data || '');
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { toast } = useToast();

  // Verificar modo demo al inicializar
  useEffect(() => {
    const demoMode = sessionStorage.getItem('demo_mode');
    if (demoMode === 'true') {
      authLogger.info('Demo mode detectado al inicializar');
      enableDemoMode();
    }
  }, []);

  useEffect(() => {
    authLogger.info('Iniciando configuración de autenticación');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        authLogger.info(`Auth state cambió: ${event}`, { hasSession: !!session, hasUser: !!session?.user });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && !isDemoMode) {
          authLogger.info('Usuario autenticado, obteniendo perfil', { userId: session.user.id });
          // Defer profile fetch to avoid potential deadlock
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else if (!session && !isDemoMode) {
          authLogger.info('No hay sesión activa, limpiando perfil');
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        authLogger.error('Error al obtener sesión existente', error);
      } else {
        authLogger.info('Verificando sesión existente', { hasSession: !!session });
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user && !isDemoMode) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      authLogger.info('Limpiando subscription de auth');
      subscription.unsubscribe();
    };
  }, [isDemoMode]);

  const fetchProfile = async (userId: string) => {
    try {
      authLogger.info('Iniciando fetch de perfil', { userId });
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        authLogger.error('Error fetching profile', error);
        toast({
          title: "Error al cargar perfil",
          description: "No se pudo cargar la información del usuario",
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        authLogger.warn('No se encontró perfil para el usuario', { userId });
        return;
      }

      // Type assertion to ensure role is properly typed
      const profileData: Profile = {
        ...data,
        role: data.role as 'admin' | 'operator' | 'viewer'
      };

      authLogger.success('Perfil cargado exitosamente', { profile: profileData });
      setProfile(profileData);
    } catch (error) {
      authLogger.error('Error inesperado al obtener perfil', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      authLogger.info('Iniciando proceso de login', { email });
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        authLogger.error('Error en autenticación', error);
        toast({
          title: "Error de autenticación",
          description: error.message,
          variant: "destructive",
        });
      } else {
        authLogger.success('Login exitoso', { email });
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al sistema SADE",
        });
      }

      return { error };
    } catch (error) {
      authLogger.error('Error inesperado en signIn', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      authLogger.info('Iniciando proceso de registro', { email, fullName });
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        authLogger.error('Error en registro', error);
        toast({
          title: "Error en el registro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        authLogger.success('Registro exitoso', { email });
        toast({
          title: "Registro exitoso",
          description: "Revisa tu email para confirmar tu cuenta",
        });
      }

      return { error };
    } catch (error) {
      authLogger.error('Error inesperado en signUp', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      authLogger.info('Iniciando proceso de logout');
      
      // Limpiar modo demo si está activo
      if (isDemoMode) {
        disableDemoMode();
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        authLogger.error('Error al cerrar sesión', error);
        toast({
          title: "Error al cerrar sesión",
          description: error.message,
          variant: "destructive",
        });
      } else {
        authLogger.success('Logout exitoso');
        toast({
          title: "Sesión cerrada",
          description: "Has cerrado sesión exitosamente",
        });
      }
    } catch (error) {
      authLogger.error('Error inesperado en signOut', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user && !isDemoMode) {
      authLogger.warn('Intento de actualizar perfil sin usuario logueado');
      return { error: new Error('No user logged in') };
    }

    try {
      authLogger.info('Actualizando perfil', { updates });
      
      if (isDemoMode) {
        // En modo demo, solo simular la actualización
        const currentDemoUser = JSON.parse(sessionStorage.getItem('demo_user') || '{}');
        const updatedDemoUser = { ...currentDemoUser, ...updates };
        sessionStorage.setItem('demo_user', JSON.stringify(updatedDemoUser));
        setProfile(updatedDemoUser as Profile);
        
        toast({
          title: "Perfil actualizado (Demo)",
          description: "Los cambios se han guardado en modo demostración",
        });
        
        return { error: null };
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user!.id);

      if (error) {
        authLogger.error('Error al actualizar perfil', error);
        toast({
          title: "Error al actualizar perfil",
          description: error.message,
          variant: "destructive",
        });
      } else {
        authLogger.success('Perfil actualizado exitosamente');
        toast({
          title: "Perfil actualizado",
          description: "Los cambios se han guardado exitosamente",
        });
        // Refresh profile
        fetchProfile(user!.id);
      }

      return { error };
    } catch (error) {
      authLogger.error('Error inesperado al actualizar perfil', error);
      return { error };
    }
  };

  const enableDemoMode = () => {
    authLogger.info('Activando modo demo');
    setIsDemoMode(true);
    
    const demoUser = {
      id: 'demo-user-id',
      email: 'demo@sade.com',
      full_name: 'Usuario Demo SADE',
      role: 'viewer' as const,
      department: 'Demostración',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setProfile(demoUser);
    setLoading(false);
    sessionStorage.setItem('demo_mode', 'true');
    sessionStorage.setItem('demo_user', JSON.stringify(demoUser));
  };

  const disableDemoMode = () => {
    authLogger.info('Desactivando modo demo');
    setIsDemoMode(false);
    setProfile(null);
    sessionStorage.removeItem('demo_mode');
    sessionStorage.removeItem('demo_user');
  };

  const value = {
    user,
    session,
    profile,
    loading,
    isDemoMode,
    signIn,
    signUp,
    signOut,
    updateProfile,
    enableDemoMode,
    disableDemoMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
