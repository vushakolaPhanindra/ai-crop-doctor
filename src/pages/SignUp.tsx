import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import bgImage from '../assets/bg-signup.jpg';
export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate(); // hook for redirection

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/signup', {
        email,
        password,
        username
      });

      alert(response.data.message || 'Sign up successful!');
      console.log('User ID:', response.data.user?.id);

      // Clear input fields
      setEmail('');
      setPassword('');
      setUsername('');

      // Redirect to SignIn page
      navigate('/signin');
    } catch (error: any) {
      console.error('Error signing up:', error);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Something went wrong. Please try again.';
        alert(message);
      } else {
        alert('Unexpected error occurred.');
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center text-green-700 mb-6"
        >
          🌱 Sign Up
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-semibold text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              required
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:bg-green-700 transition-all duration-300"
          >
            Sign Up
          </motion.button>

          <p className="text-center text-sm mt-4 text-gray-700">
            Already have an account?{' '}
            <Link to="/signin" className="text-green-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
