import { useEffect, useState } from 'react';
import type { SoilData } from '../types';
import { motion } from 'framer-motion';
export default function DataVisualizer() {
  const [weatherData, setWeatherData] = useState({
    temperature: 0,
    humidity: 0,
    rainfall: 0,
    condition: '',
    icon: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [forecastData, setForecastData] = useState<{ day: string; temp: string; icon: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [city, setCity] = useState('Hyderabad');

  const API_KEY = '8146d8d78cfc9c3afbd9c3f8d6d2d5dd';

  const soilData: SoilData = {
    ph: 6.5,
    moisture: 35,
    nutrients: {
      nitrogen: 45,
      phosphorus: 30,
      potassium: 25,
    },
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        setWeatherData({
          temperature: data.main.temp,
          humidity: data.main.humidity,
          rainfall: data.rain?.['1h'] || 0,
          condition: data.weather?.[0]?.description,
          icon: data.weather?.[0]?.icon,
          date: new Date().toISOString().split('T')[0],
        });
        setError('');
      } catch (err) {
        setError('Failed to fetch weather data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const fetchForecastData = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        const daily = data.list.filter((_: any, index: number) => index % 8 === 0).slice(0, 7);
        const mapped = daily.map((item: any) => ({
          day: new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short' }),
          temp: item.main.temp.toFixed(1),
          icon: item.weather[0].icon,
        }));
        setForecastData(mapped);
      } catch (err) {
        console.error('Forecast fetch failed:', err);
      }
    };

    fetchWeatherData();
    fetchForecastData();
  }, [city]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const convertTemp = (temp: number | string) => {
    const num = parseFloat(temp as string);
    return unit === 'C' ? `${num.toFixed(1)}°C` : `${((num * 9) / 5 + 32).toFixed(1)}°F`;
  };

  const getSoilSuggestion = () => {
    const { ph, moisture } = soilData;
    if (ph < 5.5) return 'Soil is too acidic. Consider liming.';
    if (ph > 7.5) return 'Soil is too alkaline. Consider adding sulfur.';
    if (moisture < 30) return 'Soil is dry. Irrigation recommended.';
    if (moisture > 70) return 'Soil is too wet. Improve drainage.';
    return 'Soil is healthy for most crops!';
  };

  const getCropSuggestion = () => {
    const { temperature, rainfall, humidity } = weatherData;
    const { ph, moisture } = soilData;

    if (temperature > 30 && rainfall < 10 && ph >= 6 && ph <= 7) return '🌽 Suggested Crop: Maize';
    if (temperature >= 25 && rainfall >= 50 && moisture > 30) return '🌾 Suggested Crop: Rice';
    if (ph >= 6.0 && ph <= 7.5 && moisture >= 30 && moisture <= 60) return '🥔 Suggested Crop: Potato';
    if (humidity < 40 && ph >= 6.0) return '🌻 Suggested Crop: Sunflower';

    return '🌿 Suggested Crop: Any general-purpose vegetable like Tomato or Spinach';
  };

  const nutrientTips = {
    nitrogen: 'Boosts leaf growth.',
    phosphorus: 'Enhances root & flower growth.',
    potassium: 'Improves overall plant health.',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} rounded-lg shadow-2xl p-6 transition duration-300`}
    >
      <div className="flex justify-between items-center mb-4">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold tracking-tight"
        >
          🌿 Environmental Dashboard
        </motion.h2>
  
        <motion.div className="flex gap-3 items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="text-sm bg-white dark:bg-gray-800 border px-2 py-1 rounded shadow-sm hover:scale-105 transition-transform"
          >
            {['Hyderabad', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800 transition-all transform hover:scale-105"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </motion.div>
      </div>
  
      {loading ? (
        <motion.div
          className="text-center py-6 text-gray-500"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Fetching live weather data...
        </motion.div>
      ) : error ? (
        <motion.div className="text-red-600 font-medium" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
          {error}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weather Section */}
          <motion.div
            className="border rounded-lg p-4 bg-gray-100 dark:bg-gray-800"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">🌦️ Current Weather</h3>
              <button
                onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-transform hover:scale-105"
              >
                Show in °{unit === 'C' ? 'F' : 'C'}
              </button>
            </div>
  
            <div className="flex items-center gap-4 mb-3">
              {weatherData.icon && (
                <motion.img
                  src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                  alt="Weather Icon"
                  className="w-14 h-14"
                  whileHover={{ scale: 1.2 }}
                />
              )}
              <div className="text-sm capitalize">{weatherData.condition}</div>
            </div>
  
            <div className="space-y-1 text-sm">
              <div>Date: {new Date(weatherData.date).toLocaleDateString()}</div>
              <div>Temperature: {convertTemp(weatherData.temperature)}</div>
              <div>Humidity: {weatherData.humidity}%</div>
              <div>Rainfall: {weatherData.rainfall} mm</div>
            </div>
  
            <div className="mt-4">
              <h4 className="font-medium mb-2">🔮 Weekly Forecast</h4>
              <div className="grid grid-cols-7 text-center gap-1 text-xs">
                {forecastData.map((day, index) => (
                  <motion.div
                    key={day.day}
                    className="bg-white dark:bg-gray-700 p-2 rounded shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="font-bold">{day.day}</div>
                    <img src={`https://openweathermap.org/img/wn/${day.icon}.png`} alt="" className="mx-auto w-8" />
                    <div>{convertTemp(day.temp)}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
  
          {/* Soil Section */}
          <motion.div
            className="border rounded-lg p-4 bg-gray-100 dark:bg-gray-800"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-3">🌱 Soil Health</h3>
            <div className="space-y-4 text-sm">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Soil pH</span>
                  <span>{soilData.ph}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <motion.div
                    className="bg-green-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(soilData.ph / 14) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
  
              <div>
                <div className="flex justify-between mb-1">
                  <span>Moisture</span>
                  <span>{soilData.moisture}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${soilData.moisture}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
  
              <div className="space-y-2">
                <h4 className="font-medium">Nutrient Levels</h4>
                {Object.entries(soilData.nutrients).map(([key, value], idx) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1 capitalize">
                      <span>{key}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <motion.div
                        className="bg-yellow-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ delay: idx * 0.2 }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{nutrientTips[key as keyof typeof nutrientTips]}</div>
                  </div>
                ))}
              </div>
  
              <motion.div
                className="mt-4 p-3 bg-green-100 dark:bg-green-900 rounded text-green-800 dark:text-green-200 text-sm space-y-2"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div>💡 <strong>Soil Suggestion:</strong> {getSoilSuggestion()}</div>
                <div>🌾 <strong>Crop Suggestion:</strong> {getCropSuggestion()}</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
