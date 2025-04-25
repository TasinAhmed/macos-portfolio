import {
  useMotionValue,
  useTransform,
  motion,
  MotionValue,
  useSpring,
} from "motion/react";
import React, { useRef } from "react";
import { useAppStore } from "../hooks/useAppStore";
import clsx from "clsx";
import Image from "next/image";

interface ItemType {
  id: string;
  src: string;
  size?: number;
  name: string;
}

const AppIcon = ({
  mouseX,
  data,
  active,
}: {
  mouseX: MotionValue<number>;
  data: ItemType;
  active: boolean;
}) => {
  const { windows, addWindow, setActiveWindow } = useAppStore((state) => state);

  const openWindow = (item: ItemType) => {
    if (windows.has(item.id)) {
      setActiveWindow(item.id);
      return;
    }

    addWindow(item.id, { title: item.name, id: item.id });
  };
  const ref = useRef<HTMLDivElement>(null);
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  const widthSync = useTransform(distance, [-100, 0, 100], [64, 100, 64]);
  const width = useSpring(widthSync, {
    damping: 15,
    mass: 0.1,
    stiffness: 200,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="aspect-square flex items-center justify-center pointer-events-auto relative"
      onClick={() => openWindow(data)}
    >
      <Image
        src={"/" + data.src}
        alt="Dock icon"
        width={0}
        height={0}
        style={{ height: data.size ? `${data.size}%` : "100%", width: "auto" }}
        quality={100}
        unoptimized={true}
      />
      <div
        className={clsx(
          "h-[4px] w-[4px] rounded-full absolute top-[102%] transition-opacity ease-in-out",
          active ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: "#000",
          backgroundBlendMode: "normal, overlay",
        }}
      ></div>
    </motion.div>
  );
};

const Dock = () => {
  const mouseX = useMotionValue(Infinity);
  const windows = useAppStore((state) => state.windows);
  const items: ItemType[] = [
    { id: "apps", src: "apps.svg", name: "Launchpad" },
    { id: "2048", src: "2048.png", name: "2048" },
    { id: "imessage", src: "message.svg", name: "iMessage" },
    { id: "notes", src: "notes.svg", name: "Notes" },
    { id: "photos", src: "photos.svg", name: "Photos" },
    { id: "calculator", src: "calculator.png", size: 84, name: "Calculator" },
    { id: "safari", src: "safari.svg", name: "Safari" },
    { id: "terminal", src: "terminal.png", name: "Terminal" },
    { id: "mail", src: "mail.svg", name: "Mail" },
    { id: "settings", src: "settings.svg", name: "Settings" },
    { id: "trash", src: "trash-light.svg", size: 86, name: "Trash" },
  ];

  return (
    <motion.div
      onMouseMove={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        mouseX.set(e.pageX);
      }}
      onMouseLeave={() => {
        mouseX.set(Infinity);
      }}
      className="z-2 absolute bottom-[4px] gap-[3px] left-1/2 -translate-x-1/2 h-[80px] pb-[8px] px-[5px] rounded-[24px] bg-[rgba(255,255,255,0.2)] border-[0.5px] border-solid border-[rgba(255,255,255,0.2)] backdrop-blur-[25px] flex items-end"
    >
      {items.slice(0, items.length - 2).map((item) => (
        <AppIcon
          active={windows.has(item.id)}
          key={item.id}
          mouseX={mouseX}
          data={item}
        />
      ))}
      <div className="w-[1px] h-[50px] ml-[10px] mr-[4px] mb-[7px] bg-[rgba(0,0,0,0.3)]"></div>
      {items.slice(items.length - 2).map((item) => (
        <AppIcon
          active={windows.has(item.id)}
          key={item.id}
          mouseX={mouseX}
          data={item}
        />
      ))}
    </motion.div>
  );
};

export default Dock;
