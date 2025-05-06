"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

interface WeatherData {
  current: {
    dt: number;
    temp: number;
    weather: { description: string; icon: string }[];
    wind_speed: number;
    wind_deg: number;
    humidity: number;
    visibility: number;
    pressure: number;
  };
  daily: {
    dt: number;
    temp: { max: number; min: number };
    weather: { description: string; icon: string }[];
  }[];
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/3.0/onecall?lat=47.9212&lon=106.9186&appid=${process.env.NEXT_PUBLIC_API_KEY}&units=metric`
      );
    
      setWeatherData(response.data);
      setLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching weather:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  }

  if (!weatherData) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Error fetching weather data</div>;
  }

  // Current weather
  const currentWeather = weatherData.current;
  const dailyForecast = weatherData.daily.slice(0, 5); // 5-day forecast

  // Format date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return `${date.toLocaleDateString('en-US', { weekday: 'short' })}, ${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row font-sans">
      {/* Left Panel: Current Weather */}
      <div className="w-full md:w-1/3 bg-gray-800 p-6 flex flex-col justify-between">
        <div>
          <div className="text-center">
            <img
              src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
              alt="Weather icon"
              className="mx-auto w-24 h-24"
            />
            <h1 className="text-6xl font-bold mt-4">{Math.round(currentWeather.temp)}°C</h1>
            <p className="text-xl mt-2 capitalize">{currentWeather.weather[0].description}</p>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-lg">TODAY • {formatDate(currentWeather.dt)}</p>
          <p className="text-lg mt-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="white" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            Ulaanbaatar
          </p>
        </div>
      </div>

      {/* Right panel: Forecast*/}
      <div className="w-full md:w-2/3 p-6 m-2">
        {/* 5 day forecast */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
          {dailyForecast.map((day, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-sm">{formatDate(day.dt)}</p>
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt="Weather icon"
                className="mx-auto w-12 h-12"
              />
              <p className="text-lg">{Math.round(day.temp.max)}°C</p>
              <p className="text-sm text-gray-400">{Math.round(day.temp.min)}°C</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}