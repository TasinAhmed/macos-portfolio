import clsx from "clsx";
import { ReactNode } from "react";
import { useMacOSDateTime } from "../hooks/useMacOSDateTime";

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
  onClick,
}: {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) => {
  const { date, time } = useMacOSDateTime();

  return (
    <div className="relative h-[30px] text-[14px]" onClick={onClick}>
      <div className="absolute left-0 top-0 h-full w-full bg-[#8F8F8F] mix-blend-color-burn opacity-[0.2]"></div>
      <div className="absolute left-0 top-0 h-full w-full bg-[#ffffff80] backdrop-blur-[75px]"></div>
      <div className="absolute left-0 top-0 h-full w-full flex justify-between items-center px-[14px]">
        <div className="flex items-center h-full">
          <div className="px-[14px]">
            <img src="apple.svg" alt="" />
          </div>
          <Button bold>Finder</Button>
          <Button>File</Button>
          <Button>Edit</Button>
          <Button>View</Button>
          <Button>Go</Button>
          <Button>Window</Button>
          <Button>Help</Button>
        </div>
        <div className="flex h-full gap-[14px] items-center">
          <div className="flex items-center gap-[12px]">
            <img className="h-[20px]" src="wifi.svg" alt="" />
            <img className="h-[20px]" src="battery.svg" alt="" />
            <img className="h-[14px]" src="switch.svg" alt="" />
          </div>
          <div className="flex items-center gap-[10px]">
            <div>{date}</div>
            <div>{time}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
