import { useMacOSDateTime } from "@/hooks/useMacOSDateTime";
import React from "react";

const Calendar = () => {
  const { weekday, day, month } = useMacOSDateTime();

  return (
    <div className="grid items-center justify-items-center content-center bg-white widget aspect-square">
      <div className="text-[20px] font-bold">
        <span className="text-[#f14148] mr-[8px]">{weekday}</span>
        <span className="text-[#828282]">{month}</span>
      </div>
      <div className="text-[#272727] text-[100px] font-bold leading-[100px]">
        {day}
      </div>
    </div>
  );
};

export default Calendar;
