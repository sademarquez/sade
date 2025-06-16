
import React, { useRef, useEffect, useState } from 'react';
import { useRealTimeDetection } from '@/hooks/useRealTimeDetection';
import RealTimeDetectionOverlay from './RealTimeDetectionOverlay';
import { Camera, Wifi } from 'lucide-react';

const Camera1WithRealDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { detections, isLoading, error: detectionError } = useRealTimeDetection(
    videoRef.current
  );

  // Inicializar cámara
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        console.log('📷 Inicializando cámara para detección en tiempo real...');
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640, max: 1280 },
            height: { ideal: 480, max: 720 },
            facingMode: 'user',
            frameRate: { ideal: 15, max: 30 } // Optimizado para procesamiento de IA
          },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
          setStream(mediaStream);
          setIsStreamActive(true);
          console.log('✅ Cámara inicializada correctamente');
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
    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
      {/* Video stream */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />

      {/* Overlay de estado */}
      <div className="absolute top-2 left-2 flex items-center space-x-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 z-10">
        <div className={`w-2 h-2 rounded-full ${isStreamActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
        <span className="text-white text-xs font-medium">
          Cámara 1 - IA Neural
        </span>
        <Wifi className="h-3 w-3 text-blue-400" />
      </div>

      {/* Overlay de detecciones */}
      <RealTimeDetectionOverlay 
        detections={detections}
        isLoading={isLoading}
        error={detectionError}
      />

      {/* Grid de detección visual */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <pattern id="detection-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#00ffff" strokeWidth="0.5" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#detection-grid)" />
          
          {/* Esquinas de enfoque */}
          <g stroke="#00ffff" strokeWidth="2" fill="none" opacity="0.6">
            <path d="M 20 20 L 20 5 L 35 5" />
            <path d="M calc(100% - 20px) 20 L calc(100% - 20px) 5 L calc(100% - 35px) 5" />
            <path d="M 20 calc(100% - 20px) L 20 calc(100% - 5px) L 35 calc(100% - 5px)" />
            <path d="M calc(100% - 20px) calc(100% - 20px) L calc(100% - 20px) calc(100% - 5px) L calc(100% - 35px) calc(100% - 5px)" />
          </g>
        </svg>
      </div>

      {/* Línea de escaneo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70 animate-pulse" 
             style={{top: '40%', animationDuration: '2s'}}></div>
      </div>
    </div>
  );
};

export default Camera1WithRealDetection;
