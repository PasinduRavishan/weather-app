import { NextResponse } from "next/server";
import axios from "axios";
import path from "path";
import fs from 'fs/promises'
import { env } from "process";



interface City {
    CityCode : number;
    CityName : string;
    
}
interface WeatherData{
    CityName : string;
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

let cachedData: {data:WeatherData[], timestamp:number} | null = null;
const expTime:number = 5*60*1000;

export async function GET(){

    if (cachedData && Date.now()-cachedData.timestamp < expTime){
        console.log('Data from Cache...');
        return NextResponse.json(cachedData.data);
    }

    try{
        const filePath = path.join(process.cwd(),'data','cities.json');
        const cityData = await fs.readFile(filePath,'utf-8');
        const cities: City[] = JSON.parse(cityData).List;
        
        // console.log(cities);
        

        if (!cities.length){
            return NextResponse.json({error : 'No cities'},{status:400});
        }

        const weatherPromises = cities.map(async (city) => {
        // console.log('API KEY:', env.OPENWEATHER_API_KEY);
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?id=${city.CityCode}&units=metric&appid=${env.OPENWEATHER_API_KEY}`
        );
        const item = response.data;
        return {
            CityName: item.name,
            description: item.weather[0].description,
            temp: item.main.temp,
            tempMin: item.main.temp_min,
            tempMax: item.main.temp_max,
            humidity: item.main.humidity,
            windSpeed: item.wind.speed,
            windDeg: item.wind.deg,
            pressure: item.main.pressure,
            visibility: item.visibility / 1000,
            sunrise: item.sys.sunrise,
            sunset: item.sys.sunset,
        };
        }); 

        const weatherData: WeatherData[] = await Promise.all(weatherPromises);
        console.log(weatherData);

        cachedData = {data: weatherData, timestamp:Date.now()};
        console.log('Fetched fresh data');
        return NextResponse.json(weatherData);




    }catch(error){
        console.error(error);
        return NextResponse.json({error: 'Fetch failed'},{status:500});

    }





}