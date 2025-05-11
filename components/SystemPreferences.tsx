import { useAppStore } from "@/hooks/useAppStore";
import clsx from "clsx";
import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const SystemPreferences = () => {
  const { theme, setTheme } = useTheme();
  const { wallpaper, setWallpaper } = useAppStore((state) => state);
  const [cols, setCols] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      const newCols = width > 800 ? 3 : 2;
      setCols(newCols);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative overflow-y-auto h-full">
      <div className="absolute w-full top-0 left-0 p-6">
        <div className="flex justify-center gap-[16px] mb-6">
          <div
            className={clsx(
              "grid justify-items-center cursor-pointer gap-[4px]",
              theme === "light"
                ? "text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.9)] font-bold"
                : "text-[rgba(0,0,0,0.4)] dark:text-[rgba(255,255,255,0.4)]"
            )}
            onClick={() => setTheme("light")}
          >
            <Image
              src="/light.png"
              width={100}
              height={100}
              alt=""
              className={clsx(
                "rounded-[10px] border-4",
                theme === "light" && "border-[#027aff]"
              )}
            />
            <div>Light</div>
          </div>
          <div
            className={clsx(
              "grid justify-items-center cursor-pointer gap-[4px]",
              theme === "dark"
                ? "text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.9)] font-bold"
                : "text-[rgba(0,0,0,0.4)] dark:text-[rgba(255,255,255,0.4)]"
            )}
            onClick={() => setTheme("dark")}
          >
            <Image
              src="/dark.png"
              width={100}
              height={100}
              alt=""
              className={clsx(
                "rounded-[10px] border-4",
                theme === "dark" && "border-[#027aff]"
              )}
            />
            <div>Dark</div>
          </div>
        </div>
        <div
          className="grid gap-[10px]"
          ref={containerRef}
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {[...Array(8).keys()].map((_, index) => (
            <div
              key={index}
              className={clsx(
                "aspect-video relative rounded-[16px] border-4 cursor-pointer overflow-hidden",
                wallpaper === index + 1
                  ? "border-[#027aff]"
                  : "border-transparent"
              )}
              onClick={() => setWallpaper(index + 1)}
            >
              <Image
                key={`${index}-${theme}`} // re-renders on theme change
                src={`/wallpapers/${index + 1}-${theme}.jpg`}
                alt=""
                fill
                className="transition-opacity duration-300 opacity-100 animate-fade"
                priority
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemPreferences;
