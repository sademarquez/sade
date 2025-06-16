
import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Shield, Video, Users, Clock } from 'lucide-react';

const ControlPanel = () => {
  const [stats, setStats] = useState({
    activeCameras: 8,
    totalAlerts: 12,
    objectsDetected: 45,
    systemUptime: '24h 15m',
    peopleDetected: 23,
    vehiclesDetected: 12
  });

  const [recentAlerts, setRecentAlerts] = useState([
    { id: 1, time: '14:32', message: 'Movimiento detectado - Cámara Trasera', type: 'warning' },
    { id: 2, time: '14:28', message: 'Persona no autorizada - Control de Acceso', type: 'danger' },
    { id: 3, time: '14:15', message: 'Vehículo detectado - Estacionamiento', type: 'info' },
    { id: 4, time: '14:12', message: 'Sistema iniciado correctamente', type: 'success' }
  ]);

  // Simulación de datos en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        objectsDetected: prev.objectsDetected + Math.floor(Math.random() * 3),
        totalAlerts: prev.totalAlerts + (Math.random() > 0.8 ? 1 : 0)
      }));

      // Simular nuevas alertas ocasionalmente
      if (Math.random() > 0.9) {
        const newAlert = {
          id: Date.now(),
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          message: 'Nueva detección en tiempo real',
          type: 'info' as const
        };
        setRecentAlerts(prev => [newAlert, ...prev.slice(0, 3)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ icon: Icon, title, value, color }: {
    icon: any;
    title: string;
    value: string | number;
    color: string;
  }) => (
    <div className="bg-white rounded-lg p-4 shadow-md border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <Icon className="h-8 w-8" style={{ color }} />
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          icon={Video}
          title="Cámaras Activas"
          value={`${stats.activeCameras}/10`}
          color="#10b981"
        />
        <StatCard
          icon={AlertTriangle}
          title="Alertas Totales"
          value={stats.totalAlerts}
          color="#f59e0b"
        />
        <StatCard
          icon={Activity}
          title="Objetos Detectados"
          value={stats.objectsDetected}
          color="#3b82f6"
        />
        <StatCard
          icon={Users}
          title="Personas"
          value={stats.peopleDetected}
          color="#8b5cf6"
        />
        <StatCard
          icon={Shield}
          title="Vehículos"
          value={stats.vehiclesDetected}
          color="#06b6d4"
        />
        <StatCard
          icon={Clock}
          title="Tiempo Activo"
          value={stats.systemUptime}
          color="#84cc16"
        />
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
          Alertas Recientes
        </h2>
        
        <div className="space-y-3">
          {recentAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${
                alert.type === 'danger' ? 'bg-red-50 border-red-500' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                alert.type === 'success' ? 'bg-green-50 border-green-500' :
                'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{alert.message}</p>
              </div>
              <span className="text-xs text-gray-500 ml-4">{alert.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Shield className="h-5 w-5 text-green-500 mr-2" />
          Estado del Sistema SADE
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Conectividad Wi-Fi</span>
              <span className="text-sm font-medium text-green-600">Óptima</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Procesamiento IA</span>
              <span className="text-sm font-medium text-green-600">Activo</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Almacenamiento</span>
              <span className="text-sm font-medium text-yellow-600">85% Usado</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Análisis en Tiempo Real</span>
              <span className="text-sm font-medium text-green-600">Funcionando</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Detección de Objetos</span>
              <span className="text-sm font-medium text-green-600">Operativo</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Última Actualización</span>
              <span className="text-sm font-medium text-gray-600">Hace 2 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
