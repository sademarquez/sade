
import React from 'react';
import { Shield, Activity, Wifi } from 'lucide-react';
import UserProfile from './UserProfile';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { profile } = useAuth();

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-10 w-10 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  SADE
                </h1>
                <p className="text-sm text-slate-300">
                  Sistema Avanzado de Detección y Análisis
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-green-400">
              <Activity className="h-5 w-5" />
              <span className="text-sm font-medium">Sistema Activo</span>
            </div>
            
            <div className="flex items-center space-x-2 text-blue-400">
              <Wifi className="h-5 w-5" />
              <span className="text-sm font-medium">10 Cámaras</span>
            </div>

            {profile && (
              <div className="text-xs text-slate-400 text-right">
                <p>Usuario: {profile.full_name}</p>
                <p>Rol: {profile.role}</p>
              </div>
            )}
            
            <UserProfile />
            
            <div className="text-right">
              <p className="text-xs text-slate-400">
                © 2024 Daniel Felipe López
              </p>
              <p className="text-xs text-slate-500">
                SADE System - Todos los derechos reservados
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
