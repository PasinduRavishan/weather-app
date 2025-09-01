'use client'
import {use, useEffect, useState} from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'

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


  const { user, error: authError, isLoading: authLoading } = useUser();
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [error,setError] = useState<string|null>(null);
  const [loading,setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<WeatherData | null>(null);
  const [authErrorMsg, setAuthErrorMsg] = useState<string | null>(null);




  useEffect(() => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const authError = urlParams.get('auth_error') || urlParams.get('error');
    const authErrorDescription = urlParams.get('auth_error_description') || urlParams.get('error_description');
    
    

    if (window.location.pathname === '/api/auth/callback' && authError) {
      
      window.location.href = `/?auth_error=${encodeURIComponent(authError)}&auth_error_description=${encodeURIComponent(authErrorDescription || '')}`;
      return;

    }
    


    if (authError && authErrorDescription) {
      if (authErrorDescription.includes('careers@fidenz.com')) {
        setAuthErrorMsg('Sign-up is restricted to careers@fidenz.com email addresses only. Please use your Fidenz email to sign up or sign in.');
      } else {
        setAuthErrorMsg(authErrorDescription);
      }
      
      
      window.history.replaceState({}, document.title, window.location.pathname);
    }


  }, []);

  useEffect(() => {
    
    if (user && !loading && weather.length === 0) {
      setLoading(true);
      fetch('/api/weather')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch weather data');
          return res.json();
        })
        .then(data => setWeather(data))
        .catch(err => setError(err.message))
        .finally(()=> setLoading(false));
    }


  }, [user, loading, weather.length]);

  if (authLoading) {

    return (

      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ 

          backgroundImage: "url('/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="text-white text-lg sm:text-xl text-center px-4">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ 

          backgroundImage: "url('/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 sm:p-8 text-center max-w-md mx-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">🌤️ Weather Dashboard</h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">Sign in to access weather data</p>
          
          {authErrorMsg && (
            <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-600 font-semibold mb-2 text-sm sm:text-base">Authentication Error</div>
              <p className="text-xs sm:text-sm text-red-800">{authErrorMsg}</p>
            </div>
          )}

          <a
            href="/api/auth/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold inline-block text-sm sm:text-base"
            onClick={() => setAuthErrorMsg(null)}
          >
            Sign In
          </a>
          
          {authErrorMsg && (
            <div className="mt-4">
              <button
                onClick={() => setAuthErrorMsg(null)}
                className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm underline"
              >
                Dismiss Error
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ 

          backgroundImage: "url('/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="text-white text-lg sm:text-xl text-center px-4">Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ 
          
          backgroundImage: "url('/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 sm:p-8 text-center max-w-md mx-4">
          <h2 className="text-lg sm:text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetch('/api/weather')
                .then(res => {
                  if (!res.ok) throw new Error('Failed to fetch weather data');
                  return res.json();
                })
                .then(data => setWeather(data))
                .catch(err => setError(err.message))
                .finally(()=> setLoading(false));
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  

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
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
            🌤️ Weather Dashboard
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-white">
            <div className="flex items-center gap-2 text-sm sm:text-base">
              {user.picture && (
                <img src={user.picture} alt="Profile" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
              )}
              <span className="truncate max-w-[200px] sm:max-w-none">
                Welcome, {user.name || user.email}!
              </span>
            </div>
            <a
              href="/api/auth/logout"
              className="bg-blue-500 hover:bg-blue-600 px-3 py-2 sm:px-4 sm:py-2 rounded transition-colors text-sm sm:text-base text-center"
            >
              Logout
            </a>
          </div>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Overview</h2>
          <div className="flex flex-col sm:flex-row sm:justify-between text-gray-600 gap-2">
            <span>Total Cities: <strong>{weather.length}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {weather.map((item, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-blue-500 hover:bg-white/95" onClick={() => setSelectedCity(item)}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate mr-2">{item.CityName}</h3>
                <span className="text-xl sm:text-2xl">{getIcon(item.description)}</span>
              </div>
              <p className="text-gray-600 capitalize mb-2 text-sm sm:text-base">{item.description}</p>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{item.temp}°C</div>
              <div className="text-xs sm:text-sm text-gray-500">
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
            <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl w-full max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 truncate mr-2">{selectedCity.CityName}</h2>
                <span className="text-2xl sm:text-3xl flex-shrink-0">{getIcon(selectedCity.description)}</span>
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">{selectedCity.temp}°C</div>
              <p className="text-gray-600 capitalize mb-4 text-sm sm:text-base">{selectedCity.description}</p>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div>Min: <strong>{selectedCity.tempMin}°C</strong></div>
                <div>Max: <strong>{selectedCity.tempMax}°C</strong></div>
                <div>Humidity: <strong>{selectedCity.humidity}%</strong></div>
                <div>Pressure: <strong>{selectedCity.pressure}hPa</strong></div>
                <div>Visibility: <strong>{selectedCity.visibility}km</strong></div>
                <div>Wind: <strong>{selectedCity.windSpeed}m/s</strong></div>
                <div>Sunrise: <strong>{formatTime(selectedCity.sunrise)}</strong></div>
                <div>Sunset: <strong>{formatTime(selectedCity.sunset)}</strong></div>
              </div>
              
              <button className="mt-4 sm:mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors text-sm sm:text-base" onClick={() => setSelectedCity(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>




  )
}