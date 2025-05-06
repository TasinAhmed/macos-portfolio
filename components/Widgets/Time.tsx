import React, { useEffect, useState } from "react";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";

const Time = () => {
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative p-[10px] widget clock aspect-square">
      <Clock
        value={value}
        renderMinuteMarks={false}
        renderNumbers={true}
        renderHourMarks={false}
        size="100%"
      />
    </div>
  );
};

export default Time;
