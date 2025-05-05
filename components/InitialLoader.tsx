import clsx from "clsx";
import { Progress } from "radix-ui";
import React, { useEffect, useState } from "react";
import { FaApple } from "react-icons/fa";

const InitialLoader = () => {
  const [progress, setProgress] = useState(0);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    let current = 0;
    const id = setInterval(() => {
      current += Math.random() * 2 + 0.3; // random small increment
      if (current >= 100) {
        current = 100;
        clearInterval(id);
        setTimeout(() => {
          setShowLoading(false);
        }, 500); // allow for full bar visual
      }
      setProgress(current);
    }, 25);

    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={clsx(
        "absolute top-0 left-0 h-screen w-screen bg-black flex flex-col items-center justify-center z-50",
        !showLoading ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
      style={{ transition: "opacity 0.7s ease" }}
    >
      <FaApple color="white" size={80} />
      <Progress.Root
        className="relative h-[4px] w-[200px] overflow-hidden rounded-full bg-[rgba(255,255,255,0.25)] mt-[60px]"
        style={{ transform: "translateZ(0)" }}
        value={progress}
      >
        <Progress.Indicator
          className="size-full bg-white transition-transform duration-[100ms] ease-linear"
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </Progress.Root>
    </div>
  );
};

export default InitialLoader;
