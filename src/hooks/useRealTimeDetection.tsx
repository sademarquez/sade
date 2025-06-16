
import { useEffect, useRef, useState } from 'react';
import { pipeline, env } from '@huggingface/transformers';

// Configurar transformers.js para funcionar en navegador
env.allowLocalModels = false;
env.useBrowserCache = true;

interface DetectionResult {
  type: 'gesture' | 'weapon' | 'movement' | 'risk';
  label: string;
  confidence: number;
  timestamp: number;
  coordinates?: { x: number; y: number; width: number; height: number };
}

export const useRealTimeDetection = (videoElement: HTMLVideoElement | null) => {
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pipeline1, setPipeline1] = useState<any>(null);
  const [pipeline2, setPipeline2] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Inicializar modelos de AI
  useEffect(() => {
    const initializeModels = async () => {
      try {
        setIsLoading(true);
        console.log('🤖 Inicializando modelos de IA para detección...');
        
        // Modelo para detección de objetos (incluyendo armas)
        const objectDetector = await pipeline(
          'object-detection',
          'Xenova/detr-resnet-50',
          { device: 'webgpu' }
        );
        
        // Modelo para clasificación de imágenes (gestos y comportamientos)
        const imageClassifier = await pipeline(
          'image-classification',
          'Xenova/vit-base-patch16-224',
          { device: 'webgpu' }
        );
        
        setPipeline1(objectDetector);
        setPipeline2(imageClassifier);
        setIsLoading(false);
        console.log('✅ Modelos de IA inicializados correctamente');
      } catch (err) {
        console.error('❌ Error inicializando modelos:', err);
        setError('Error al cargar modelos de IA');
        setIsLoading(false);
      }
    };

    initializeModels();
  }, []);

  // Función para procesar frame de video
  const processFrame = async () => {
    if (!videoElement || !pipeline1 || !pipeline2) return;

    try {
      // Crear canvas para capturar frame
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Ajustar resolución para dispositivos con cámaras de baja calidad
      canvas.width = Math.min(videoElement.videoWidth, 640);
      canvas.height = Math.min(videoElement.videoHeight, 480);
      
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      // Convertir a base64 para los modelos
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Detección de objetos (armas, personas, etc.)
      const objectResults = await pipeline1(imageData);
      
      // Clasificación de gestos y comportamientos
      const classificationResults = await pipeline2(imageData);
      
      const newDetections: DetectionResult[] = [];
      const timestamp = Date.now();
      
      // Procesar resultados de detección de objetos
      if (objectResults && Array.isArray(objectResults)) {
        objectResults.forEach((result: any) => {
          const label = result.label.toLowerCase();
          let type: DetectionResult['type'] = 'movement';
          
          // Detectar armas y objetos peligrosos
          if (label.includes('knife') || label.includes('gun') || label.includes('weapon') || 
              label.includes('pistol') || label.includes('rifle') || label.includes('blade')) {
            type = 'weapon';
          } else if (label.includes('person')) {
            type = 'movement';
          }
          
          if (result.score > 0.3) { // Umbral de confianza ajustable
            newDetections.push({
              type,
              label: `${label} detectado`,
              confidence: result.score,
              timestamp,
              coordinates: result.box ? {
                x: result.box.xmin,
                y: result.box.ymin,
                width: result.box.xmax - result.box.xmin,
                height: result.box.ymax - result.box.ymin
              } : undefined
            });
          }
        });
      }
      
      // Procesar resultados de clasificación
      if (classificationResults && Array.isArray(classificationResults)) {
        classificationResults.slice(0, 3).forEach((result: any) => {
          const label = result.label.toLowerCase();
          let type: DetectionResult['type'] = 'gesture';
          
          // Analizar gestos y comportamientos
          if (label.includes('hand') || label.includes('wave') || label.includes('point')) {
            type = 'gesture';
          } else if (label.includes('fight') || label.includes('attack') || label.includes('aggressive')) {
            type = 'risk';
          }
          
          if (result.score > 0.2) {
            newDetections.push({
              type,
              label: `${label}`,
              confidence: result.score,
              timestamp
            });
          }
        });
      }
      
      // Actualizar detecciones
      if (newDetections.length > 0) {
        setDetections(prev => [...newDetections, ...prev.slice(0, 10)]); // Mantener últimas 10
      }
      
    } catch (err) {
      console.error('Error procesando frame:', err);
    }
  };

  // Iniciar/detener detección
  useEffect(() => {
    if (videoElement && pipeline1 && pipeline2 && !isLoading) {
      console.log('🎯 Iniciando detección en tiempo real...');
      intervalRef.current = setInterval(processFrame, 1000); // Cada segundo para optimizar rendimiento
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [videoElement, pipeline1, pipeline2, isLoading]);

  return {
    detections,
    isLoading,
    error,
    processFrame
  };
};
