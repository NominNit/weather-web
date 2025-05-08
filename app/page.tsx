"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface WeatherData {
  current: {
    dt: number;
    temp: number;
    weather: { description: string; icon: string }[];
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
  const [city, setCity] = useState("ulaanbaatar");

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
        console.error(
          "Error fetching weather:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Error fetching weather data
      </div>
    );
  }

  // Current weather, 5-day
  const currentWeather = weatherData.current;
  const dailyForecast = weatherData.daily.slice(0, 5);

  // Date format
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return `${date.toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "Asia/Ulaanbaatar",
    })}, ${date.getDate()} ${date.toLocaleDateString("en-US", {
      month: "short",
      timeZone: "Asia/Ulaanbaatar",
    })}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row font-sans">
      {/* Left: Current */}
      <div className="w-full md:w-1/3 bg-gray-800 p-6 flex flex-col justify-between">
        <div>
          <div className="text-center">
            <img
              src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`}
              className="mx-auto w-24 h-24"
            />
            <h1 className="text-6xl font-bold mt-4">
              {Math.round(currentWeather.temp)}°C
            </h1>
            <p className="text-xl mt-2 capitalize">
              {currentWeather.weather[0].description}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-lg">TODAY • {formatDate(currentWeather.dt)}</p>
          <p className="text-lg mt-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 200"
              className="w-10 h-10 mr-2">
              <path
                fill="white"
                d="M100.232 149.198c-2.8 0-5.4-1.8-7.2-5.2-22.2-41-22.4-41.4-22.4-41.6-3.2-5.1-4.9-11.3-4.9-17.6 0-19.1 15.5-34.6 34.6-34.6s34.6 15.5 34.6 34.6c0 6.5-1.8 12.8-5.2 18.2 0 0-1.2 2.4-22.2 41-1.9 3.4-4.4 5.2-7.3 5.2zm.1-95c-16.9 0-30.6 13.7-30.6 30.6 0 5.6 1.5 11.1 4.5 15.9.6 1.3 16.4 30.4 22.4 41.5 2.1 3.9 5.2 3.9 7.4 0 7.5-13.8 21.7-40.1 22.2-41 3.1-5 4.7-10.6 4.7-16.3-.1-17-13.8-30.7-30.6-30.7z"
              />
              <path
                fill="white"
                d="M100.332 105.598c-10.6 0-19.1-8.6-19.1-19.1s8.5-19.2 19.1-19.2c10.6 0 19.1 8.6 19.1 19.1s-8.6 19.2-19.1 19.2zm0-34.3c-8.3 0-15.1 6.8-15.1 15.1s6.8 15.1 15.1 15.1 15.1-6.8 15.1-15.1-6.8-15.1-15.1-15.1z"
              />
            </svg>
            Ulaanbaatar
          </p>
        </div>
      </div>

      {/* Right: 5-day forecast */}
      <div className="w-full md:w-2/3 p-6 m-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {dailyForecast.map((day, index) => (
            <div className="bg-gray-800 p-4 rounded-lg text-center" key={index}>
              <p className="text-sm">{formatDate(day.dt)}</p>
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                className="mx-auto w-12 h-12"
              />
              <p className="text-lg">{Math.round(day.temp.max)}°C</p>
              <p className="text-sm text-gray-400">
                {Math.round(day.temp.min)}°C
              </p>
              <p className="text-sm pt-8 capitalize">
                {day.weather[0].description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
