// VoiceAssistant.tsx
import React, { useState } from 'react';
import { Mic, MicOff, MessageSquare } from 'lucide-react';
import type { QueryResponse, VoiceAssistantState } from '../types';
import MenuBar from './MenuBar';
import { motion } from "framer-motion";
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceAssistant() {
  const [state, setState] = useState<VoiceAssistantState>({
    isListening: false,
    transcript: '',
    isProcessing: false,
  });

  const [responses, setResponses] = useState<QueryResponse[]>([]);

  const toggleListening = () => {
    if (state.isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    setState((prev) => ({ ...prev, isListening: true }));
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setState((prev) => ({ ...prev, transcript, isListening: false }));
      handleQuery(transcript);
    };

    recognition.onerror = () => setState((prev) => ({ ...prev, isListening: false }));
    recognition.start();
  };

  const stopListening = () => {
    setState((prev) => ({ ...prev, isListening: false }));
  };

  const speakResponse = (text: string) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setState((prev) => ({ ...prev, isProcessing: false }));
    }
  };

  const handleQuery = async (inputText: string) => {
    setState((prev) => ({ ...prev, isProcessing: true }));

    const prompt = `<|system|>You are a helpful agricultural expert assistant.<|user|>${inputText}<|assistant|>`;

    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer YOUR_HUGGINGFACE_TOKEN`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 150,
              temperature: 0.7,
              top_p: 0.95,
              repetition_penalty: 1.1,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      const fullOutput = data?.[0]?.generated_text || '';
      const generatedAnswer =
        fullOutput.split('<|assistant|>')[1]?.trim() ||
        'Sorry, I could not generate a valid answer.';

      const responseData = {
        question: inputText,
        answer: generatedAnswer,
        expert: 'By AgriBot Expert',
        timestamp: new Date().toISOString(),
      };

      setResponses((prev) => [...prev, responseData]);
      speakResponse(generatedAnswer);
    } catch (error: unknown) {
      let message = 'An unknown error occurred.';
      if (error instanceof Error) {
        message = error.message;
      }
      speakResponse(`There was an error processing your request: ${message}`);
    } finally {
      setState((prev) => ({ ...prev, isProcessing: false, transcript: '' }));
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, transcript: event.target.value }));
  };

  const handleInputSubmit = () => {
    if (state.transcript) {
      handleQuery(state.transcript);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
        🎙️ Voice Assistant
      </h2>
  
      {/* Voice Controls Section */}
      <div className="flex items-center space-x-4 mb-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleListening}
          className={`p-4 rounded-full ${
            state.isListening
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
          }`}
          title={state.isListening ? "Stop Listening" : "Start Listening"}
        >
          {state.isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </motion.button>
  
        <input
          type="text"
          value={state.transcript}
          onChange={handleInputChange}
          placeholder="Type your question..."
          className="flex-1 min-h-[48px] p-3 bg-gray-50 border border-gray-200 rounded-lg"
        />
  
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleInputSubmit}
          disabled={!state.transcript || state.isProcessing}
          className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Ask Expert
        </motion.button>
  
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={stopSpeaking}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Stop
        </motion.button>
      </div>
  
      <hr className="my-6 border-t border-gray-300" />
  
      {/* Response Section */}
      <div className="space-y-4">
        {responses.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 italic"
          >
            No questions asked yet.
          </motion.p>
        ) : (
          responses.map((response, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-start space-x-3">
                <MessageSquare className="h-5 w-5 text-blue-500 mt-1" />
                <div className="flex-1">
                  <p className="text-gray-600 mb-2 font-semibold">Q: {response.question}</p>
                  <p className="font-medium text-green-800">A: {response.answer}</p>
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>🧠 {response.expert}</span>
                    <span>{new Date(response.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

// ImageAnalysis Component
export function ImageAnalysis() {
  return (
    <>
      <MenuBar />
      {/* rest of your ImageAnalysis code */}
    </>
  );
}


