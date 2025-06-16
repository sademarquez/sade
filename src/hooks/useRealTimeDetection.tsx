
import { useEffect, useRef, useState } from 'react';
import { pipeline, env } from '@huggingface/transformers';

// Configurar transformers.js para mejor rendimiento
env.allowLocalModels = false;
env.useBrowserCache = true;
env.backends.onnx.wasm.numThreads = 1;

interface DetectionResult {
  type: 'gesture' | 'weapon' | 'movement' | 'risk' | 'smoking' | 'drinking' | 'eating' | 'phone' | 'suspicious';
  label: string;
  confidence: number;
  timestamp: number;
  coordinates?: { x: number; y: number; width: number; height: number };
  details?: string;
}

export const useRealTimeDetection = (videoElement: HTMLVideoElement | null) => {
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [objectDetector, setObjectDetector] = useState<any>(null);
  const [poseDetector, setPoseDetector] = useState<any>(null);
  const [actionClassifier, setActionClassifier] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Inicializar modelos especializados
  useEffect(() => {
    const initializeModels = async () => {
      try {
        setIsLoading(true);
        console.log('🤖 Inicializando modelos avanzados de detección...');
        
        // Modelo para detección de objetos y acciones específicas
        console.log('📦 Cargando detector de objetos YOLO...');
        const objectPipeline = await pipeline(
          'object-detection',
          'Xenova/yolov9-c',
          { 
            device: 'webgpu',
            dtype: 'fp16'
          }
        );
        
        // Modelo para análisis de poses y gestos
        console.log('🤸 Cargando detector de poses...');
        const posePipeline = await pipeline(
          'image-classification',
          'Xenova/vit-base-patch16-224',
          { 
            device: 'webgpu',
            dtype: 'fp16'
          }
        );
        
        // Modelo especializado en detección de acciones humanas
        console.log('🎯 Cargando clasificador de acciones...');
        const actionPipeline = await pipeline(
          'image-classification',
          'Xenova/resnet-50',
          { 
            device: 'webgpu',
            dtype: 'fp16'
          }
        );
        
        setObjectDetector(objectPipeline);
        setPoseDetector(posePipeline);
        setActionClassifier(actionPipeline);
        setIsLoading(false);
        console.log('✅ Modelos avanzados inicializados correctamente');
      } catch (err) {
        console.error('❌ Error inicializando modelos:', err);
        // Fallback a modelos más ligeros si WebGPU falla
        try {
          console.log('🔄 Intentando con modelos CPU...');
          const simpleDetector = await pipeline(
            'object-detection',
            'Xenova/detr-resnet-50'
          );
          const simpleClassifier = await pipeline(
            'image-classification',
            'Xenova/vit-base-patch16-224'
          );
          
          setObjectDetector(simpleDetector);
          setActionClassifier(simpleClassifier);
          setIsLoading(false);
          console.log('✅ Modelos CPU inicializados como fallback');
        } catch (fallbackErr) {
          console.error('❌ Error en fallback:', fallbackErr);
          setError('Error al cargar modelos de IA. Verifique su conexión.');
          setIsLoading(false);
        }
      }
    };

    initializeModels();
  }, []);

  // Función mejorada para procesar frame con detecciones específicas
  const processAdvancedFrame = async () => {
    if (!videoElement || !objectDetector || !actionClassifier) return;

    try {
      // Crear canvas optimizado
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Optimizar resolución para mejor detección
      canvas.width = Math.min(videoElement.videoWidth, 512);
      canvas.height = Math.min(videoElement.videoHeight, 384);
      
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      // Convertir a datos de imagen
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      
      const newDetections: DetectionResult[] = [];
      const timestamp = Date.now();
      
      // Detección de objetos específicos (cigarrillos, tazas, teléfonos, armas)
      console.log('🔍 Analizando objetos...');
      const objectResults = await objectDetector(imageData, {
        threshold: 0.25,
        percentage: true
      });
      
      if (objectResults && Array.isArray(objectResults)) {
        objectResults.forEach((result: any) => {
          const label = result.label.toLowerCase();
          let type: DetectionResult['type'] = 'movement';
          let details = '';
          
          // Detección específica de cigarrillos y fumar
          if (label.includes('cigarette') || label.includes('smoking') || 
              label.includes('cigar') || label.includes('tobacco')) {
            type = 'smoking';
            details = 'Persona fumando detectada';
          }
          // Detección de bebidas (café, agua, etc)
          else if (label.includes('cup') || label.includes('mug') || 
                   label.includes('coffee') || label.includes('drink') ||
                   label.includes('bottle') || label.includes('glass')) {
            type = 'drinking';
            details = 'Persona bebiendo detectada';
          }
          // Detección de teléfonos
          else if (label.includes('phone') || label.includes('mobile') ||
                   label.includes('cell phone') || label.includes('smartphone')) {
            type = 'phone';
            details = 'Uso de teléfono detectado';
          }
          // Detección de armas
          else if (label.includes('knife') || label.includes('gun') || 
                   label.includes('weapon') || label.includes('pistol') || 
                   label.includes('rifle') || label.includes('blade')) {
            type = 'weapon';
            details = '⚠️ ARMA DETECTADA';
          }
          // Detección de comida
          else if (label.includes('food') || label.includes('eating') ||
                   label.includes('sandwich') || label.includes('apple') ||
                   label.includes('banana')) {
            type = 'eating';
            details = 'Persona comiendo detectada';
          }
          
          if (result.score > 0.3) {
            newDetections.push({
              type,
              label: `${label}`,
              confidence: result.score,
              timestamp,
              details,
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
      
      // Análisis de acciones y gestos usando clasificación
      console.log('🎭 Analizando gestos y acciones...');
      const actionResults = await actionClassifier(imageData, {
        top_k: 10
      });
      
      if (actionResults && Array.isArray(actionResults)) {
        actionResults.slice(0, 5).forEach((result: any) => {
          const label = result.label.toLowerCase();
          let type: DetectionResult['type'] = 'gesture';
          let details = '';
          
          // Análisis específico de gestos y comportamientos
          if (label.includes('smoking') || label.includes('cigarette') ||
              label.includes('tobacco') || label.includes('lighter')) {
            type = 'smoking';
            details = 'Gesto de fumar detectado';
          }
          else if (label.includes('drinking') || label.includes('sipping') ||
                   label.includes('coffee') || label.includes('beverage')) {
            type = 'drinking';
            details = 'Gesto de beber detectado';
          }
          else if (label.includes('looking') || label.includes('gazing') ||
                   label.includes('staring') || label.includes('glancing')) {
            type = 'suspicious';
            details = 'Mirada lateral/sospechosa detectada';
          }
          else if (label.includes('phone') || label.includes('calling') ||
                   label.includes('texting')) {
            type = 'phone';
            details = 'Uso de dispositivo móvil';
          }
          else if (label.includes('aggressive') || label.includes('fighting') ||
                   label.includes('threatening') || label.includes('violent')) {
            type = 'risk';
            details = 'Comportamiento agresivo detectado';
          }
          else if (label.includes('hand') || label.includes('gesture') ||
                   label.includes('pointing') || label.includes('waving')) {
            type = 'gesture';
            details = 'Gesto con las manos';
          }
          
          if (result.score > 0.15) {
            newDetections.push({
              type,
              label: `${label}`,
              confidence: result.score,
              timestamp,
              details
            });
          }
        });
      }
      
      // Análisis adicional con detector de poses si está disponible
      if (poseDetector) {
        console.log('🤸 Analizando poses corporales...');
        const poseResults = await poseDetector(imageData, {
          top_k: 5
        });
        
        if (poseResults && Array.isArray(poseResults)) {
          poseResults.forEach((result: any) => {
            const label = result.label.toLowerCase();
            let type: DetectionResult['type'] = 'movement';
            let details = '';
            
            if (label.includes('sitting') || label.includes('standing') ||
                label.includes('walking') || label.includes('running')) {
              type = 'movement';
              details = `Postura: ${label}`;
            }
            
            if (result.score > 0.2) {
              newDetections.push({
                type,
                label: `Postura: ${label}`,
                confidence: result.score,
                timestamp,
                details
              });
            }
          });
        }
      }
      
      // Actualizar detecciones si hay nuevas
      if (newDetections.length > 0) {
        console.log('🎯 Nuevas detecciones:', newDetections);
        setDetections(prev => {
          const filtered = [...newDetections, ...prev.slice(0, 15)];
          return filtered;
        });
      }
      
    } catch (err) {
      console.error('Error procesando frame avanzado:', err);
    }
  };

  // Iniciar/detener detección con intervalo optimizado
  useEffect(() => {
    if (videoElement && objectDetector && actionClassifier && !isLoading) {
      console.log('🎯 Iniciando detección avanzada en tiempo real...');
      intervalRef.current = setInterval(processAdvancedFrame, 2000); // Cada 2 segundos para mejor precisión
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [videoElement, objectDetector, actionClassifier, poseDetector, isLoading]);

  return {
    detections,
    isLoading,
    error,
    processFrame: processAdvancedFrame
  };
};
