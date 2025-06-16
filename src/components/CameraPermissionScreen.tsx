
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Shield, ShoppingCart, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CameraPermissionScreenProps {
  onPermissionGranted: () => void;
}

const CameraPermissionScreen: React.FC<CameraPermissionScreenProps> = ({ onPermissionGranted }) => {
  const [permissionState, setPermissionState] = useState<'requesting' | 'granted' | 'denied'>('requesting');
  const [countdown, setCountdown] = useState(10);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedGestures, setDetectedGestures] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
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

  // Simulated gesture detection
  useEffect(() => {
    if (permissionState === 'granted' && isDetecting) {
      const gestures = ['👋 Saludo detectado', '👍 Pulgar arriba', '✋ Mano abierta', '👌 OK detectado'];
      const interval = setInterval(() => {
        const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
        setDetectedGestures(prev => [...prev.slice(-2), randomGesture]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [permissionState, isDetecting]);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
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

      {/* Countdown timer */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center space-x-2 text-white">
          <Timer className="h-4 w-4 text-blue-400" />
          <span>Redirigiendo en {countdown}s</span>
        </div>
      </div>

      {/* Video stream */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />

      {/* Overlay con detecciones */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/50 to-transparent">
        {/* Panel de detecciones */}
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 mb-4 text-white">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Camera className="h-5 w-5 mr-2 text-blue-400" />
            Detección de Gestos y Movimientos
          </h3>
          
          {isDetecting && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Sistema de detección activo</span>
              </div>
              
              {detectedGestures.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm text-gray-300">Gestos detectados:</p>
                  {detectedGestures.map((gesture, index) => (
                    <div key={index} className="text-sm bg-blue-600/30 rounded px-2 py-1">
                      {gesture}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Información del sistema */}
        <div className="text-center text-white">
          <p className="text-sm text-gray-300 mb-2">
            Sistema Avanzado de Detección y Análisis
          </p>
          <p className="text-xs text-gray-400">
            Desarrollado por Daniel Felipe López
          </p>
        </div>
      </div>

      {/* Cuadros de detección simulados */}
      <div className="absolute top-1/3 left-1/4 w-24 h-24 border-2 border-blue-400 rounded animate-pulse"></div>
      <div className="absolute top-1/2 right-1/3 w-16 h-16 border-2 border-green-400 rounded animate-pulse"></div>
    </div>
  );
};

export default CameraPermissionScreen;
