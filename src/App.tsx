import { Leaf as LeafIcon } from 'lucide-react'; // Leaf icon
import ImageAnalysis from './components/ImageAnalysis';
import VoiceAssistant from './components/VoiceAssistant';
import DataVisualizer from './components/DataVisualizer';
import './styles/App.css'; // Import CSS for animations

function App() {
  return (
    <div className="min-h-screen bg-plant-background bg-cover bg-center">
      {/* Header Section */}
      <header className="py-20 bg-gradient-to-b from-green-400 via-green-200 to-transparent text-black">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center">
            <LeafIcon className="h-20 w-20 text-green-600 animate-bounce" />
          </div>
          <h1 className="text-6xl font-extrabold text-black-800 drop-shadow-2xl">
           AI-Powered Crop Disease and Pests Detection
          </h1>
          <p className="mt-4 text-2xl italic text-gray-700 font-medium tracking-wide">
            Transforming Agriculture, One Field at a Time
          </p>
        </div>
      </header>

      {/* Main Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Analysis */}
          <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 hover:shadow-xl transition duration-300">
            <h2 className="text-3xl font-bold text-green-700 mb-4">Image Analysis</h2>
            <p className="text-gray-600 mb-6">
              Upload and analyze crop images to detect diseases and pests efficiently.
            </p>
            <ImageAnalysis />
          </div>

          {/* Voice Assistant */}
          <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 hover:shadow-xl transition duration-300">
            <h2 className="text-3xl font-bold text-purple-700 mb-4">Voice Assistant and ChatBot</h2>
            <p className="text-gray-600 mb-6">
              Ask questions and get real-time AI assistance for crop-related queries.
            </p>
            <div className="w-11/12"> {/* Slightly increase width */}
              <VoiceAssistant /> 
            </div>
          </div>

          {/* Data Visualizer */}
          <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 hover:shadow-xl transition duration-300">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">Data Visualization</h2>
            <p className="text-gray-600 mb-6">
              View interactive track crop health trends.
            </p>
            <DataVisualizer />
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="py-10 bg-green-600 text-center text-white">
        <p className="text-xl font-semibold tracking-wider">
          Powered by Advanced AI and Expert Phytopathologists
        </p>
        <div className="mt-2 text-sm italic text-gray-200">
          Revolutionizing Agriculture for a Sustainable Future
        </div>
      </footer>
    </div>
  );
}

export default App;