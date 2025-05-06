import React from "react";
import Time from "./Time";
import Calendar from "./Calendar";
import { useAppStore } from "@/hooks/useAppStore";
import clsx from "clsx";
import Weather from "./Weather";
import Stocks from "./Stocks";

const WidgetGrid = () => {
  const { showLockscreen, transitionDuration } = useAppStore((state) => state);

  return (
    <div
      className={clsx(
        "grid grid-cols-[170px_170px] w-[360px] gap-[20px] justify-self-start absolute top-[54px] left-[20px]",
        showLockscreen ? "opacity-0" : "opacity-100"
      )}
      style={{ transition: `opacity ${transitionDuration}s ease` }}
    >
      <Calendar />
      <Time />
      <Weather />
      <Stocks />
    </div>
  );
};

export default WidgetGrid;
