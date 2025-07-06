import { Leaf as LeafIcon, Mic, Brain, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import bgImage from '../assets/bg-welcome.jpg'; // ✅ Import your image

function Welcome() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-0"></div>

      {/* Floating green blur */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200 opacity-30 rounded-full blur-3xl animate-pulse z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <LeafIcon className="h-20 w-20 text-green-600 mb-6" />
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-green-800 drop-shadow-sm">
          Welcome to <span className="text-green-600">AI-Crop-Doctor</span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto"
        >
          Empowering farmers with AI tools for smarter, healthier crops. Diagnose diseases, get voice help, and analyze field data effortlessly.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSignIn}
          className="mt-10 px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-green-700 transition duration-300"
        >
          🌾 Sign In to Get Started
        </motion.button>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-14 grid gap-6 sm:grid-cols-3 text-gray-800 z-10"
      >
        <div className="flex flex-col items-center">
          <Search className="h-10 w-10 text-green-500 mb-2" />
          <p className="text-lg font-medium">Disease Detection</p>
        </div>
        <div className="flex flex-col items-center">
          <Mic className="h-10 w-10 text-green-500 mb-2" />
          <p className="text-lg font-medium">Voice Assistance</p>
        </div>
        <div className="flex flex-col items-center">
          <Brain className="h-10 w-10 text-green-500 mb-2" />
          <p className="text-lg font-medium">AI-Powered Analytics</p>
        </div>
      </motion.div>

      {/* Floating leaf for aesthetics */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute bottom-10 right-10 opacity-10 z-0"
      >
        <LeafIcon className="w-16 h-16 text-green-400" />
      </motion.div>
    </div>
  );
}

export default Welcome;
