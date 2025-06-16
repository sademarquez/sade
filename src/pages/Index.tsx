import React from 'react';
import Header from '@/components/Header';
import CameraGrid from '@/components/CameraGrid';
import ControlPanel from '@/components/ControlPanel';
import RealGeminiCamera from '@/components/RealGeminiCamera';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header con branding SADE */}
      <Header />
      
      {/* Main Content */}
      <main className="container mx-auto">
        {/* Panel de Control */}
        <ControlPanel />
        
        {/* Grid de Cámaras con Gemini AI REAL */}
        <div className="bg-white shadow-xl rounded-lg mx-6 mb-6 border border-green-200">
          <div className="p-6 border-b border-green-100 bg-gradient-to-r from-green-50 to-cyan-50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
              Sistema Gemini AI REAL - Detección Neural en Tiempo Real
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              🧠 Cámara 1: Gemini AI REAL con API conectada | 
              🎯 Detección genuina de gestos, objetos, emociones | 
              ⚡ Procesamiento neural Google Gemini 1.5
            </p>
          </div>
          
          {/* Contenedor para Cámara Gemini AI REAL */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Cámara 1 con Gemini AI REAL */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Cámara 1 - Gemini AI REAL Engine
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                    REAL API
                  </span>
                </h3>
                <RealGeminiCamera />
                
                {/* Panel de información técnica REAL */}
                <div className="bg-green-50 rounded-lg p-3 text-xs border border-green-200">
                  <div className="grid grid-cols-2 gap-2 text-green-700">
                    <div>🤖 Google Gemini 1.5</div>
                    <div>📊 API Conectada</div>
                    <div>🎭 Emociones Reales</div>
                    <div>⚡ Análisis Genuino</div>
                  </div>
                </div>
              </div>
              
              {/* Cámaras simuladas restantes */}
              <div className="lg:col-span-1 xl:col-span-2">
                <CameraGrid />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer mejorado */}
      <footer className="bg-gradient-to-r from-slate-900 to-green-900 text-white py-6 mt-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <p className="font-bold text-lg">SADE - Sistema con Gemini AI REAL</p>
              <p className="text-sm text-green-200 mt-1">
                🧠 Google Gemini API • 🎯 Detección Real • ⚡ Análisis Genuino
              </p>
            </div>
            <div className="text-center md:text-right mt-4 md:mt-0">
              <p className="text-sm text-green-100">
                © 2024 Daniel Felipe López
              </p>
              <p className="text-xs text-green-300">
                Real AI • Gemini Integration • Live Detection
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
