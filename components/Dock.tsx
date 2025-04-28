import {
  useMotionValue,
  useTransform,
  motion,
  MotionValue,
  useSpring,
} from "motion/react";
import React, { RefObject, useEffect, useState } from "react";
import { useAppStore } from "../hooks/useAppStore";
import clsx from "clsx";
import Image from "next/image";
import { apps, ItemType } from "@/configs/apps";

const AppIcon = ({
  mouseX,
  data,
  active,
  iconRef,
}: {
  mouseX: MotionValue<number>;
  data: ItemType;
  active: boolean;
  iconRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const { windows, addWindow, setActiveWindow } = useAppStore((state) => state);

  const openWindow = (item: ItemType) => {
    if (windows.has(item.id)) {
      setActiveWindow(item.id);
      return;
    }

    addWindow(item.id);
  };

  const distance = useTransform(mouseX, (val) => {
    const bounds = iconRef?.current?.getBoundingClientRect() ?? {
      x: 0,
      width: 0,
    };
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
      ref={iconRef}
      style={{ width }}
      className="aspect-square flex items-center justify-center pointer-events-auto relative"
      onClick={() => {
        openWindow(data);
      }}
    >
      <Image
        src={"/Dock/" + data.src}
        alt="Dock icon"
        width={0}
        height={0}
        style={{
          height: data.iconSize ? `${data.iconSize}%` : "100%",
          width: "auto",
        }}
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

const Dock = ({
  refs,
}: {
  refs: RefObject<Map<string, RefObject<HTMLDivElement | null>>>;
}) => {
  const items = [...apps.values()];
  const mouseX = useMotionValue(Infinity);
  const { windows, fullScreenWindows, transitionDuration } = useAppStore(
    (state) => state
  );
  const [currentAnimation, setCurrentAnimation] = useState<
    string | undefined
  >();
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

  useEffect(() => {
    if (isFullScreen) {
      setCurrentAnimation("exit");
    } else {
      setCurrentAnimation("enter");
    }
    if (atBottom && isFullScreen) {
      setCurrentAnimation("enter");
    }
  }, [isFullScreen, atBottom]);

  return (
    <motion.div
      variants={{
        enter: {
          bottom: 4,
        },
        exit: {
          bottom: -84,
        },
      }}
      animate={currentAnimation}
      onMouseMove={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        mouseX.set(e.pageX);
      }}
      onMouseLeave={() => {
        mouseX.set(Infinity);
      }}
      className={clsx(
        "z-2 absolute bottom-[4px] gap-[3px] left-1/2 -translate-x-1/2 h-[80px] pb-[8px] px-[5px] rounded-[24px] bg-[rgba(255,255,255,0.2)] border-[0.5px] border-solid border-[rgba(255,255,255,0.2)] backdrop-blur-[25px] flex items-end"
      )}
      transition={{ duration: transitionDuration }}
    >
      {items.slice(0, items.length - 2).map((item) => (
        <AppIcon
          iconRef={
            refs.current.get(item.id) ||
            (refs.current.set(item.id, React.createRef()) &&
              refs.current.get(item.id)!)
          } // Dynamically assign ref
          active={windows.has(item.id)}
          key={item.id}
          mouseX={mouseX}
          data={item}
        />
      ))}
      <div className="w-[1px] h-[50px] ml-[10px] mr-[4px] mb-[7px] bg-[rgba(0,0,0,0.3)]"></div>
      {items.slice(items.length - 2).map((item) => (
        <AppIcon
          iconRef={
            refs.current.get(item.id) ||
            (refs.current.set(item.id, React.createRef()) &&
              refs.current.get(item.id)!)
          } // Dynamically assign ref
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
