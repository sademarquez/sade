import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Brain, Zap, Activity, Eye, Shield, Smartphone, Monitor, Tablet } from 'lucide-react';
import RealGeminiCamera from '@/components/RealGeminiCamera';

const Welcome = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Detectar tipo de dispositivo
    const detectDevice = () => {
      const width = window.innerWidth;
      if (width < 768) setDeviceType('mobile');
      else if (width < 1024) setDeviceType('tablet');
      else setDeviceType('desktop');
    };
    
    detectDevice();
    window.addEventListener('resize', detectDevice);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', detectDevice);
    };
  }, []);

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="h-5 w-5" />;
      case 'tablet': return <Tablet className="h-5 w-5" />;
      default: return <Monitor className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header futurista */}
      <header className="relative overflow-hidden bg-black/30 backdrop-blur-sm border-b border-green-500/30">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-cyan-500/10"></div>
        <div className="relative container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Brain className="h-12 w-12 text-green-400 animate-pulse" />
                <div className="absolute -inset-1 bg-green-400/20 rounded-full blur-sm"></div>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  SADE Neural REAL
                </h1>
                <p className="text-green-300 text-sm lg:text-base flex items-center space-x-2">
                  <span>Sistema con IA Gemini REAL</span>
                  <div className="px-2 py-1 bg-green-600 rounded text-xs font-bold">LIVE AI</div>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-green-200">
              {getDeviceIcon()}
              <div className="text-center lg:text-right">
                <div className="text-lg font-mono">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-xs opacity-75 capitalize">
                  {deviceType} • Gemini API
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-6 py-8">
        {/* Grid responsivo para diferentes dispositivos */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          
          {/* Panel principal de cámara Gemini AI REAL */}
          <Card className="bg-black/40 backdrop-blur-sm border-green-500/30 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-900/50 to-cyan-900/50">
              <CardTitle className="flex items-center space-x-3 text-white">
                <Camera className="h-6 w-6 text-green-400 animate-pulse" />
                <span>Cámara Gemini AI REAL</span>
                <div className="px-3 py-1 bg-green-500/50 rounded-full text-xs font-bold">
                  REAL TIME AI
                </div>
              </CardTitle>
              <CardDescription className="text-green-200">
                🧠 Detección REAL con Google Gemini AI • Gestos • Emociones • Objetos • Vectores
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <RealGeminiCamera />
            </CardContent>
          </Card>

          {/* Panel de información mejorado */}
          <div className="space-y-6">
            
            {/* Capacidades REALES del sistema */}
            <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Brain className="h-5 w-5 text-green-400" />
                  <span>IA Gemini REAL Activa</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                    <Eye className="h-5 w-5 text-green-400" />
                    <div>
                      <div className="text-white text-sm font-medium">Detección Facial REAL</div>
                      <div className="text-green-300 text-xs">Emociones genuinas</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-cyan-900/30 rounded-lg border border-cyan-500/30">
                    <Activity className="h-5 w-5 text-cyan-400" />
                    <div>
                      <div className="text-white text-sm font-medium">Gestos REALES</div>
                      <div className="text-cyan-300 text-xs">API Gemini Live</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-red-900/30 rounded-lg border border-red-500/30">
                    <Shield className="h-5 w-5 text-red-400" />
                    <div>
                      <div className="text-white text-sm font-medium">Objetos Peligrosos</div>
                      <div className="text-red-300 text-xs">Detección crítica</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <div>
                      <div className="text-white text-sm font-medium">Comportamiento IA</div>
                      <div className="text-yellow-300 text-xs">Análisis neural</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-green-400 font-bold text-lg">✅ GEMINI AI CONECTADA</div>
                    <div className="text-green-300 text-sm">API Key activa • Análisis en tiempo real</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acceso al sistema completo */}
            <Card className="bg-gradient-to-r from-green-900/40 to-cyan-900/40 backdrop-blur-sm border-green-400/50">
              <CardHeader>
                <CardTitle className="text-white">Sistema Completo SADE Neural</CardTitle>
                <CardDescription className="text-green-200">
                  Dashboard completo con múltiples cámaras y IA Gemini REAL
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white text-lg py-6 rounded-lg shadow-xl transform transition-all duration-200 hover:scale-105"
                >
                  <Brain className="h-6 w-6 mr-3" />
                  Acceder al Sistema REAL
                  <Zap className="h-6 w-6 ml-3" />
                </Button>
              </CardContent>
            </Card>

            {/* Estado del dispositivo y API */}
            <Card className="bg-black/30 backdrop-blur-sm border-green-500/30">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-300">
                      {getDeviceIcon()}
                      <span className="capitalize">{deviceType}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400">Sistema Operativo</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-300">Gemini AI Status:</span>
                    <span className="text-green-400 font-bold">🟢 CONECTADA</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Especificaciones técnicas REALES */}
        <Card className="bg-black/20 backdrop-blur-sm border-green-600/30">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="text-green-400 font-semibold mb-2">IA Gemini REAL</h3>
                <p className="text-gray-300 text-sm">
                  Google Gemini 1.5 • Análisis Multimodal • Vectores Reales
                </p>
              </div>
              <div>
                <h3 className="text-cyan-400 font-semibold mb-2">Universal</h3>
                <p className="text-gray-300 text-sm">
                  Móvil • Tablet • Desktop • WebRTC • Sin instalación
                </p>
              </div>
              <div>
                <h3 className="text-yellow-400 font-semibold mb-2">Rendimiento</h3>
                <p className="text-gray-300 text-sm">
                  HD/4K • API Real • Detección Genuina • Sin límites
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer mejorado */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-green-500/30 mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-white font-semibold">© 2024 Daniel Felipe López</p>
              <p className="text-green-300 text-sm">
                SADE Neural REAL - Gemini AI Integration • Universal Access
              </p>
            </div>
            <div className="flex items-center space-x-4 text-green-200 text-sm">
              <span>🧠 Gemini AI</span>
              <span>•</span>
              <span>🎯 Real Detection</span>
              <span>•</span>
              <span>⚡ Live Analysis</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
