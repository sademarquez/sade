
import { useEffect, useRef, useState, useCallback } from 'react';
import { geminiService, RealDetection } from '@/services/geminiAI';

export const useRealGeminiDetection = (videoElement: HTMLVideoElement | null) => {
  const [detections, setDetections] = useState<RealDetection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameCountRef = useRef(0);
  const lastAnalysisRef = useRef(0);

  // Procesar frame con Gemini AI real
  const processFrameWithGemini = useCallback(async () => {
    if (!videoElement || videoElement.videoWidth === 0) return;

    const now = Date.now();
    // Analizar cada 2 segundos para evitar exceso de llamadas a la API
    if (now - lastAnalysisRef.current < 2000) return;
    
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
      
      console.log('🧠 Analizando frame con Gemini AI real...');
      setIsLoading(true);
      
      // Realizar análisis con Gemini AI
      const realDetections = await geminiService.analyzeFrame(imageData);
      
      if (realDetections.length > 0) {
        console.log('✅ Detecciones reales de Gemini:', realDetections);
        setDetections(prev => {
          // Combinar nuevas detecciones con las anteriores
          const updated = [...realDetections, ...prev];
          // Mantener solo las últimas 15 detecciones
          return updated.slice(0, 15);
        });
      }

      lastAnalysisRef.current = now;
      setError(null);
      
    } catch (err) {
      console.error('❌ Error en análisis Gemini real:', err);
      setError(err instanceof Error ? err.message : 'Error en Gemini AI');
    } finally {
      setIsLoading(false);
    }
  }, [videoElement]);

  // Inicializar detección real
  useEffect(() => {
    if (videoElement && videoElement.videoWidth > 0) {
      console.log('🚀 Iniciando Gemini AI REAL Detection...');
      setIsLoading(false);
      setError(null);
      
      // Procesar frames cada 500ms para análisis suave
      intervalRef.current = setInterval(() => {
        frameCountRef.current++;
        processFrameWithGemini();
      }, 500);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [videoElement, processFrameWithGemini]);

  // Limpiar detecciones antiguas (cada 30 segundos)
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setDetections(prev => 
        prev.filter(detection => now - detection.timestamp < 30000)
      );
    }, 5000);

    return () => clearInterval(cleanupInterval);
  }, []);

  return {
    detections,
    isLoading,
    error,
    frameCount: frameCountRef.current,
    isRealGemini: true // Indicador de que es Gemini real
  };
};
