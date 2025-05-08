import { useAppStore } from "@/hooks/useAppStore";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Area,
} from "recharts";

const generateStockData = (startPrice: number, points = 390) => {
  const data = [];
  let price = startPrice;

  const startTime = new Date();
  startTime.setHours(9, 30, 0, 0); // 9:30 AM

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * 0.5;
    price = Math.max(1, price + change);
    const time = new Date(startTime.getTime() + i * 60 * 1000);
    const label = time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    data.push({ time: label, price: parseFloat(price.toFixed(2)) });
  }

  return data;
};

const StockGraph = ({
  symbol,
  name,
  className,
}: {
  symbol: string;
  name: string;
  className?: string;
}) => {
  const basePrice = useMemo(() => Math.random() * (200 - 150 + 1) + 150, []); // Random starting price between $150 and $200
  const data = useMemo(() => generateStockData(basePrice), [basePrice]);
  const yesterdayClose = data[0]?.price ?? basePrice;
  const { showLockscreen } = useAppStore((state) => state);
  const [animate, setAnimate] = useState(false);

  // Determine if stock is up or down based on the last price compared to the previous close
  const isStockUp = data[data.length - 1].price > yesterdayClose;
  const priceDifference = (
    data[data.length - 1].price - yesterdayClose
  ).toFixed(2);

  // Set colors based on stock movement (green for gain, red for loss)
  const lineColor = isStockUp ? "#34C85A" : "#EF4444";

  useEffect(() => {
    if (!showLockscreen) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [showLockscreen]);

  return (
    <div
      className={clsx(
        "bg-[#121212] text-white p-4 w-full max-w-sm flex items-center",
        className
      )}
    >
      <div className="grid w-[95px]">
        <div className="flex items-center gap-[4px]">
          {isStockUp ? (
            <BiSolidUpArrow color={lineColor} />
          ) : (
            <BiSolidDownArrow color={lineColor} />
          )}{" "}
          <div className="font-bold text">{symbol}</div>
        </div>
        <div className="text-[12px] text-[#A4A3A9]">{name}</div>
      </div>
      <div className="flex flex-1 items-center gap-[10px] font-medium">
        <ResponsiveContainer width="100%" height={35}>
          <ComposedChart data={data}>
            {/* Gradient definition for stock movement */}
            <defs>
              <linearGradient
                id={`stockGradient-${symbol}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.5} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis dataKey="time" hide />
            <YAxis domain={["dataMin", "dataMax"]} hide />
            <ReferenceLine
              y={yesterdayClose}
              stroke={lineColor}
              strokeDasharray="4 4"
              ifOverflow="extendDomain"
              label={{
                position: "insideRight",
                fill: lineColor,
                fontSize: 10,
              }}
            />
            {/* Area with gradient fill based on stock movement */}
            <Area
              type="monotone"
              dataKey="price"
              stroke="none"
              fill={`url(#stockGradient-${symbol})`}
              fillOpacity={0.6}
              isAnimationActive={animate}
            />
            {/* Line chart with dynamic color */}
            <Line
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              isAnimationActive={animate}
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div>
          <div>{data[data.length - 1].price.toFixed(2)}</div>
          <div className="flex items-center" style={{ color: lineColor }}>
            <span className="ml-1 font-semibold">
              {isStockUp ? `+${priceDifference}` : `${priceDifference}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Stocks = () => {
  return (
    <div className="widget bg-[#121212] p-[16px] col-span-2 row-start-3">
      <StockGraph
        symbol="AAPL"
        name="Apple Inc"
        className="border-b-1 border-b-[#323136]"
      />
      <StockGraph
        symbol="AMZN"
        name="Amazon.com Inc"
        className="border-b-1 border-b-[#323136]"
      />
      <StockGraph symbol="NVDA" name="NVIDIA Corp" />
    </div>
  );
};

export default Stocks;
