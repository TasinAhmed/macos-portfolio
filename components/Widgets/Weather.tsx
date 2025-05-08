"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { config } from "@/configs/config";
import Image from "next/image";

const isNightTime = (dt: number, sunrise: number, sunset: number): boolean => {
  return dt < sunrise || dt > sunset;
};

const getAppleStyleIconLabel = (code: number, isNight: boolean): string => {
  if (code >= 200 && code <= 232) return "thunderstorm";

  if (code >= 300 && code <= 321) {
    return isNight ? "drizzle-night" : "drizzle";
  }

  if (code >= 500 && code <= 504) return "rain";
  if (code === 511) return "freezing-rain";
  if (code >= 520 && code <= 531) return "heavy-rain";

  if (code >= 600 && code <= 602) return "snow";
  if (code >= 611 && code <= 616) return "freezing-rain";
  if (code >= 620 && code <= 622) return "blizzard";

  if (code === 701) return "Haze";
  if ([711, 721, 741].includes(code)) return "fog";
  if ([731, 751, 761, 762].includes(code)) return "windy";
  if ([771, 781].includes(code)) return "thunderstorm";

  if (code === 800) return isNight ? "clear-night" : "clear";
  if (code === 801 || code === 802)
    return isNight ? "partly-cloudy-night" : "partly-cloudy";
  if (code === 803 || code === 804) return "cloudy";

  return "clear";
};

interface HourlyWeather {
  dt: number;
  weather: { id: number }[];
  sunrise: number;
  sunset: number;
  temp: number;
}

export const formatHour = (dt: number): string => {
  const date = new Date(dt * 1000);
  let hour = date.getHours(); // 0–23
  const isPM = hour >= 12;

  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${hour}${isPM ? "PM" : "AM"}`;
};

const Weather = () => {
  const fetchWeatherData = async () => {
    const res = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${config.LATTITUDE}&lon=${config.LONGITUDE}&exclude=alerts,daily,minutely&appid=${config.WEATHER_API_KEY}&units=metric`
    );
    return res.data;
  };

  const { data } = useQuery({
    queryKey: ["weather"],
    queryFn: fetchWeatherData,
    refetchInterval: 3600000,
  });

  return (
    <div
      className="col-span-2 widget p-[16px] row-start-2"
      style={{
        background: isNightTime(
          data?.current.dt,
          data?.current.sunrise,
          data?.current.sunset
        )
          ? "linear-gradient(180deg, #020518 0%, #283555 100%)"
          : "linear-gradient(180deg, #074A8E 0%, #5596D8 100%)",
      }}
    >
      {data && (
        <div className="grid gap-[16px] text-white">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-[15px]">Toronto</div>
              <div className="text-[45px] leading-[45px]">
                {Math.ceil(data.current.temp)}&deg;
              </div>
            </div>
            <div className="flex flex-col items-end gap-[6px]">
              <Image
                width={25}
                height={25}
                src={`/weather/${getAppleStyleIconLabel(
                  data.current?.weather[0]?.id,
                  isNightTime(
                    data.current?.dt,
                    data.current?.sunrise,
                    data.current?.sunset
                  )
                )}.png`}
                alt="Weather icon"
              />
              <div className="text-[14px]">
                {data.current?.weather[0]?.main}
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            {data.hourly.slice(0, 6).map((d: HourlyWeather, index: number) => (
              <div key={index} className="grid justify-items-center gap-[6px]">
                <div className="text-[13px] text-[rgba(255,255,255,0.8)]">
                  {formatHour(d.dt)}
                </div>
                <Image
                  width={25}
                  height={25}
                  src={`/weather/${getAppleStyleIconLabel(
                    d.weather[0]?.id,
                    isNightTime(d.dt, d.sunrise, d.sunset)
                  )}.png`}
                  alt="Weather icon"
                />
                <div className="text-[14px] font-bold">
                  {Math.ceil(d.temp)}&deg;
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
