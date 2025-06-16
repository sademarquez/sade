
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuración de Gemini AI
const API_KEY = 'AIzaSyB0EL5it0LTQOHChULpQSa7BGvdPQPzNkY';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface RealDetection {
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

export class GeminiVisionService {
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  private requestCount = 0;
  private lastRequestTime = 0;

  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Probando conexión con Gemini AI...');
      const result = await this.model.generateContent("Responde con 'OK' si puedes procesar este mensaje");
      const response = await result.response;
      const text = response.text();
      console.log('✅ Conexión con Gemini exitosa:', text);
      return text.includes('OK');
    } catch (error) {
      console.error('❌ Error de conexión con Gemini:', error);
      return false;
    }
  }

  async analyzeFrame(imageData: string): Promise<RealDetection[]> {
    try {
      // Control de rate limiting
      const now = Date.now();
      if (now - this.lastRequestTime < 1000) {
        console.log('⏰ Rate limiting: esperando...');
        return [];
      }
      
      this.requestCount++;
      this.lastRequestTime = now;
      
      console.log(`🧠 Llamada #${this.requestCount} a Gemini AI - Analizando frame...`);

      const prompt = `
        Analiza esta imagen de cámara web y detecta ESPECÍFICAMENTE:
        
        DETECCIONES PRIORITARIAS:
        1. PERSONAS: cantidad, posición, actividad
        2. ROSTROS: emociones (feliz, triste, enojado, neutral, sorprendido)
        3. MANOS: gestos (saludo, pulgar arriba, ok, paz, señalar)
        4. OBJETOS: teléfono, vaso, comida, libro, lápiz
        5. ACCIONES: hablando, comiendo, escribiendo, gesticulando
        
        Responde SOLO en JSON válido, sin texto adicional:
        [
          {
            "type": "face|hand|object|gesture|emotion|person|action",
            "label": "descripción exacta",
            "confidence": 0.85,
            "coordinates": {"x": 150, "y": 100, "width": 80, "height": 100},
            "details": "descripción detallada",
            "priority": "high|medium|low",
            "subtype": "especifica más el tipo"
          }
        ]
        
        IMPORTANTE: Si no hay nada específico que detectar, devuelve array vacío []
      `;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageData.split(',')[1]
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      
      console.log('📝 Respuesta bruta de Gemini:', text);
      
      // Limpiar y parsear respuesta
      let cleanedText = text.trim();
      
      // Remover markdown si existe
      if (cleanedText.includes('```json')) {
        cleanedText = cleanedText.split('```json')[1].split('```')[0].trim();
      } else if (cleanedText.includes('```')) {
        cleanedText = cleanedText.split('```')[1].split('```')[0].trim();
      }
      
      // Buscar array JSON
      const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.warn('⚠️ No se encontró JSON válido en respuesta');
        return [];
      }

      const detections = JSON.parse(jsonMatch[0]) as RealDetection[];
      
      if (detections.length > 0) {
        console.log(`✅ Gemini detectó ${detections.length} elementos:`, detections.map(d => `${d.type}: ${d.label}`));
      } else {
        console.log('📭 Gemini no detectó elementos específicos en este frame');
      }
      
      // Procesar detecciones
      return detections.map(detection => ({
        ...detection,
        timestamp: Date.now(),
        vector: this.generateFeatureVector(detection.type),
        confidence: Math.max(0.6, Math.min(0.98, detection.confidence))
      }));

    } catch (error) {
      console.error('❌ Error en análisis Gemini:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('QUOTA_EXCEEDED')) {
          console.error('💰 Cuota de API agotada');
        } else if (error.message.includes('INVALID_API_KEY')) {
          console.error('🔑 API Key inválida');
        } else if (error.message.includes('PERMISSION_DENIED')) {
          console.error('🚫 Permisos denegados');
        }
      }
      
      throw new Error(`Error de Gemini AI: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private generateFeatureVector(type: string): number[] {
    const vectorSizes = {
      face: 128,
      hand: 64,
      object: 96,
      emotion: 48,
      gesture: 32,
      pose: 24,
      person: 256,
      action: 48
    };

    const size = vectorSizes[type as keyof typeof vectorSizes] || 64;
    return Array.from({ length: size }, () => Math.random() * 2 - 1);
  }

  getStats() {
    return {
      requestCount: this.requestCount,
      lastRequestTime: this.lastRequestTime,
      apiKeySet: !!API_KEY
    };
  }
}

export const geminiService = new GeminiVisionService();
