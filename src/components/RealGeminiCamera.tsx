
import React, { useRef, useEffect, useState } from 'react';
import { useRealGeminiDetection } from '@/hooks/useRealGeminiDetection';
import GeminiDetectionOverlay from './GeminiDetectionOverlay';
import { Camera, Wifi, Brain, Zap, Shield, Activity, AlertCircle, CheckCircle } from 'lucide-react';

const RealGeminiCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { detections, isLoading, error: detectionError, frameCount, connectionStatus, geminiStats } = useRealGeminiDetection(
    videoRef.current
  );

  // Inicializar cámara
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        console.log('🎥 Inicializando cámara para Gemini AI REAL...');
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 },
            facingMode: 'user',
            frameRate: { ideal: 30, max: 60 }
          },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
          setStream(mediaStream);
          setIsStreamActive(true);
          console.log('✅ Cámara HD inicializada para Gemini REAL');
        }
      } catch (err) {
        console.error('❌ Error al acceder a la cámara:', err);
        setError('No se pudo acceder a la cámara del dispositivo');
      }
    };

    initializeCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Wifi className="h-4 w-4 text-yellow-400 animate-spin" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'CONECTADO';
      case 'error':
        return 'ERROR API';
      default:
        return 'PROBANDO...';
    }
  };

  if (error) {
    return (
      <div className="relative bg-slate-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
        <div className="text-center text-white p-4">
          <Camera className="h-12 w-12 mx-auto mb-2 text-red-400" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden aspect-video shadow-2xl">
      {/* Video stream principal */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />

      {/* Overlay de estado superior con conexión */}
      <div className="absolute top-2 left-2 flex items-center space-x-3 bg-black/90 backdrop-blur-sm rounded-lg px-4 py-2 z-20 border border-green-500/50">
        <div className={`w-3 h-3 rounded-full ${isStreamActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
        <span className="text-white text-sm font-bold">
          Gemini AI REAL
        </span>
        {getConnectionIcon()}
        <span className={`text-xs font-bold ${
          connectionStatus === 'connected' ? 'text-green-400' : 
          connectionStatus === 'error' ? 'text-red-400' : 'text-yellow-400'
        }`}>
          {getConnectionText()}
        </span>
      </div>

      {/* Estado de análisis con stats */}
      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded px-3 py-1 z-20">
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-yellow-400 text-xs">Analizando...</span>
            </>
          ) : (
            <>
              <Brain className="w-3 h-3 text-green-400 animate-pulse" />
              <span className="text-green-400 text-xs">IA Activa</span>
            </>
          )}
        </div>
        {geminiStats && (
          <div className="text-xs text-gray-400 mt-1">
            Requests: {geminiStats.requestCount}
          </div>
        )}
      </div>

      {/* Contador de detecciones reales */}
      <div className="absolute bottom-2 left-2 flex items-center space-x-2 bg-purple-900/90 backdrop-blur-sm rounded px-3 py-1 z-20">
        <Shield className="h-3 w-3 text-purple-400" />
        <span className="text-white text-xs font-mono">
          Detecciones: {detections.length}
        </span>
        {detections.some(d => d.priority === 'critical') && (
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </div>

      {/* Indicador de procesamiento real con status */}
      <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm rounded px-2 py-1 z-20">
        <span className="text-cyan-400 text-xs font-mono">
          Frame: {frameCount} • {connectionStatus === 'connected' ? '🟢 LIVE' : '🔴 OFF'}
        </span>
      </div>

      {/* Overlay de detecciones Gemini REAL */}
      <GeminiDetectionOverlay 
        detections={detections}
        isLoading={isLoading}
        error={detectionError}
        frameCount={frameCount}
      />

      {/* Grid neural animado solo cuando está conectado */}
      {connectionStatus === 'connected' && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full">
            <defs>
              <pattern id="real-neural-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#10b981" strokeWidth="0.5" opacity="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#real-neural-grid)" />
            
            <g stroke="#10b981" strokeWidth="2" fill="none" opacity="0.8">
              <path d="M 20 20 L 20 10 L 30 10" />
              <path d="M calc(100% - 20px) 20 L calc(100% - 20px) 10 L calc(100% - 30px) 10" />
              <path d="M 20 calc(100% - 20px) L 20 calc(100% - 10px) L 30 calc(100% - 10px)" />
              <path d="M calc(100% - 20px) calc(100% - 20px) L calc(100% - 20px) calc(100% - 10px) L calc(100% - 30px) calc(100% - 10px)" />
            </g>
          </svg>
        </div>
      )}

      {/* Líneas de escaneo cuando está analizando */}
      {isLoading && connectionStatus === 'connected' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-70 animate-pulse" 
               style={{top: '40%', animationDuration: '2s'}}></div>
          <div className="absolute w-0.5 h-full bg-gradient-to-b from-transparent via-green-400 to-transparent opacity-70 animate-pulse" 
               style={{left: '60%', animationDuration: '3s', animationDelay: '0.5s'}}></div>
        </div>
      )}
    </div>
  );
};

export default RealGeminiCamera;
