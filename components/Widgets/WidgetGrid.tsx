import React from "react";
import Time from "./Time";
import Calendar from "./Calendar";
import { useAppStore } from "@/hooks/useAppStore";
import clsx from "clsx";
import Weather from "./Weather";
import Stocks from "./Stocks";
import Devices from "./Devices";
import Music from "./Music";
import { config } from "@/configs/config";

const WidgetGrid = () => {
  const { showLockscreen } = useAppStore((state) => state);

  return (
    <div
      className={clsx(
        "grid grid-cols-[repeat(4,140px)] w-[360px] gap-[14px] justify-self-start absolute top-[20px] left-[20px]",
        showLockscreen ? "opacity-0" : "opacity-100"
      )}
      style={{ transition: `opacity ${config.TRANSITION_DURATION}s ease` }}
    >
      <Calendar />
      <Time />
      <Weather />
      <Stocks />
      <Devices />
      <Music />
    </div>
  );
};

export default WidgetGrid;
