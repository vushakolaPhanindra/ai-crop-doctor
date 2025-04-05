import React, { useState } from 'react';
import { Mic, MicOff, MessageSquare } from 'lucide-react';
import type { QueryResponse, VoiceAssistantState } from '../types';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceAssistant() {
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
      handleQuery(transcript); // Automatically ask the query after recording
    };

    recognition.onerror = () => setState((prev) => ({ ...prev, isListening: false }));
    recognition.start();
  };

  const stopListening = () => {
    setState((prev) => ({ ...prev, isListening: false }));
  };

  const speakResponse = (text: string) => {
    // Stop any ongoing speech
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
      setState((prev) => ({ ...prev, isProcessing: false })); // Reset processing state
    }
  };

  const handleQuery = async (inputText: string) => {
    setState((prev) => ({ ...prev, isProcessing: true }));

    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/EleutherAI/gpt-neox-20b',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer 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`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: inputText,
            parameters: { max_length: 50, do_sample: false },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error from API:', errorData);
        throw new Error('Failed to fetch response from Hugging Face API.');
      }

      const data = await response.json();

      if (!data || !data[0]?.generated_text) {
        throw new Error('No valid response generated.');
      }

      const answer = data[0].generated_text;

      const responseData = {
        question: inputText,
        answer,
        expert: 'By Phythopathologists',
        timestamp: new Date().toISOString(),
      };

      setResponses((prev) => [...prev, responseData]);
      speakResponse(answer);
    } catch (error) {
      console.error('Error handling query:', error);
      speakResponse('There was an error processing your request. Please try again.');
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Voice Assistant</h2>

      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={toggleListening}
          className={`p-4 rounded-full ${
            state.isListening
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
          }`}
        >
          {state.isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </button>

        <input
          type="text"
          value={state.transcript}
          onChange={handleInputChange}
          placeholder="Type your question..."
          className="flex-1 min-h-[48px] p-3 bg-gray-50 rounded-lg"
        />

        <button
          onClick={handleInputSubmit}
          disabled={!state.transcript || state.isProcessing}
          className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Ask Expert
        </button>

        <button
          onClick={stopSpeaking}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Stop
        </button>
      </div>

      <div className="space-y-4">
        {responses.map((response, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <MessageSquare className="h-5 w-5 text-blue-500 mt-1" />
              <div className="flex-1">
                <p className="text-gray-600 mb-2">{response.question}</p>
                <p className="font-medium mb-2">{response.answer}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{response.expert}</span>
                  <span>{new Date(response.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
