
import React, { useState, useEffect } from 'react';
import { Camera, AlertTriangle, CheckCircle, Wifi } from 'lucide-react';

interface CameraStatus {
  id: number;
  name: string;
  status: 'active' | 'inactive' | 'alert';
  location: string;
  lastDetection?: string;
  objectsDetected: number;
}

const CameraGrid = () => {
  const [cameras, setCameras] = useState<CameraStatus[]>([
    { id: 1, name: 'Cámara Principal', status: 'active', location: 'Entrada Principal', objectsDetected: 3 },
    { id: 2, name: 'Cámara Lateral', status: 'active', location: 'Lateral Izquierdo', objectsDetected: 1 },
    { id: 3, name: 'Cámara Trasera', status: 'alert', location: 'Zona Trasera', lastDetection: 'Movimiento detectado', objectsDetected: 7 },
    { id: 4, name: 'Cámara Parking', status: 'active', location: 'Estacionamiento', objectsDetected: 5 },
    { id: 5, name: 'Cámara Interior 1', status: 'active', location: 'Pasillo Principal', objectsDetected: 2 },
    { id: 6, name: 'Cámara Interior 2', status: 'inactive', location: 'Oficina Norte', objectsDetected: 0 },
    { id: 7, name: 'Cámara Perimetral', status: 'active', location: 'Perímetro Este', objectsDetected: 4 },
    { id: 8, name: 'Cámara Acceso', status: 'alert', location: 'Control de Acceso', lastDetection: 'Persona no autorizada', objectsDetected: 8 },
    { id: 9, name: 'Cámara Almacén', status: 'active', location: 'Zona de Almacén', objectsDetected: 1 },
    { id: 10, name: 'Cámara Exterior', status: 'active', location: 'Jardín Exterior', objectsDetected: 6 }
  ]);

  // Simulación de actualización en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setCameras(prev => prev.map(camera => ({
        ...camera,
        objectsDetected: Math.max(0, camera.objectsDetected + Math.floor(Math.random() * 3) - 1)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-green-500 bg-green-50';
      case 'alert': return 'border-red-500 bg-red-50';
      case 'inactive': return 'border-gray-400 bg-gray-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'alert': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'inactive': return <Wifi className="h-5 w-5 text-gray-400" />;
      default: return <Camera className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6">
      {cameras.map((camera) => (
        <div
          key={camera.id}
          className={`relative border-2 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 ${getStatusColor(camera.status)}`}
        >
          {/* Video simulado */}
          <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
            <Camera className="h-12 w-12 text-slate-400" />
            
            {/* Overlay de detección */}
            {camera.status === 'active' && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            )}
            
            {/* Indicador de objetos detectados */}
            {camera.objectsDetected > 0 && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {camera.objectsDetected}
              </div>
            )}

            {/* Simulación de cuadros de detección */}
            {camera.status === 'alert' && (
              <div className="absolute inset-4 border-2 border-red-400 rounded animate-pulse" />
            )}
          </div>

          {/* Información de la cámara */}
          <div className="p-3 bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm text-gray-800">{camera.name}</h3>
              {getStatusIcon(camera.status)}
            </div>
            
            <p className="text-xs text-gray-600 mb-1">{camera.location}</p>
            
            {camera.lastDetection && (
              <p className="text-xs text-red-600 font-medium">{camera.lastDetection}</p>
            )}

            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
              <span className="text-xs text-gray-500">Objetos: {camera.objectsDetected}</span>
              <div className={`w-2 h-2 rounded-full ${
                camera.status === 'active' ? 'bg-green-400 animate-pulse' :
                camera.status === 'alert' ? 'bg-red-400 animate-pulse' :
                'bg-gray-400'
              }`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CameraGrid;
