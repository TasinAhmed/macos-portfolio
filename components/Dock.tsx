import {
  useMotionValue,
  useTransform,
  motion,
  MotionValue,
  useSpring,
} from "motion/react";
import React, { RefObject, useEffect, useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import { apps, ItemType } from "@/configs/apps";
import { Tooltip } from "radix-ui";
import { config } from "@/configs/config";
import { useWindowsStore } from "@/hooks/useWindowsStore";

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
  const { windows, addWindow, setActiveWindow } = useWindowsStore(
    (state) => state
  );

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

  const widthSync = useTransform(distance, [-100, 0, 100], [64, 80, 64]);
  const width = useSpring(widthSync, {
    damping: 15,
    mass: 0.1,
    stiffness: 200,
  });

  return (
    <Tooltip.Provider delayDuration={config.TRANSITION_DURATION * 1000}>
      <Tooltip.Root>
        <Tooltip.Trigger>
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
                "h-[4px] w-[4px] rounded-full absolute top-[102%] transition-opacity ease-in-out bg-black dark:bg-white",
                active ? "opacity-100" : "opacity-0"
              )}
              style={{
                backgroundBlendMode: "normal, overlay",
              }}
            ></div>
          </motion.div>
        </Tooltip.Trigger>
        <Tooltip.Content className="bg-[rgba(0,0,0,0.3)] rounded-[10px] py-[4px] px-[8px] text-[white] text-[13px]">
          {data.name}
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

const Dock = ({
  showDock,
  refs,
}: {
  showDock: boolean;
  refs: RefObject<Map<string, RefObject<HTMLDivElement | null>>>;
}) => {
  const items = [...apps.values()];
  const mouseX = useMotionValue(Infinity);
  const { windows } = useWindowsStore((state) => state);
  const [currentAnimation, setCurrentAnimation] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (showDock) {
      setCurrentAnimation("enter");
    } else {
      setCurrentAnimation("exit");
    }
  }, [showDock]);

  return (
    <motion.div
      variants={{
        enter: {
          bottom: 4,
        },
        exit: { bottom: -84 },
      }}
      animate={currentAnimation}
      onMouseMove={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        mouseX.set(e.pageX);
      }}
      onMouseLeave={() => {
        mouseX.set(Infinity);
      }}
      className={clsx(
        "z-2 absolute bottom-[4px] gap-[3px] left-1/2 -translate-x-1/2 h-[80px] pb-[8px] px-[5px] rounded-[24px] bg-[rgba(255,255,255,0.2)] dark:bg-[rgba(0,0,0,0.2)] border-[0.5px] border-solid border-[rgba(255,255,255,0.2)] backdrop-blur-[25px] flex items-end"
      )}
      transition={{ duration: config.TRANSITION_DURATION }}
    >
      {items.slice(0, items.length - 1).map((item) => (
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
      <div className="w-[1px] h-[50px] ml-[8px] mr-[8px] mb-[7px] bg-[rgba(0,0,0,0.3)] dark:bg-[rgba(255,255,255,0.3)]"></div>
      {items.slice(items.length - 1).map((item) => (
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
