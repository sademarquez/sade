
import React from 'react';
import { Brain, Target, Eye, Hand, Activity, AlertTriangle, Camera } from 'lucide-react';

interface GeminiDetection {
  type: 'person' | 'face' | 'hand' | 'object' | 'gesture' | 'action' | 'emotion' | 'pose';
  label: string;
  confidence: number;
  timestamp: number;
  coordinates: { x: number; y: number; width: number; height: number };
  vector?: number[];
  details: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  subtype?: string;
}

interface GeminiDetectionOverlayProps {
  detections: GeminiDetection[];
  isLoading: boolean;
  error: string | null;
  frameCount: number;
}

const GeminiDetectionOverlay: React.FC<GeminiDetectionOverlayProps> = ({
  detections,
  isLoading,
  error,
  frameCount
}) => {
  const getDetectionIcon = (type: GeminiDetection['type']) => {
    switch (type) {
      case 'face':
        return <Eye className="h-4 w-4" />;
      case 'hand':
        return <Hand className="h-4 w-4" />;
      case 'object':
        return <Target className="h-4 w-4" />;
      case 'emotion':
        return <Brain className="h-4 w-4" />;
      case 'pose':
        return <Activity className="h-4 w-4" />;
      default:
        return <Camera className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: GeminiDetection['priority']) => {
    switch (priority) {
      case 'critical':
        return 'border-red-500 bg-red-500/20 text-red-300';
      case 'high':
        return 'border-orange-500 bg-orange-500/20 text-orange-300';
      case 'medium':
        return 'border-yellow-500 bg-yellow-500/20 text-yellow-300';
      case 'low':
        return 'border-green-500 bg-green-500/20 text-green-300';
      default:
        return 'border-blue-500 bg-blue-500/20 text-blue-300';
    }
  };

  const getVectorVisualization = (vector?: number[], type?: string) => {
    if (!vector) return null;
    
    const maxBars = 8;
    const step = Math.ceil(vector.length / maxBars);
    const sampledVector = [];
    
    for (let i = 0; i < maxBars && i * step < vector.length; i++) {
      sampledVector.push(vector[i * step]);
    }

    return (
      <div className="flex items-end space-x-0.5 mt-1">
        {sampledVector.map((value, idx) => (
          <div
            key={idx}
            className="w-1 bg-cyan-400 rounded-sm opacity-70"
            style={{ height: `${Math.max(2, value * 12)}px` }}
          />
        ))}
      </div>
    );
  };

  // Ordenar por prioridad y timestamp
  const sortedDetections = [...detections]
    .sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.timestamp - a.timestamp;
    })
    .slice(0, 8);

  if (error) {
    return (
      <div className="absolute top-4 right-4 bg-red-900/90 backdrop-blur-sm rounded-lg p-4 text-white border border-red-400/40 max-w-xs z-40">
        <div className="flex items-center space-x-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <span className="font-semibold">Error Gemini AI</span>
        </div>
        <p className="text-sm text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Overlay principal de estado */}
      <div className="absolute top-4 right-4 space-y-3 max-w-sm z-40">
        {/* Header Gemini AI */}
        <div className="bg-black/95 backdrop-blur-sm rounded-lg p-4 text-white border border-purple-400/50 shadow-lg shadow-purple-500/20">
          <div className="flex items-center space-x-3 mb-3">
            <Brain className={`h-5 w-5 ${isLoading ? 'text-yellow-400 animate-pulse' : 'text-purple-400 animate-pulse'}`} />
            <div>
              <span className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Gemini AI Neural
              </span>
              <div className="text-xs text-purple-300">
                {isLoading ? 'Inicializando...' : 'Sistema Activo'}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-purple-900/40 rounded p-2">
              <div className="text-purple-300">Frames</div>
              <div className="text-white font-mono">{frameCount}</div>
            </div>
            <div className="bg-purple-900/40 rounded p-2">
              <div className="text-purple-300">Detecciones</div>
              <div className="text-white font-mono">{detections.length}</div>
            </div>
          </div>
        </div>

        {/* Panel de detecciones activas */}
        {sortedDetections.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sortedDetections.map((detection, index) => (
              <div 
                key={`${detection.timestamp}-${index}`}
                className={`rounded-lg p-3 border backdrop-blur-sm shadow-lg animate-fade-in ${getPriorityColor(detection.priority)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getDetectionIcon(detection.type)}
                    <div>
                      <div className="text-sm font-semibold">
                        {detection.label}
                      </div>
                      <div className="text-xs opacity-80">
                        {detection.details}
                      </div>
                    </div>
                  </div>
                  
                  {detection.priority === 'critical' && (
                    <div className="text-xs bg-red-600 px-2 py-1 rounded-full animate-pulse font-bold">
                      CRÍTICO
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span>Precisión: {(detection.confidence * 100).toFixed(1)}%</span>
                  <span>Vector: {detection.vector?.length || 0}D</span>
                </div>
                
                {/* Visualización del vector */}
                {getVectorVisualization(detection.vector, detection.type)}
              </div>
            ))}
          </div>
        )}

        {/* Panel técnico */}
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white border border-gray-400/30">
          <div className="text-xs text-gray-300 text-center space-y-1">
            <div className="font-semibold text-purple-300">🧠 Gemini AI Neural Engine</div>
            <div>Vectores • Multimodal • Tiempo Real</div>
            <div className="text-gray-500">
              Estado: {sortedDetections.length > 0 ? 'DETECTANDO' : 'MONITOREANDO'}
            </div>
          </div>
        </div>
      </div>

      {/* Vectores de detección superpuestos en el video */}
      <div className="absolute inset-0 pointer-events-none z-30">
        <svg className="w-full h-full">
          {sortedDetections.map((detection, index) => {
            const { x, y, width, height } = detection.coordinates;
            const color = detection.priority === 'critical' ? '#ef4444' : 
                         detection.priority === 'high' ? '#f97316' : 
                         detection.priority === 'medium' ? '#eab308' : '#22c55e';
            
            return (
              <g key={`vector-${index}`}>
                {/* Rectángulo de detección */}
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.8"
                  className="animate-pulse"
                />
                
                {/* Punto central */}
                <circle
                  cx={x + width/2}
                  cy={y + height/2}
                  r="3"
                  fill={color}
                  opacity="0.9"
                />
                
                {/* Líneas de vector */}
                <line
                  x1={x + width/2}
                  y1={y + height/2}
                  x2={x + width/2 + (Math.cos(index) * 30)}
                  y2={y + height/2 + (Math.sin(index) * 30)}
                  stroke={color}
                  strokeWidth="1"
                  opacity="0.6"
                />
                
                {/* Etiqueta */}
                <text
                  x={x}
                  y={y - 5}
                  fill={color}
                  fontSize="12"
                  fontWeight="bold"
                  className="font-mono"
                >
                  {detection.type.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </>
  );
};

export default GeminiDetectionOverlay;
