"use client";
import { useRef } from "react";
import Dock from "@/components/Dock";
import MenuBar from "@/components/MenuBar";
import Window from "@/components/Window";
import { motion } from "framer-motion";
import { useAppStore } from "@/hooks/useAppStore";
import Image from "next/image";
import ControlCenter from "@/components/ControlCenter";

const App = () => {
  const constraintsRef = useRef<HTMLDivElement | null>(null);
  const { windows, setActiveWindow } = useAppStore((state) => state);
  const refs = useRef<Map<string, React.RefObject<HTMLDivElement | null>>>(
    new Map()
  );

  return (
    <div className="h-screen w-screen grid grid-rows-[auto_1fr] overflow-hidden">
      <Image
        src="/bg-light.jpg"
        fill
        alt="Macos bg"
        className="object-cover object-center pointer-events-none"
        quality={100}
        unoptimized={true}
      />
      <MenuBar onClick={() => setActiveWindow(null)} />
      <motion.div
        className="relative"
        ref={constraintsRef}
        onClick={() => {
          setActiveWindow(null);
        }}
      >
        <ControlCenter />
        {[...windows.values()].map((w) => (
          <Window
            key={w.id}
            dragConstraints={constraintsRef}
            data={w}
            dockIconRef={refs.current.get(w.id)!}
          />
        ))}
      </motion.div>
      <Dock refs={refs} />
    </div>
  );
};

export default App;
