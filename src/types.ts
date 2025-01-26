export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  date: string;
}

export interface SoilData {
  ph: number;
  moisture: number;
  nutrients: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
}

export interface Disease {
  name: string;
  confidence: number;
  description: string;
  treatment: string;
}

export interface QueryResponse {
  question: string;
  answer: string;
  expert: string;
  timestamp: string;
}

export interface VoiceAssistantState {
  isListening: boolean;
  transcript: string;
  isProcessing: boolean;
}