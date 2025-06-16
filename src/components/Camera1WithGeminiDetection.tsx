
import React, { useRef, useEffect, useState } from 'react';
import { useGeminiDetection } from '@/hooks/useGeminiDetection';
import GeminiDetectionOverlay from './GeminiDetectionOverlay';
import { Camera, Wifi, Brain, Zap } from 'lucide-react';

const Camera1WithGeminiDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { detections, isLoading, error: detectionError, frameCount } = useGeminiDetection(
    videoRef.current
  );

  // Inicializar cámara con configuración optimizada para IA
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        console.log('🎥 Inicializando cámara para Gemini AI...');
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
          console.log('✅ Cámara HD inicializada para análisis Gemini');
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

      {/* Overlay de estado superior */}
      <div className="absolute top-2 left-2 flex items-center space-x-3 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 z-20">
        <div className={`w-3 h-3 rounded-full ${isStreamActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
        <span className="text-white text-sm font-semibold">
          Cámara Gemini AI
        </span>
        <Wifi className="h-4 w-4 text-blue-400" />
        <Brain className="h-4 w-4 text-purple-400 animate-pulse" />
      </div>

      {/* Contador de frames */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 z-20">
        <span className="text-white text-xs font-mono">
          Frame: {frameCount} | FPS: {Math.round(frameCount / Math.max(1, Date.now() / 1000 - performance.now() / 1000))}
        </span>
      </div>

      {/* Indicador de procesamiento activo */}
      <div className="absolute bottom-2 left-2 flex items-center space-x-2 bg-purple-900/80 backdrop-blur-sm rounded px-3 py-1 z-20">
        <Zap className="h-3 w-3 text-yellow-400 animate-pulse" />
        <span className="text-white text-xs">
          Procesando: {detections.length} vectores
        </span>
      </div>

      {/* Overlay de detecciones Gemini */}
      <GeminiDetectionOverlay 
        detections={detections}
        isLoading={isLoading}
        error={detectionError}
        frameCount={frameCount}
      />

      {/* Grid de análisis neural visual */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="w-full h-full">
          <defs>
            <pattern id="neural-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
            <linearGradient id="scan-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent"/>
              <stop offset="50%" stopColor="#8b5cf6"/>
              <stop offset="100%" stopColor="transparent"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
          
          {/* Esquinas de enfoque neural */}
          <g stroke="#8b5cf6" strokeWidth="3" fill="none" opacity="0.8">
            <path d="M 30 30 L 30 10 L 50 10" />
            <path d="M calc(100% - 30px) 30 L calc(100% - 30px) 10 L calc(100% - 50px) 10" />
            <path d="M 30 calc(100% - 30px) L 30 calc(100% - 10px) L 50 calc(100% - 10px)" />
            <path d="M calc(100% - 30px) calc(100% - 30px) L calc(100% - 30px) calc(100% - 10px) L calc(100% - 50px) calc(100% - 10px)" />
          </g>
        </svg>
      </div>

      {/* Líneas de escaneo neural */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-60 animate-pulse" 
             style={{top: '33%', animationDuration: '3s'}}></div>
        <div className="absolute w-1 h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-60 animate-pulse" 
             style={{left: '66%', animationDuration: '4s', animationDelay: '1s'}}></div>
      </div>
    </div>
  );
};

export default Camera1WithGeminiDetection;
