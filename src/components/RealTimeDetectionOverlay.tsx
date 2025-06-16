
import React from 'react';
import { Shield, AlertTriangle, Camera, Activity, cigarette, coffee, eye, eye-off } from 'lucide-react';

interface DetectionResult {
  type: 'gesture' | 'weapon' | 'movement' | 'risk' | 'smoking' | 'drinking' | 'eating' | 'phone' | 'suspicious';
  label: string;
  confidence: number;
  timestamp: number;
  coordinates?: { x: number; y: number; width: number; height: number };
  details?: string;
}

interface RealTimeDetectionOverlayProps {
  detections: DetectionResult[];
  isLoading: boolean;
  error: string | null;
}

const RealTimeDetectionOverlay: React.FC<RealTimeDetectionOverlayProps> = ({
  detections,
  isLoading,
  error
}) => {
  const getDetectionIcon = (type: DetectionResult['type']) => {
    switch (type) {
      case 'weapon':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'risk':
        return <Shield className="h-4 w-4 text-orange-400" />;
      case 'smoking':
        return <cigarette className="h-4 w-4 text-yellow-400" />;
      case 'drinking':
        return <coffee className="h-4 w-4 text-brown-400" />;
      case 'eating':
        return <Activity className="h-4 w-4 text-green-400" />;
      case 'phone':
        return <Camera className="h-4 w-4 text-purple-400" />;
      case 'suspicious':
        return <eye className="h-4 w-4 text-red-300" />;
      case 'gesture':
        return <Activity className="h-4 w-4 text-blue-400" />;
      case 'movement':
        return <Camera className="h-4 w-4 text-green-400" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getDetectionColor = (type: DetectionResult['type']) => {
    switch (type) {
      case 'weapon':
        return 'border-red-400/70 bg-red-900/70';
      case 'risk':
        return 'border-orange-400/70 bg-orange-900/70';
      case 'smoking':
        return 'border-yellow-400/70 bg-yellow-900/70';
      case 'drinking':
        return 'border-amber-400/70 bg-amber-900/70';
      case 'eating':
        return 'border-green-400/70 bg-green-900/70';
      case 'phone':
        return 'border-purple-400/70 bg-purple-900/70';
      case 'suspicious':
        return 'border-red-300/70 bg-red-800/70';
      case 'gesture':
        return 'border-blue-400/70 bg-blue-900/70';
      case 'movement':
        return 'border-green-400/70 bg-green-900/70';
      default:
        return 'border-gray-400/70 bg-gray-900/70';
    }
  };

  const getPriorityLevel = (type: DetectionResult['type']) => {
    const priorities = {
      weapon: 1,
      risk: 2,
      smoking: 3,
      suspicious: 4,
      phone: 5,
      drinking: 6,
      eating: 7,
      gesture: 8,
      movement: 9
    };
    return priorities[type] || 10;
  };

  // Ordenar detecciones por prioridad y tiempo
  const sortedDetections = [...detections]
    .sort((a, b) => {
      const priorityDiff = getPriorityLevel(a.type) - getPriorityLevel(b.type);
      if (priorityDiff !== 0) return priorityDiff;
      return b.timestamp - a.timestamp;
    })
    .slice(0, 6); // Mostrar máximo 6 detecciones

  if (error) {
    return (
      <div className="absolute top-4 right-4 bg-red-900/90 backdrop-blur-sm rounded-lg p-4 text-white border border-red-400/40 max-w-xs z-30">
        <div className="flex items-center space-x-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <span className="font-semibold">Error de IA</span>
        </div>
        <p className="text-sm text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 space-y-2 max-w-sm z-30">
      {/* Estado del sistema avanzado */}
      <div className="bg-black/90 backdrop-blur-sm rounded-lg p-4 text-white border border-cyan-400/40">
        <div className="flex items-center space-x-2 mb-3">
          <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400 animate-pulse'}`}></div>
          <span className="text-sm font-semibold">
            {isLoading ? 'Cargando IA Avanzada...' : 'Sistema IA Neural Activo'}
          </span>
        </div>
        <div className="text-xs text-cyan-300 space-y-1">
          <div>✓ Detección de Gestos Específicos</div>
          <div>✓ Análisis de Comportamiento</div>
          <div>✓ Reconocimiento de Objetos</div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      {detections.length > 0 && (
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white border border-gray-400/30">
          <div className="text-xs text-gray-300 text-center">
            Detecciones activas: {detections.length} | Última: {new Date(Math.max(...detections.map(d => d.timestamp))).toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* Detecciones en tiempo real */}
      {sortedDetections.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sortedDetections.map((detection, index) => (
            <div 
              key={`${detection.timestamp}-${index}`}
              className={`rounded-lg p-3 text-white border backdrop-blur-sm ${getDetectionColor(detection.type)} animate-fade-in shadow-lg`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  {getDetectionIcon(detection.type)}
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {detection.label}
                    </div>
                    {detection.details && (
                      <div className="text-xs opacity-80 mt-1">
                        {detection.details}
                      </div>
                    )}
                    <div className="text-xs opacity-60 mt-1">
                      Precisión: {(detection.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                {(detection.type === 'weapon' || detection.type === 'risk') && (
                  <div className="text-xs bg-red-500 px-2 py-1 rounded-full animate-pulse font-bold">
                    ¡ALERTA!
                  </div>
                )}
                {detection.type === 'smoking' && (
                  <div className="text-xs bg-yellow-500 px-2 py-1 rounded-full">
                    FUMANDO
                  </div>
                )}
                {detection.type === 'drinking' && (
                  <div className="text-xs bg-amber-500 px-2 py-1 rounded-full">
                    BEBIENDO
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Información técnica mejorada */}
      <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2 text-white border border-gray-400/20">
        <div className="text-xs text-gray-300 text-center">
          IA Neural • Modelos: YOLO + ViT + ResNet
        </div>
        <div className="text-xs text-gray-400 text-center mt-1">
          Detección: {sortedDetections.length > 0 ? 'ACTIVA' : 'STANDBY'}
        </div>
      </div>
    </div>
  );
};

export default RealTimeDetectionOverlay;
