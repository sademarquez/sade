
import React from 'react';
import { Shield, AlertTriangle, Camera, Activity } from 'lucide-react';

interface DetectionResult {
  type: 'gesture' | 'weapon' | 'movement' | 'risk';
  label: string;
  confidence: number;
  timestamp: number;
  coordinates?: { x: number; y: number; width: number; height: number };
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
        return 'border-red-400/50 bg-red-900/50';
      case 'risk':
        return 'border-orange-400/50 bg-orange-900/50';
      case 'gesture':
        return 'border-blue-400/50 bg-blue-900/50';
      case 'movement':
        return 'border-green-400/50 bg-green-900/50';
      default:
        return 'border-gray-400/50 bg-gray-900/50';
    }
  };

  if (error) {
    return (
      <div className="absolute top-4 right-4 bg-red-900/80 backdrop-blur-sm rounded-lg p-4 text-white border border-red-400/30 max-w-xs">
        <div className="flex items-center space-x-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <span className="font-semibold">Error de IA</span>
        </div>
        <p className="text-sm text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 space-y-2 max-w-xs z-20">
      {/* Estado del sistema */}
      <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white border border-cyan-400/30">
        <div className="flex items-center space-x-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
          <span className="text-sm font-semibold">
            {isLoading ? 'Cargando IA...' : 'Sistema Activo'}
          </span>
        </div>
        <div className="text-xs text-cyan-300">
          Detección Neural Avanzada
        </div>
      </div>

      {/* Detecciones en tiempo real */}
      {detections.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {detections.slice(0, 5).map((detection, index) => (
            <div 
              key={`${detection.timestamp}-${index}`}
              className={`rounded-lg p-3 text-white border backdrop-blur-sm ${getDetectionColor(detection.type)} animate-fade-in`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getDetectionIcon(detection.type)}
                  <div>
                    <div className="text-sm font-medium">
                      {detection.label}
                    </div>
                    <div className="text-xs opacity-70">
                      Confianza: {(detection.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                {detection.type === 'weapon' && (
                  <div className="text-xs bg-red-500 px-2 py-1 rounded-full animate-pulse">
                    ALERTA
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Información técnica */}
      <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2 text-white border border-gray-400/20">
        <div className="text-xs text-gray-300 text-center">
          IA Neural • Detección: {detections.length > 0 ? 'ACTIVA' : 'STANDBY'}
        </div>
      </div>
    </div>
  );
};

export default RealTimeDetectionOverlay;
