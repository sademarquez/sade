
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Shield, ShoppingCart, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CameraPermissionScreenProps {
  onPermissionGranted: () => void;
}

const CameraPermissionScreen: React.FC<CameraPermissionScreenProps> = ({ onPermissionGranted }) => {
  const [permissionState, setPermissionState] = useState<'requesting' | 'granted' | 'denied'>('requesting');
  const [countdown, setCountdown] = useState(60); // Changed to 60 seconds (1 minute)
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedGestures, setDetectedGestures] = useState<string[]>([]);
  const [vectorLines, setVectorLines] = useState<Array<{id: number, x1: number, y1: number, x2: number, y2: number, opacity: number}>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (permissionState === 'granted' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      navigate('/auth');
    }
  }, [countdown, permissionState, navigate]);

  // Generate dynamic vector lines
  useEffect(() => {
    if (permissionState === 'granted') {
      const interval = setInterval(() => {
        setVectorLines(prev => {
          const newLines = [...prev];
          
          // Add new lines
          if (Math.random() > 0.3) {
            const newLine = {
              id: Date.now() + Math.random(),
              x1: Math.random() * window.innerWidth,
              y1: Math.random() * window.innerHeight,
              x2: Math.random() * window.innerWidth,
              y2: Math.random() * window.innerHeight,
              opacity: 0.8
            };
            newLines.push(newLine);
          }
          
          // Update existing lines and remove old ones
          return newLines
            .map(line => ({ ...line, opacity: line.opacity - 0.02 }))
            .filter(line => line.opacity > 0)
            .slice(-20); // Keep only last 20 lines
        });
      }, 150);
      
      return () => clearInterval(interval);
    }
  }, [permissionState]);

  // Simulated gesture detection with more variety
  useEffect(() => {
    if (permissionState === 'granted' && isDetecting) {
      const gestures = [
        '👋 Saludo detectado',
        '👍 Pulgar arriba',
        '✋ Mano abierta',
        '👌 OK detectado',
        '✌️ Paz detectado',
        '👊 Puño cerrado',
        '🤟 Rock detectado',
        '🖖 Saludo vulcano'
      ];
      const interval = setInterval(() => {
        const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
        setDetectedGestures(prev => [...prev.slice(-3), randomGesture]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [permissionState, isDetecting]);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setPermissionState('granted');
      setIsDetecting(true);
      onPermissionGranted();
    } catch (error) {
      console.error('Error accessing camera:', error);
      setPermissionState('denied');
    }
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  const handlePurchase = () => {
    window.open('https://lovable.dev', '_blank');
  };

  if (permissionState === 'requesting') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative">
        {/* Logo flotante */}
        <div className="absolute top-6 left-6 flex items-center space-x-2 z-10">
          <Shield className="h-8 w-8 text-blue-400" />
          <span className="text-white font-bold text-xl">SADE</span>
        </div>

        {/* Botones flotantes */}
        <div className="absolute top-6 right-6 flex space-x-3 z-10">
          <Button
            onClick={handleLogin}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Login
          </Button>
          <Button
            onClick={handlePurchase}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Comprar
          </Button>
        </div>

        {/* Contenido principal */}
        <div className="text-center text-white">
          <Camera className="h-24 w-24 mx-auto mb-6 text-blue-400" />
          <h1 className="text-3xl font-bold mb-4">SADE - Sistema de Vigilancia Inteligente</h1>
          <p className="text-lg mb-8 text-gray-300">
            Para comenzar, necesitamos acceso a tu cámara para la demostración
          </p>
          <Button
            onClick={requestCameraPermission}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Camera className="h-5 w-5 mr-2" />
            Permitir Acceso a Cámara
          </Button>
        </div>
      </div>
    );
  }

  if (permissionState === 'denied') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative">
        {/* Logo flotante */}
        <div className="absolute top-6 left-6 flex items-center space-x-2 z-10">
          <Shield className="h-8 w-8 text-blue-400" />
          <span className="text-white font-bold text-xl">SADE</span>
        </div>

        {/* Botones flotantes */}
        <div className="absolute top-6 right-6 flex space-x-3 z-10">
          <Button
            onClick={handleLogin}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Login
          </Button>
          <Button
            onClick={handlePurchase}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Comprar
          </Button>
        </div>

        <div className="text-center text-white">
          <div className="text-red-400 mb-6">
            <Camera className="h-24 w-24 mx-auto mb-4" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Acceso a Cámara Denegado</h2>
          <p className="text-gray-300 mb-6">
            No se pudo acceder a la cámara. Puedes continuar al login o intentar nuevamente.
          </p>
          <div className="space-x-4">
            <Button
              onClick={requestCameraPermission}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Intentar Nuevamente
            </Button>
            <Button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Ir al Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Logo flotante */}
      <div className="absolute top-6 left-6 flex items-center space-x-2 z-20">
        <Shield className="h-8 w-8 text-blue-400" />
        <span className="text-white font-bold text-xl">SADE</span>
      </div>

      {/* Botones flotantes */}
      <div className="absolute top-6 right-6 flex space-x-3 z-20">
        <Button
          onClick={handleLogin}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          Login
        </Button>
        <Button
          onClick={handlePurchase}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Comprar
        </Button>
      </div>

      {/* Countdown timer */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center space-x-2 text-white border border-blue-400/30">
          <Timer className="h-4 w-4 text-blue-400" />
          <span>Experiencia inmersiva: {countdown}s</span>
        </div>
      </div>

      {/* Video stream - Full screen and fully revealed */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />

      {/* SVG Overlay for vector lines */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        {vectorLines.map(line => (
          <line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#00ffff"
            strokeWidth="2"
            opacity={line.opacity}
            className="animate-pulse"
          />
        ))}
        
        {/* Static grid lines for tech aesthetic */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#00ffff" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Corner brackets for futuristic look */}
        <g stroke="#00ffff" strokeWidth="3" fill="none" opacity="0.7">
          <path d="M 50 50 L 50 20 L 80 20" />
          <path d="M 50 50 L 20 50 L 20 20" />
          <path d="M calc(100% - 50px) 50 L calc(100% - 50px) 20 L calc(100% - 80px) 20" />
          <path d="M calc(100% - 50px) calc(100% - 50px) L calc(100% - 20px) calc(100% - 50px) L calc(100% - 20px) calc(100% - 20px)" />
        </g>
      </svg>

      {/* Overlay con detecciones y efectos */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 z-15">
        {/* Panel de detecciones mejorado */}
        <div className="bg-black/80 backdrop-blur-md rounded-lg p-4 mb-4 text-white border border-cyan-400/30 shadow-2xl shadow-cyan-400/20">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Camera className="h-5 w-5 mr-2 text-cyan-400" />
            Sistema de Análisis Avanzado Activo
          </h3>
          
          {isDetecting && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">IA de detección neural activa</span>
                <div className="flex space-x-1 ml-auto">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping animation-delay-200"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-400"></div>
                </div>
              </div>
              
              {/* Enhanced detection display */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-cyan-900/50 rounded p-2">
                  <div className="text-cyan-300">Precisión</div>
                  <div className="text-white font-bold">94.7%</div>
                </div>
                <div className="bg-blue-900/50 rounded p-2">
                  <div className="text-blue-300">FPS</div>
                  <div className="text-white font-bold">30.0</div>
                </div>
              </div>
              
              {detectedGestures.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-cyan-300 font-semibold">Patrones Detectados:</p>
                  {detectedGestures.map((gesture, index) => (
                    <div key={index} className="text-sm bg-gradient-to-r from-cyan-600/40 to-blue-600/40 rounded-lg px-3 py-2 border border-cyan-400/30 animate-fade-in">
                      {gesture}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Información del sistema mejorada */}
        <div className="text-center text-white">
          <p className="text-sm text-cyan-300 mb-2 font-semibold">
            Sistema Avanzado de Detección y Análisis Neural
          </p>
          <p className="text-xs text-gray-400">
            Desarrollado por Daniel Felipe López • Tecnología de Vanguardia
          </p>
        </div>
      </div>

      {/* Enhanced detection squares with more dynamic movement */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-cyan-400 rounded-lg animate-pulse z-10">
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
      </div>
      
      <div className="absolute top-1/2 right-1/3 w-24 h-24 border-2 border-green-400 rounded-lg animate-pulse animation-delay-300 z-10">
        <div className="absolute inset-2 border border-green-400 rounded opacity-50"></div>
      </div>
      
      <div className="absolute bottom-1/3 left-1/3 w-20 h-20 border-2 border-purple-400 rounded-lg animate-pulse animation-delay-500 z-10">
        <div className="absolute inset-1 border border-purple-400 rounded opacity-30"></div>
      </div>

      {/* Scanning line effect */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70 animate-bounce" 
             style={{top: '30%', animationDuration: '3s'}}></div>
      </div>
    </div>
  );
};

export default CameraPermissionScreen;
