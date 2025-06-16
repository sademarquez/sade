
import { useEffect, useRef, useState, useCallback } from 'react';
import { geminiService, RealDetection } from '@/services/geminiAI';

export const useRealGeminiDetection = (videoElement: HTMLVideoElement | null) => {
  const [detections, setDetections] = useState<RealDetection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameCountRef = useRef(0);
  const lastAnalysisRef = useRef(0);

  // Probar conexión inicial
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔍 Probando conexión inicial con Gemini...');
        const isConnected = await geminiService.testConnection();
        setConnectionStatus(isConnected ? 'connected' : 'error');
        console.log(`🎯 Estado de conexión: ${isConnected ? 'CONECTADO' : 'ERROR'}`);
      } catch (error) {
        console.error('❌ Error en test de conexión:', error);
        setConnectionStatus('error');
      }
    };

    testConnection();
  }, []);

  // Procesar frame con Gemini AI real
  const processFrameWithGemini = useCallback(async () => {
    if (!videoElement || videoElement.videoWidth === 0 || connectionStatus !== 'connected') {
      return;
    }

    const now = Date.now();
    // Analizar cada 3 segundos para evitar exceso de llamadas
    if (now - lastAnalysisRef.current < 3000) return;
    
    try {
      // Crear canvas para captura
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Optimizar resolución para análisis
      canvas.width = 640;
      canvas.height = 480;
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Convertir a base64 para Gemini
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      console.log('🎥 Capturando frame para análisis Gemini...');
      setIsLoading(true);
      
      // Realizar análisis con Gemini AI REAL
      const realDetections = await geminiService.analyzeFrame(imageData);
      
      if (realDetections.length > 0) {
        console.log('🎯 ¡DETECCIONES REALES!', realDetections.map(d => `${d.type}: ${d.label} (${(d.confidence * 100).toFixed(1)}%)`));
        setDetections(prev => {
          const updated = [...realDetections, ...prev];
          return updated.slice(0, 12); // Mantener últimas 12 detecciones
        });
      } else {
        console.log('👀 Gemini analizó pero no encontró objetos específicos');
      }

      lastAnalysisRef.current = now;
      setError(null);
      
    } catch (err) {
      console.error('❌ Error en análisis Gemini real:', err);
      setError(err instanceof Error ? err.message : 'Error en Gemini AI');
    } finally {
      setIsLoading(false);
    }
  }, [videoElement, connectionStatus]);

  // Inicializar detección real
  useEffect(() => {
    if (videoElement && videoElement.videoWidth > 0 && connectionStatus === 'connected') {
      console.log('🚀 INICIANDO GEMINI AI REAL DETECTION...');
      setIsLoading(false);
      setError(null);
      
      // Procesar frames cada 1 segundo
      intervalRef.current = setInterval(() => {
        frameCountRef.current++;
        processFrameWithGemini();
      }, 1000);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [videoElement, processFrameWithGemini, connectionStatus]);

  // Limpiar detecciones antiguas
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setDetections(prev => 
        prev.filter(detection => now - detection.timestamp < 45000) // 45 segundos
      );
    }, 10000);

    return () => clearInterval(cleanupInterval);
  }, []);

  return {
    detections,
    isLoading,
    error,
    connectionStatus,
    frameCount: frameCountRef.current,
    isRealGemini: true,
    geminiStats: geminiService.getStats()
  };
};
