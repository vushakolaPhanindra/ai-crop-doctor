import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import bgImage from '../assets/bg-signin.jpg';
function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success !== false) {
        // Optional: Store user data if available
        const name = data.username || data.name || data.displayName || data.email || 'User';
        const photo = data.photoURL || 'https://i.pravatar.cc/40?img=4';
        localStorage.setItem('user', JSON.stringify({ username: name, photoURL: photo }));

        // ✅ Redirect to /home instead of /
        navigate('/home');
      } else {
        setErrorMsg(data.message || 'Login failed ❌');
      }
    } catch (error) {
      setErrorMsg('Server error. Please try again later.');
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0"></div>

      {/* Sign In Form */}
      <motion.form
        onSubmit={handleSignIn}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold mb-6 text-center text-green-700"
        >
          🌿 Sign In
        </motion.h2>

        {errorMsg && <p className="text-red-500 mb-4 text-center">{errorMsg}</p>}

        <div className="relative mb-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer w-full px-4 pt-5 pb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <label className="absolute text-gray-500 left-4 top-2 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm">
            Email
          </label>
        </div>

        <div className="relative mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="peer w-full px-4 pt-5 pb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <label className="absolute text-gray-500 left-4 top-2 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm">
            Password
          </label>
        </div>

        <div className="flex justify-end mb-6">
          <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg shadow hover:bg-green-700 transition-all duration-300"
        >
          Sign In
        </motion.button>

        <p className="mt-6 text-center text-gray-700">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-green-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.form>
    </div>
  );
}

export default SignIn;
