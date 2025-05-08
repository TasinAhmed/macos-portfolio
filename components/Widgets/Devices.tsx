import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Image from "next/image";

const Devices = () => {
  const devices = [
    { name: "phone", percentage: 87 },
    { name: "watch", percentage: 80 },
    { name: "buds", percentage: 60 },
    { name: "case", percentage: 25 },
  ];

  return (
    <div
      className="p-[16px] widget flex justify-between col-span-2 gap-[16px] items-center"
      style={{
        background: "linear-gradient(180deg, #212121 0%, #141414 100%)",
        backdropFilter: "blur(50px)",
      }}
    >
      {devices.map((d, index) => (
        <div
          key={index}
          className="grid gap-[16px] justify-items-center text-[rgba(230,237,237,0.7)]"
        >
          <div className="relative">
            <CircularProgressbar value={d.percentage} />
            <Image
              src={`${d.name}.svg`}
              alt={`${d.name} icon`}
              width={40}
              height={40}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <div className="text-sm">{d.percentage}%</div>
        </div>
      ))}
    </div>
  );
};

export default Devices;
