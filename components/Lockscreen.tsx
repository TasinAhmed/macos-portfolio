import { useAppStore } from "@/hooks/useAppStore";
import { useMacOSDateTime } from "@/hooks/useMacOSDateTime";
import clsx from "clsx";
import { Avatar } from "radix-ui";
import React, { useMemo, useRef } from "react";

const Lockscreen = () => {
  const { weekday, month, day, time24 } = useMacOSDateTime();
  const { showLockscreen, setShowLockscreen } = useAppStore((state) => state);
  const startupSound = useMemo(() => new Audio("/startup.wav"), []);
  const playedRef = useRef(false);

  const onClick = () => {
    setShowLockscreen(false);
    if (!playedRef.current) {
      startupSound.play();
      playedRef.current = true;
    }
  };

  return (
    <div
      className={clsx(
        "z-25 absolute top-0 left-0 w-full h-full flex flex-col justify-between items-center py-[150px]",
        !showLockscreen ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
      style={{ transition: "opacity 0.3s ease" }}
      onClick={onClick}
    >
      <div className="grid items-center justify-items-center text-[rgba(255,255,255,0.7)]">
        <div className="text-[24px]">
          {weekday}, {day} {month}
        </div>
        <div className="text-[100px] leading-none font-bold">{time24}</div>
      </div>
      <div className="grid justify-items-center">
        <Avatar.Root className="inline-flex size-[60px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
          <Avatar.Image src="/avatar.jpg" />
        </Avatar.Root>
        <div className="text-white font-bold mt-1">Tasin Ahmed</div>
        <div className="text-[12px] text-[rgba(255,255,255,0.6)] mt-2">
          Touch ID or Enter Password
        </div>
      </div>
    </div>
  );
};

export default Lockscreen;
