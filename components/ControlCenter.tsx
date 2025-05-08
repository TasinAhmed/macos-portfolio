"use client";
import Image from "next/image";
import React, { useRef } from "react";
import { IconType } from "react-icons";
import { FaBluetoothB, FaVolumeMute, FaVolumeUp, FaWifi } from "react-icons/fa";
import {
  MdDarkMode,
  MdLightMode,
  MdOutlineFullscreen,
  MdOutlineFullscreenExit,
} from "react-icons/md";
import { PiApplePodcastsLogoFill } from "react-icons/pi";
import GearIcon from "@/public/gear.svg";
import KeyboardIcon from "@/public/key-brightness.svg";
import { IoIosPower } from "react-icons/io";
import { useTheme } from "next-themes";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useAppStore } from "@/hooks/useAppStore";

const ControlSlider = ({
  value,
  onChange,
  Icon,
  AltIcon,
}: {
  value: number;
  onChange: (value: number) => void;
  Icon: IconType;
  AltIcon?: IconType;
}) => {
  const height = 28;
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const getValueFromX = (clientX: number) => {
    if (!sliderRef.current) return value;
    const rect = sliderRef.current.getBoundingClientRect();
    const minX = height / 2;
    const maxX = rect.width - height / 2;
    const x = clientX - rect.left;
    const clampedX = Math.max(minX, Math.min(maxX, x));
    const percent = ((clampedX - minX) / (maxX - minX)) * 100;
    return percent;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    const newValue = getValueFromX(e.clientX);
    onChange(newValue);

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      onChange(getValueFromX(e.clientX));
    };

    const onMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="flex cursor-pointer" style={{ height: `${height}px` }}>
      <div
        className="relative bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.2)] rounded-l-full w-[30px] h-full"
        onClick={() => onChange(0)}
      >
        <div
          className="bg-white absolute top-1/2 -translate-y-1/2 w-full rounded-l-full flex items-center pl-[6px] text-[rgba(0,0,0,0.5)]"
          style={{
            height: `${height - 4}px`,
            width: "calc(100%-2px)",
            left: "2px",
          }}
        >
          {AltIcon ? value === 0 ? <AltIcon /> : <Icon /> : <Icon />}
        </div>
      </div>
      <div
        className="relative w-full bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.2)] rounded-r-full"
        style={{ height: `${height}px` }}
        ref={sliderRef}
        onMouseDown={onMouseDown}
      >
        <div
          className="absolute bg-white left-0 top-1/2 -translate-y-1/2"
          style={{
            width: `calc(${height / 2 - 2}px + calc(${
              value / 100
            } * calc(100% - ${height}px)))`,
            height: `${height - 4}px`,
          }}
        ></div>
        <div
          className="bg-white rounded-full absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          style={{
            height: height - 4,
            width: height - 4,
            boxShadow: "0px 1px 1px 1px rgba(0, 0, 0, 0.1)",
            left: `calc(${height / 2}px + calc(${
              value / 100
            } * calc(100% - ${height}px)))`,
          }}
        ></div>
      </div>
    </div>
  );
};

const ControlCenter = () => {
  const { setTheme, theme } = useTheme();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { brightness, setBrightness, sound, setSound, setShowLockscreen } =
    useAppStore((state) => state);

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    document.body.style.filter = `brightness(${0.5 + value / 200})`;
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <div className="w-[320px] control-center grid gap-[12px] p-[12px] z-10 text-black dark:text-white bg-[rgba(255,255,255,0.3)] dark:bg-[rgba(255,255,255,0.1)]">
      <div className="grid grid-cols-[repeat(3,1fr)] gap-[8px]">
        <div className="control-tile col-span-2 !p-1">
          <div className="flex gap-[8px] items-center">
            <div className="h-[35px] w-[35px] rounded-full overflow-hidden">
              <Image src="/avatar.jpg" alt="Avatar" width={35} height={35} />
            </div>
            <div className="text-[13px] font-normal">Tasin Ahmed</div>
          </div>
        </div>
        <div className="control-tile col-span-1 flex items-center !p-1 cursor-pointer">
          <div className="flex-1 flex justify-center h-full items-center">
            <GearIcon className="h-[20px] fill-inherit" />
          </div>
          <div className="w-[1px] h-[25px] bg-[rgba(0,0,0,0.3)] dark:bg-[rgba(255,255,255,0.3)]"></div>
          <div
            className="flex-1 flex justify-center h-full items-center"
            onClick={() => {
              setShowLockscreen(true);
            }}
          >
            <IoIosPower size={22} fill="inherit" color="inherit" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[repeat(4,1fr)] gap-[8px] grid-rows-[1fr_1fr]">
        <div className="control-tile col-span-2 row-span-2 grid gap-[2px]">
          <div className="connection">
            <div className="connection-icon">
              <FaWifi size={16} />
            </div>
            <div>
              <div>Wi-Fi</div>
              <div className="text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.55)] text-[12px]">
                Tasin-5G
              </div>
            </div>
          </div>
          <div className="connection">
            <div className="connection-icon">
              <FaBluetoothB size={16} />
            </div>
            <div>
              <div>Bluetooth</div>
              <div className="text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.55)] text-[12px]">
                On
              </div>
            </div>
          </div>
          <div className="connection">
            <div className="connection-icon">
              <PiApplePodcastsLogoFill size={16} />
            </div>
            <div>
              <div>Airdrop</div>
              <div className="text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.55)] text-[12px]">
                Everyone
              </div>
            </div>
          </div>
        </div>
        <div
          className="control-tile col-span-2 flex items-center cursor-pointer"
          onClick={toggleTheme}
        >
          <div className="connection">
            <div className="connection-icon">
              {theme === "light" ? <MdLightMode size={16} /> : <MdDarkMode />}
            </div>
            <div>{theme === "light" ? "Light" : "Dark"} mode</div>
          </div>
        </div>
        <div className="control-tile start-3 grid justify-items-center items-center text-center gap-[4px] !p-1 text-[12px] cursor-pointer">
          <KeyboardIcon className="h-[15px] fill-inherit" />
          <div className="leading-[14px]">Keyboard Brightness</div>
        </div>
        <div
          className="control-tile start-3 grid justify-items-center items-center text-center gap-[4px] !p-1 text-[12px] cursor-pointer"
          onClick={() => toggleFullscreen()}
        >
          {isFullscreen ? (
            <MdOutlineFullscreenExit size={22} fill="inherit" />
          ) : (
            <MdOutlineFullscreen size={22} fill="inherit" />
          )}
          <div className="leading-[14px]">
            {isFullscreen ? "Exit" : "Enter"} Fullscreen
          </div>
        </div>
      </div>
      <div className="control-tile">
        <div className="mb-[6px]">Display</div>
        <ControlSlider
          value={brightness}
          onChange={(value) => handleBrightnessChange(value)}
          Icon={MdLightMode}
        />
      </div>
      <div className="control-tile">
        <div className="mb-[6px]">Sound</div>
        <ControlSlider
          value={sound}
          onChange={(value) => setSound(value)}
          Icon={FaVolumeUp}
          AltIcon={FaVolumeMute}
        />
      </div>
    </div>
  );
};

export default ControlCenter;
