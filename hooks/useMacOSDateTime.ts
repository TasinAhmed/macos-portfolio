"use client";
import { useEffect, useState } from "react";

export function useMacOSDateTime() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000); // update every second

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" }); // Mon
    const month = date.toLocaleDateString("en-US", { month: "short" }); // Apr
    const day = date.getDate(); // 21

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    return {
      date: `${weekday} ${month} ${day}`,
      time: `${hours % 12 || 12}:${minutes}`,
      time24: `${hours}:${minutes}`,
      ampm,
      weekday,
      month,
      day,
    };
  };

  return formatDate(date);
}
