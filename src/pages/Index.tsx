
import React from 'react';
import Header from '@/components/Header';
import CameraGrid from '@/components/CameraGrid';
import ControlPanel from '@/components/ControlPanel';
import Camera1WithGeminiDetection from '@/components/Camera1WithGeminiDetection';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header con branding SADE */}
      <Header />
      
      {/* Main Content */}
      <main className="container mx-auto">
        {/* Panel de Control */}
        <ControlPanel />
        
        {/* Grid de Cámaras con Gemini AI */}
        <div className="bg-white shadow-xl rounded-lg mx-6 mb-6 border border-purple-200">
          <div className="p-6 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="w-3 h-3 bg-purple-500 rounded-full mr-3 animate-pulse"></span>
              Sistema Gemini AI Neural - Detección Vectorial Avanzada
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              🧠 Cámara 1: Análisis en tiempo real con vectores de detección visibles | 
              🎯 Detección de gestos, objetos, emociones y posturas | 
              ⚡ Procesamiento neuronal continuo
            </p>
          </div>
          
          {/* Contenedor para Cámara Gemini AI */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Cámara 1 con Gemini AI */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
                  Cámara 1 - Gemini AI Neural Engine
                  <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    VECTORIAL
                  </span>
                </h3>
                <Camera1WithGeminiDetection />
                
                {/* Panel de información técnica */}
                <div className="bg-purple-50 rounded-lg p-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-purple-700">
                    <div>🔮 Análisis Multimodal</div>
                    <div>📊 Vectores en Tiempo Real</div>
                    <div>🎭 Detección Emocional</div>
                    <div>🤖 Red Neural Activa</div>
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
      <footer className="bg-gradient-to-r from-slate-900 to-purple-900 text-white py-6 mt-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <p className="font-bold text-lg">SADE - Sistema Avanzado de Detección y Análisis</p>
              <p className="text-sm text-purple-200 mt-1">
                🧠 Integración Gemini AI Neural • 🎯 Vectores de Detección • ⚡ Análisis en Tiempo Real
              </p>
            </div>
            <div className="text-center md:text-right mt-4 md:mt-0">
              <p className="text-sm text-purple-100">
                © 2024 Daniel Felipe López
              </p>
              <p className="text-xs text-purple-300">
                IA Neural • Gemini Integration • Vectorial Detection
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
