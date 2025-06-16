
import React from 'react';
import Header from '@/components/Header';
import CameraGrid from '@/components/CameraGrid';
import ControlPanel from '@/components/ControlPanel';
import Camera1WithRealDetection from '@/components/Camera1WithRealDetection';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header con branding SADE */}
      <Header />
      
      {/* Main Content */}
      <main className="container mx-auto">
        {/* Panel de Control */}
        <ControlPanel />
        
        {/* Grid de Cámaras */}
        <div className="bg-white shadow-lg rounded-lg mx-6 mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Vista en Tiempo Real - Sistema de IA Neural Activo
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Cámara 1: Detección avanzada de gestos, movimientos y objetos de riesgo con IA
            </p>
          </div>
          
          {/* Contenedor especial para Cámara 1 con IA */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Cámara 1 con detección real */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Cámara 1 - IA Neural Activa
                </h3>
                <Camera1WithRealDetection />
              </div>
              
              {/* Cámaras simuladas restantes */}
              <div className="lg:col-span-1 xl:col-span-2">
                <CameraGrid />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer con Copyright */}
      <footer className="bg-slate-900 text-white py-6 mt-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <p className="font-semibold">SADE - Sistema Avanzado de Detección y Análisis</p>
              <p className="text-sm text-slate-400 mt-1">
                Desarrollo de un Sistema de Vigilancia Inteligente Avanzado con Detección Neural de IA
              </p>
            </div>
            <div className="text-center md:text-right mt-4 md:mt-0">
              <p className="text-sm text-slate-300">
                © 2024 Daniel Felipe López
              </p>
              <p className="text-xs text-slate-500">
                Identidad de código y marca registrada • IA Neural Integrada
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
