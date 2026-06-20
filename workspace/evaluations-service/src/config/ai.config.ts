// src/config/ai.config.ts
import { createOpenAI } from '@ai-sdk/openai';
import dotenv from 'dotenv';

// Sicherstellen, dass Umgebungsvariablen geladen sind
dotenv.config();

/**
 * 1. OpenAI-Provider Instanz konfigurieren
 */
export const openaiProvider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  
  //compatibility: 'strict', // Erzwingt strikte Einhaltung der OpenAI API Spezifikationen
});

/**
 * 2. Modell-Mapping für unterschiedliche Komplexitätsstufen
 * Ermöglicht es, Modelle zentral für die gesamte Anwendung zu tauschen.
 */
export const AI_MODELS = {
  // Für schnelle Klassifizierungen, einfache Schätzungen und Standard-Extraktionen (Sehr günstig)
  fast: openaiProvider('gpt-4o-mini'),
  
  // Für komplexe mathematische Abwägungen, Risikoanalysen und tiefes logisches Denken
  reasoning: openaiProvider('o1-mini'), // Spezielles Reasoning-Modell von OpenAI für Logik & Mathe
  
  // Standard-Flaggschiff-Modell für allgemeine, anspruchsvolle Agenten-Interaktionen
  default: openaiProvider('gpt-4o'),
};

/**
 * 3. Globale Agenten-Laufzeiteinstellungen (Guardrails & Limits)
 */
export const AI_RUNTIME_CONFIG = {
  // Verhindert unendliche ReAct-Schleifen bei Tool-Calling
  maxSteps: 5,
  
  // Standard-Temperatur (0.0 = strikt deterministisch/logisch, 1.0 = kreativ)
  temperature: {
    analytical: 0.0,  // Maximale Konsistenz für Portfolio-Estimator und Risk-Auditor
    creative: 0.7,    // Für ausformulierte Texte oder Berichte
  },
  
  // Timeout für API-Anfragen in Millisekunden (30 Sekunden)
  requestTimeoutMs: 30000,
};

/**
 * 4. Validierungs-Check beim Anwendungsstart
 */
if (!process.env.OPENAI_API_KEY) {
  console.warn(
    "⚠️ [AI Config Warnung]: OPENAI_API_KEY wurde nicht in der .env gefunden. AI-Layer wird fehlschlagen."
  );
}
