'use client'
import {use, useEffect, useState} from 'react'

interface WeatherData {
  CityName: string;
  description: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  pressure: number;
  visibility: number;
  sunrise: number;
  sunset: number;
}

export default function Home() {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [error,setError] = useState<string|null>(null);
  const [loading,setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<WeatherData | null>(null);


  useEffect(() => {
    fetch('/api/weather')
      .then(res => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then(data => setWeather(data))
      .catch(err => setError(err.message))
      .finally(()=> setLoading(false));

  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;

  

  const getIcon = (description: string) => {
    if (description.toLowerCase().includes('cloud')) return '☁️';
    if (description.toLowerCase().includes('rain')) return '🌧️';
    if (description.toLowerCase().includes('clear')) return '☀️';
    if (description.toLowerCase().includes('mist')) return '🌫️';
    return '🌥️';
  };

  const formatTime = (timestamp: number) => new Date(timestamp * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });


  return(
    <div 
      className="min-h-screen p-6" 
      style={{ 
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-lg">
          🌤️ Weather Dashboard
        </h1>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Overview</h2>
          <div className="flex justify-between text-gray-600">
            <span>Total Cities: <strong>{weather.length}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weather.map((item, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-blue-500 hover:bg-white/95" onClick={() => setSelectedCity(item)}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-800">{item.CityName}</h3>
                <span className="text-2xl">{getIcon(item.description)}</span>
              </div>
              <p className="text-gray-600 capitalize mb-2">{item.description}</p>
              <div className="text-3xl font-bold text-blue-600 mb-2">{item.temp}°C</div>
              <div className="text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Min: {item.tempMin}°C</span>
                  <span>Max: {item.tempMax}°C</span>
                </div>
                <div className="mt-1">Humidity: {item.humidity}%</div>
              </div>
            </div>
          ))}
        </div>


        {selectedCity && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedCity(null)}>
            <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedCity.CityName}</h2>
                <span className="text-3xl">{getIcon(selectedCity.description)}</span>
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{selectedCity.temp}°C</div>
              <p className="text-gray-600 capitalize mb-4">{selectedCity.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>Min: <strong>{selectedCity.tempMin}°C</strong></div>
                <div>Max: <strong>{selectedCity.tempMax}°C</strong></div>
                <div>Humidity: <strong>{selectedCity.humidity}%</strong></div>
                <div>Pressure: <strong>{selectedCity.pressure}hPa</strong></div>
                <div>Visibility: <strong>{selectedCity.visibility}km</strong></div>
                <div>Wind: <strong>{selectedCity.windSpeed}m/s</strong></div>
                <div>Sunrise: <strong>{formatTime(selectedCity.sunrise)}</strong></div>
                <div>Sunset: <strong>{formatTime(selectedCity.sunset)}</strong></div>
              </div>
              
              <button className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors" onClick={() => setSelectedCity(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>




  )
}