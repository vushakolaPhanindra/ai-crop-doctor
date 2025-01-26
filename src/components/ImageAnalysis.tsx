import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import type { Disease } from '../types';

export default function ImageAnalysis() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Disease[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [controlMethods, setControlMethods] = useState<{ natural: string[]; organic: string[] }>({
    natural: [],
    organic: [],
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        analyzeImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setControlMethods({ natural: [], organic: [] });

    const apiKey = 'tDOKVFeUtiUb2D1R2k8vWV18oiha03tY8egzx8uAvvfJUMsVIv';
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('https://api.plant.id/v2/identify', {
        method: 'POST',
        headers: {
          'Api-Key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`Error analyzing image: ${errorResponse}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.suggestions && Array.isArray(data.suggestions)) {
        setResults(data.suggestions as Disease[]); // Cast to Disease[]
        generateVirtualControlMethods(); // Generate control methods
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      const error = err as Error; // Explicitly cast to Error
      console.error('Error analyzing image:', error);
      setErrorMessage(`There was an error analyzing the image: ${error.message}. Please try again.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateVirtualControlMethods = () => {
    const naturalPlaceholders = [
      'Hand-picking pests',
      'Use natural predators like ladybugs',
      'Crop rotation to avoid pests',
      'Plant companion crops',
      'Use neem oil spray',
    ];

    const organicPlaceholders = [
      'Apply organic compost',
      'Use organic fertilizers',
      'Spray garlic and chili solution',
      'Use certified organic pesticides',
      'Maintain organic mulch for moisture retention',
    ];

    setControlMethods({
      natural: naturalPlaceholders.slice(0, 5),
      organic: organicPlaceholders.slice(0, 5),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Crop Disease and Pests Detection</h2>

      <div className="mb-6">
        <label className="block mb-2">
          <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
            {image ? (
              <img src={image} alt="Uploaded crop" className="h-full object-contain" />
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Upload plant image</p>
              </div>
            )}
          </div>
          <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
        </label>
      </div>

      {isAnalyzing ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2">Analyzing image...</span>
        </div>
      ) : results.length > 0 ? (
        <div>
          <h3 className="text-xl font-semibold mb-4">Detected Diseases and pests:</h3>
          <ul className="list-disc list-inside space-y-2">
            {results.map((disease, index) => (
              <li key={index} className="text-gray-700">
                {disease?.plant_name ?? 'Unknown Disease'} - {((disease?.probability ?? 0) * 100).toFixed(0)}% confidence
              </li>
            ))}
          </ul>

          <h4 className="text-xl font-semibold mt-6">Control Methods:</h4>
          <div>
            <h5 className="font-medium mt-4">Natural Methods:</h5>
            <ul className="list-disc list-inside">
              {controlMethods.natural.map((method, index) => (
                <li key={index} className="text-gray-700">{method}</li>
              ))}
            </ul>

            <h5 className="font-medium mt-4">Organic Methods:</h5>
            <ul className="list-disc list-inside">
              {controlMethods.organic.map((method, index) => (
                <li key={index} className="text-gray-700">{method}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>
      )}
    </div>
  );
}
