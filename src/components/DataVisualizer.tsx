import React, { useEffect, useState } from 'react';
import type { SoilData } from '../types';

export default function DataVisualizer() {
  const [weatherData, setWeatherData] = useState({
    temperature: 0,
    humidity: 0,
    rainfall: 0,
    date: new Date().toISOString().split('T')[0],
  });

  const API_KEY = '8146d8d78cfc9c3afbd9c3f8d6d2d5dd';
  const CITY_NAME = 'HYDERABAD'; // Replace with your desired city name.

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
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        setWeatherData({
          temperature: data.main.temp,
          humidity: data.main.humidity,
          rainfall: data.rain ? data.rain['1h'] || 0 : 0,
          date: new Date().toISOString().split('T')[0],
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Environmental Data</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Current Weather</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>{new Date(weatherData.date).toLocaleDateString()}</span>
              <div className="flex space-x-4">
                <span>{weatherData.temperature}°C</span>
                <span>{weatherData.humidity}%</span>
                <span>{weatherData.rainfall}mm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Soil Analysis</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Soil pH</span>
                <span>{soilData.ph}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(soilData.ph / 14) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Moisture</span>
                <span>{soilData.moisture}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${soilData.moisture}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Nutrients</h4>
              {Object.entries(soilData.nutrients).map(([nutrient, value]) => (
                <div key={nutrient}>
                  <div className="flex justify-between mb-1">
                    <span className="capitalize">{nutrient}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
