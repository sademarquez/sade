
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

  async analyzeFrame(imageData: string): Promise<RealDetection[]> {
    try {
      const prompt = `
        Analiza esta imagen y detecta:
        1. PERSONAS: posición, postura, actividad
        2. ROSTROS: emociones, expresiones, mirada
        3. MANOS: gestos, objetos que sostienen, posiciones
        4. OBJETOS: cigarrillos, bebidas, teléfonos, armas, herramientas
        5. COMPORTAMIENTOS: fumando, bebiendo, hablando por teléfono, comiendo
        6. POSTURAS: sentado, de pie, inclinado, movimiento
        
        Responde SOLO en formato JSON válido sin texto adicional:
        [
          {
            "type": "face|hand|object|gesture|emotion|pose|person",
            "label": "descripción breve",
            "confidence": 0.85,
            "coordinates": {"x": 100, "y": 150, "width": 80, "height": 100},
            "details": "descripción detallada",
            "priority": "critical|high|medium|low",
            "subtype": "subcategoría específica"
          }
        ]
        
        Prioridades:
        - critical: armas, peligros, comportamiento sospechoso
        - high: fumando, objetos peligrosos, gestos agresivos
        - medium: bebiendo, teléfono, objetos personales
        - low: gestos normales, posturas comunes
      `;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageData.split(',')[1] // Remover el prefijo data:image/jpeg;base64,
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      
      // Limpiar la respuesta para obtener solo el JSON
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.warn('No se encontró JSON válido en la respuesta:', text);
        return [];
      }

      const detections = JSON.parse(jsonMatch[0]) as RealDetection[];
      
      // Añadir timestamp y generar vectores simulados
      return detections.map(detection => ({
        ...detection,
        timestamp: Date.now(),
        vector: this.generateFeatureVector(detection.type),
        confidence: Math.max(0.7, Math.min(0.99, detection.confidence)) // Normalizar confianza
      }));

    } catch (error) {
      console.error('Error en análisis Gemini:', error);
      throw new Error(`Error de Gemini AI: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private generateFeatureVector(type: string): number[] {
    // Generar vectores de características específicos por tipo
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
    return Array.from({ length: size }, () => Math.random() * 2 - 1); // Valores entre -1 y 1
  }

  async analyzeGesture(imageData: string): Promise<string> {
    try {
      const prompt = `
        Analiza específicamente los gestos de las manos en esta imagen.
        Identifica si la persona está:
        - Fumando (cigarrillo en mano)
        - Bebiendo (vaso, botella)
        - Usando teléfono
        - Haciendo gestos específicos (saludo, señalar, etc.)
        - Sosteniendo objetos peligrosos
        
        Responde solo con: "fumando", "bebiendo", "telefono", "saludo", "señalando", "peligroso", "normal" o "no_detectado"
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
      return response.text().trim().toLowerCase();
    } catch (error) {
      console.error('Error en análisis de gestos:', error);
      return 'error';
    }
  }

  async detectEmotion(imageData: string): Promise<string> {
    try {
      const prompt = `
        Analiza la expresión facial y emoción de la persona principal en esta imagen.
        Responde solo con una de estas emociones:
        "neutral", "feliz", "triste", "enojado", "sorprendido", "concentrado", "preocupado", "sospechoso"
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
      return response.text().trim().toLowerCase();
    } catch (error) {
      console.error('Error en detección de emociones:', error);
      return 'neutral';
    }
  }
}

export const geminiService = new GeminiVisionService();
