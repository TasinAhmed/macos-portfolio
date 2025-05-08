"use client";
import clsx from "clsx";
import { ReactNode, useEffect, useState } from "react";
import { useMacOSDateTime } from "../hooks/useMacOSDateTime";
import { useAppStore } from "@/hooks/useAppStore";
import { apps } from "@/configs/apps";
import { FaApple, FaWifi } from "react-icons/fa";
import { IoBatteryFullOutline } from "react-icons/io5";
import SwitchIcon from "@/public/switch.svg";
import { Popover } from "radix-ui";
import ControlCenter from "./ControlCenter";
import { motion } from "motion/react";

const Button = ({
  children,
  bold,
}: {
  children: ReactNode;
  bold?: boolean;
}) => {
  return (
    <span
      className={clsx(
        "h-full px-[8px] flex items-center justify-center",
        bold && "font-bold"
      )}
    >
      <div>{children}</div>
    </span>
  );
};

const MenuBar = ({
  showMenu,
  onClick,
}: {
  showMenu: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) => {
  const { date, time, ampm } = useMacOSDateTime();
  const {
    activeWindow,
    fullScreenWindows,
    transitionDuration,
    showLockscreen,
  } = useAppStore((state) => state);
  const [controlOpen, setControlOpen] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (showMenu) {
      setCurrentAnimation("enter");
    } else {
      setCurrentAnimation("exit");
    }
  }, [showMenu]);

  useEffect(() => {
    if (showLockscreen) setControlOpen(false);
  }, [showLockscreen]);

  return (
    <motion.div
      variants={{ enter: { top: 0 }, exit: { top: -34 } }}
      animate={currentAnimation}
      transition={{ duration: transitionDuration }}
      className="relative h-[34px] text-[14px] text-black dark:text-[rgba(255,255,255,0.9)]"
      onClick={onClick}
    >
      <div className="absolute left-0 top-0 h-full w-full bg-[#8F8F8F] mix-blend-color-burn opacity-[0.2]"></div>
      <div
        className={clsx(
          fullScreenWindows.size > 0
            ? "bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(14,14,14,0.8)]"
            : "bg-[rgba(255,255,255,0.4)] dark:bg-[rgba(79,79,79,0.2)]",
          "absolute left-0 top-0 h-full w-full backdrop-blur-[75px] dark:backdrop-blur-[32.5px]"
        )}
      ></div>
      <div className="absolute left-0 top-0 h-full w-full flex justify-between items-center px-[14px] py-[2px]">
        <div className="flex items-center h-full">
          <div className="px-[14px]">
            <FaApple size={18} />
          </div>
          {activeWindow && <Button bold>{apps.get(activeWindow)!.name}</Button>}
          <Button>File</Button>
          <Button>Edit</Button>
          <Button>View</Button>
          <Button>Help</Button>
        </div>
        <div className="flex h-full gap-[14px] items-center">
          <div className="flex items-center gap-[12px] h-full">
            <FaWifi />
            <IoBatteryFullOutline size={20} />
            <Popover.Root
              open={controlOpen}
              onOpenChange={(val) => setControlOpen(val)}
            >
              <Popover.Trigger
                className={clsx(
                  "px-2 h-full cursor-pointer rounded-[5px]",
                  controlOpen &&
                    "bg-[rgba(255,255,255,0.4)] dark:bg-[rgba(255,255,255,0.26)]"
                )}
              >
                <SwitchIcon className="h-[14px] dark:fill-[rgba(255,255,255,0.9)]" />
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content sideOffset={8} collisionPadding={8}>
                  <ControlCenter />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
          <div className="flex items-center gap-[10px]">
            <div>{date}</div>
            <div>
              {time} {ampm}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuBar;
