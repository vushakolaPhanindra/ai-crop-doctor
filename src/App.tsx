import { Leaf as LeafIcon } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Community from './pages/Community';
import Welcome from './pages/Welcome';
import { motion } from "framer-motion";
import MenuBar from './components/MenuBar';
import ImageAnalysis from './components/ImageAnalysis';
import { VoiceAssistant } from './components/VoiceAssistant';
import DataVisualizer from './components/DataVisualizer';

import './styles/App.css';
import { ReactNode } from 'react';

function Home() {
  return (
    <>
      <header className="py-20 bg-gradient-to-b from-green-400 via-green-200 to-transparent text-black">
        <motion.div
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center items-center">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <LeafIcon className="h-20 w-20 text-green-600" />
            </motion.div>
          </div>
          <motion.h1
            className="text-6xl font-extrabold text-black-800 drop-shadow-2xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            AI-Crop-Doctor
          </motion.h1>
          <motion.p
            className="mt-4 text-2xl italic text-gray-700 font-medium tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Transforming Agriculture, One Field at a Time
          </motion.p>
        </motion.div>
      </header>
  
      <main className="container mx-auto px-4 py-12">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          {[ // Card data mapped to reduce redundancy
            {
              title: "Image Analysis",
              color: "text-green-700",
              description:
                "Upload and analyze crop images to detect diseases and pests efficiently.",
              component: <ImageAnalysis />,
            },
            {
              title: "Voice Assistant and ChatBot",
              color: "text-purple-700",
              description:
                "Ask questions and get real-time AI assistance for crop-related queries.",
              component: <VoiceAssistant />,
            },
            {
              title: "Data Visualization",
              color: "text-blue-700",
              description: "View interactive graphs to track crop health trends.",
              component: <DataVisualizer />,
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 hover:shadow-2xl transition duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-3xl font-bold mb-4 ${card.color}`}>
                {card.title}
              </h2>
              <p className="text-gray-600 mb-6">{card.description}</p>
              {card.component}
            </motion.div>
          ))}
        </motion.div>
      </main>
  
      <motion.footer
        className="py-10 bg-green-600 text-center text-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xl font-semibold tracking-wider">
          Powered by Phanindra and Expert Phytopathologists
        </p>
        <div className="mt-2 text-sm italic text-gray-200">
          Revolutionizing Agriculture for a Sustainable Future
        </div>
      </motion.footer>
    </>
  );
}

type AppLayoutProps = {
  children: ReactNode;
};

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-plant-background bg-cover bg-center relative">
      <div className="fixed top-0 left-0 z-50">
        <MenuBar />
      </div>
      <div className="flex-1 ml-20 w-full">{children}</div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Welcome page (default landing) */}
        <Route path="/" element={<Welcome />} />

        {/* Auth routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Main app routes with layout */}
        <Route
          path="/home"
          element={
            <AppLayout>
              <Home />
            </AppLayout>
          }
        />
        <Route
          path="/image-analysis"
          element={
            <AppLayout>
              <ImageAnalysis />
            </AppLayout>
          }
        />
        <Route
          path="/data-visualizer"
          element={
            <AppLayout>
              <DataVisualizer />
            </AppLayout>
          }
        />
        <Route
          path="/voice-assistant"
          element={
            <AppLayout>
              <VoiceAssistant />
            </AppLayout>
          }
        />
        <Route
          path="/community"
          element={
            <AppLayout>
              <Community />
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
