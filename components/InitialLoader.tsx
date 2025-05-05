import useAudio from "@/hooks/useAudio";
import clsx from "clsx";
import { Progress } from "radix-ui";
import React, { useEffect, useState } from "react";
import { FaApple } from "react-icons/fa";

const InitialLoader = () => {
  const [progress, setProgress] = useState(13);
  const [showLoading, setShowLoading] = useState(true);
  const startupSound = useAudio("/startup.wav");

  useEffect(() => {
    const steps = [30, 60, 90, 100];
    const interval = 400;
    let index = 0;

    const id = setInterval(() => {
      setProgress(steps[index]);
      index++;

      if (index === steps.length) {
        clearInterval(id);
        setTimeout(() => {
          setShowLoading(false);
          startupSound.toggle();
        }, 100);
      }
    }, interval);

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
        style={{
          // Fix overflow clipping in Safari
          // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
          transform: "translateZ(0)",
        }}
        value={progress}
      >
        <Progress.Indicator
          className="ease-[cubic-bezier(0.65, 0, 0.35, 1)] size-full bg-white transition-transform duration-[660ms]"
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </Progress.Root>
    </div>
  );
};

export default InitialLoader;
