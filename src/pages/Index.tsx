
import React from 'react';
import Header from '@/components/Header';
import CameraGrid from '@/components/CameraGrid';
import ControlPanel from '@/components/ControlPanel';

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
              Vista en Tiempo Real - 10 Cámaras Wi-Fi
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Sistema de Vigilancia Inteligente con Detección de Objetos IA
            </p>
          </div>
          <CameraGrid />
        </div>
      </main>

      {/* Footer con Copyright */}
      <footer className="bg-slate-900 text-white py-6 mt-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <p className="font-semibold">SADE - Sistema Avanzado de Detección y Análisis</p>
              <p className="text-sm text-slate-400 mt-1">
                Desarrollo de un Sistema de Vigilancia Inteligente Avanzado con Detección de Objetos
              </p>
            </div>
            <div className="text-center md:text-right mt-4 md:mt-0">
              <p className="text-sm text-slate-300">
                © 2024 Daniel Felipe López
              </p>
              <p className="text-xs text-slate-500">
                Identidad de código y marca registrada
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
