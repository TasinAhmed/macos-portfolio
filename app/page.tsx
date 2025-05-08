"use client";
import { useEffect, useRef, useState } from "react";
import Dock from "@/components/Dock";
import MenuBar from "@/components/MenuBar";
import Window from "@/components/Window";
import { motion } from "framer-motion";
import { useAppStore } from "@/hooks/useAppStore";
import Image from "next/image";
import { useTheme } from "next-themes";
import clsx from "clsx";
import InitialLoader from "@/components/InitialLoader";
import Lockscreen from "@/components/Lockscreen";
import WidgetGrid from "@/components/Widgets/WidgetGrid";
import DynamicIsland from "@/components/DynamicIsland";

const App = () => {
  const constraintsRef = useRef<HTMLDivElement | null>(null);
  const { windows, setActiveWindow, showLockscreen, fullScreenWindows } =
    useAppStore((state) => state);
  const refs = useRef<Map<string, React.RefObject<HTMLDivElement | null>>>(
    new Map()
  );
  const { theme } = useTheme();
  const [atBottom, setAtBottom] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const threshold = 80;
      const screenHeight = window.innerHeight;
      const mouseY = e.clientY;
      setAtBottom(mouseY >= screenHeight - threshold);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (fullScreenWindows.size > 0) {
      setIsFullScreen(true);
    } else {
      setIsFullScreen(false);
    }
  }, [fullScreenWindows]);

  const imgProps = {
    fill: true,
    quality: 100,
    unoptimized: true,
  };

  return (
    <div className="h-screen w-screen grid grid-rows-[auto_1fr] overflow-hidden">
      <InitialLoader />
      <Lockscreen />
      <Image
        src="/bg-dark.jpg"
        className={clsx(
          theme === "dark" ? "opacity-100" : "opacity-0",
          "desktop-img"
        )}
        alt={"Macos bg"}
        {...imgProps}
      />
      <Image
        src="/bg-light.jpg"
        alt={"Macos bg"}
        className={clsx(
          theme === "light" ? "opacity-100" : "opacity-0",
          "desktop-img"
        )}
        {...imgProps}
      />
      <MenuBar showMenu={!showLockscreen} />
      <motion.div
        className="relative"
        ref={constraintsRef}
        onClick={() => {
          setActiveWindow(null);
        }}
      >
        <WidgetGrid />
        {[...windows.values()].map((w) => (
          <Window
            key={w.id}
            dragConstraints={constraintsRef}
            data={w}
            dockIconRef={refs.current.get(w.id)!}
            Content={w.content}
          />
        ))}
      </motion.div>
      <DynamicIsland />
      <Dock
        refs={refs}
        showDock={
          (!showLockscreen && atBottom && isFullScreen) ||
          (!showLockscreen && !isFullScreen)
        }
      />
    </div>
  );
};

export default App;
