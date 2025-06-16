
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Play, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const DemoAccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDemoAccess = () => {
    console.log('🚀 DEMO ACCESS: Usuario accediendo con cuenta demo');
    
    // Simular autenticación demo
    sessionStorage.setItem('demo_mode', 'true');
    sessionStorage.setItem('demo_user', JSON.stringify({
      id: 'demo-user-id',
      email: 'demo@sade.com',
      full_name: 'Usuario Demo SADE',
      role: 'viewer',
      department: 'Demostración'
    }));

    toast({
      title: "Acceso Demo Activado",
      description: "Entrando al sistema SADE en modo demostración",
    });

    // Redirigir al dashboard principal
    navigate('/');
  };

  return (
    <Card className="bg-blue-900/20 backdrop-blur-sm border-blue-700/50">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Play className="h-6 w-6 text-blue-400" />
          <Shield className="h-6 w-6 text-blue-400" />
        </div>
        <CardTitle className="text-white">Acceso Demo</CardTitle>
        <CardDescription className="text-blue-200">
          Explora el sistema SADE sin necesidad de registro
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-800/30 rounded-lg p-3 border border-blue-600/30">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-100">
                <p className="font-medium mb-1">Modo Demostración:</p>
                <ul className="space-y-1">
                  <li>• Acceso completo a la interfaz</li>
                  <li>• Datos simulados para pruebas</li>
                  <li>• Sin persistencia real de datos</li>
                  <li>• Perfecto para evaluación del sistema</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            onClick={handleDemoAccess}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <Play className="h-4 w-4 mr-2" />
            Ingresar en Modo Demo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoAccess;
