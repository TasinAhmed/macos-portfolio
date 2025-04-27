import clsx from "clsx";
import { isURL } from "validator";
import { animate, motion, useDragControls, useMotionValue } from "motion/react";
import { useAppStore, WindowType } from "../hooks/useAppStore";
import {
  Dispatch,
  FocusEvent,
  MouseEventHandler,
  PointerEventHandler,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Resizable } from "re-resizable";

const minWidth = 400;
const maxWidth = "90vw";
const minHeight = 200;
const maxHeight = "90vh";

const WindowMenu = ({
  onPointerDown,
  isActive,
  closeWindow,
  minimizeWindow,
  enterFullScreen,
  data,
  fullScreen,
  searchUrl,
  setSearchUrl,
}: {
  minimizeWindow: MouseEventHandler<HTMLDivElement>;
  closeWindow: MouseEventHandler<HTMLDivElement>;
  isActive: boolean;
  onPointerDown: PointerEventHandler<HTMLDivElement>;
  data: WindowType;
  enterFullScreen: MouseEventHandler<HTMLDivElement>;
  fullScreen: boolean;
  searchUrl: string;
  setSearchUrl: Dispatch<SetStateAction<string>>;
}) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cleanUrl = (input: string) => {
    // Step 1: Remove protocol
    let cleaned = input.replace(/^https?:\/\//, "");

    // Step 2: Remove www.
    cleaned = cleaned.replace(/^www\./, "");

    return cleaned;
  };

  const handleSearchSubmit = () => {
    const trimmed = searchInput.trim();
    const hasProtocol = /^https?:\/\//i.test(trimmed);

    if (isURL(trimmed)) {
      setSearchUrl(hasProtocol ? trimmed : `https://${trimmed}`);
      setSearchFocused(false);
    } else {
      const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(
        trimmed
      )}`;
      setSearchUrl(searchUrl);
    }
  };

  useEffect(() => {
    if (searchFocused) searchInputRef.current?.focus();
  }, [searchFocused]);

  const handleFocus = () => setSearchFocused(true);
  const handleBlur = (e: FocusEvent<HTMLDivElement, Element>) => {
    // if focus moved outside the wrapper
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setSearchFocused(false);
    }
  };

  return (
    <div
      onDoubleClick={enterFullScreen}
      onPointerDown={onPointerDown}
      className={clsx(
        "min-h-[28px] w-full flex items-center select-none backdrop-blur-[13px] transition-colors ease-in-out px-[10px]",
        isActive ? "shadow-window" : "shadow-window-inactive",
        isActive ? "bg-white" : "bg-[#F6F6F6]"
      )}
    >
      <div className="flex items-center gap-[8px]">
        <Button isActive={isActive} onClick={closeWindow} color="red" />
        <Button
          isActive={isActive}
          onClick={minimizeWindow}
          color="yellow"
          disabled={fullScreen}
        />
        <Button onClick={enterFullScreen} isActive={isActive} color="green" />
      </div>
      {data.id === "safari" ? (
        <div className="h-[53px] w-full grid grid-cols-[auto_minmax(0,1fr)_auto] items-center ml-[25px] gap-[15px] justify-items-center">
          <div className="flex flex-shrink-0">
            <img src="/Safari/sidebar.svg" alt="" />
            <div className="flex ml-[20px] gap-[20px]">
              <img src="/Safari/left.svg" alt="" />
              <img src="/Safari/right.svg" alt="" />
            </div>
          </div>
          <div className="flex gap-[15px] items-center w-full max-w-[400px] ">
            <img src="/Safari/shield.svg" alt="" />
            <div
              onPointerDown={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
              className="bg-[rgba(0,0,0,0.05)] rounded-[6px] h-[28px] flex items-center w-full p-[8px] relative overflow-hidden cursor-text"
              onClick={handleFocus}
            >
              <div
                className={clsx(
                  searchUrl ? "hidden" : searchFocused ? "hidden" : "block",
                  "absolute-center flex items-center w-full pointer-events-none overflow-hidden text-[#BABABA] font-medium text-[14px]"
                )}
              >
                <div className="flex items-center mx-auto whitespace-nowrap truncate">
                  <img
                    src="/Safari/search.svg"
                    alt=""
                    className="h-[14px] w-[14px] flex-shrink-0 mx-[6px]"
                  />
                  <span className="min-w-0">Search or enter website name</span>
                </div>
              </div>
              <div
                className={clsx(
                  searchUrl && !searchFocused ? "block" : "hidden",
                  "absolute-center flex items-center w-full pointer-events-none overflow-hidden text-[#BABABA] font-medium text-[14px]"
                )}
              >
                <div className="flex items-center mx-auto whitespace-nowrap truncate">
                  <img
                    src="/Safari/lock.svg"
                    alt=""
                    className="h-[14px] w-[14px] flex-shrink-0 mx-[6px]"
                  />
                  <span className="min-w-0 text-[#4C4C4C]">
                    {cleanUrl(searchUrl)}
                  </span>
                </div>
              </div>
              <img
                src="/Safari/search.svg"
                alt=""
                className={clsx(
                  searchFocused ? "block" : "hidden",
                  "mx-[6px] h-[14px] w-[14px]"
                )}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
                placeholder={
                  searchFocused ? "Search or enter website name" : ""
                }
                className={clsx(
                  searchFocused ? "block" : "hidden",
                  "min-w-0 text-center text-[14px] outline-none focus:text-left absolute top-0 pl-[26px] w-full h-full box-border placeholder-[#BABABA] pb-[1px] text-[#4C4C4C] font-medium"
                )}
                size={1}
                onBlur={handleBlur}
              />
            </div>
          </div>
          <div className="flex items-center gap-[20px] flex-shrink-0">
            <img src="/Safari/download.svg" alt="" />
            <img src="/Safari/share.svg" alt="" />
            <img src="/Safari/add.svg" alt="" />
            <img src="/Safari/copy.svg" alt="" />
          </div>
        </div>
      ) : (
        <div
          className={clsx(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-[13px] transition-colors ease-in-out",
            isActive ? "text-[#3D3D3D]" : "text-[rgba(60,60,67,0.6)]"
          )}
        >
          {data.title}
        </div>
      )}
    </div>
  );
};

const Button = ({
  color,
  isActive,
  onClick,
  disabled,
}: {
  color: "red" | "yellow" | "green";
  isActive: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
}) => {
  return (
    <div
      onClick={(e) => {
        if (disabled) return;
        onClick(e);
      }}
      onDoubleClick={(e) => e.stopPropagation()}
      className={clsx(
        "h-[12px] w-[12px] rounded-full border-solid border-[0.5px] transition-colors ease-in-out",
        !isActive || disabled
          ? "bg-inactive-btn border-[rgba(0,0,0,0.12)]"
          : color === "red"
          ? "bg-[#FF6157] border-[#E24640]"
          : color === "yellow"
          ? "bg-[#FFC12F] border-[#DFA023]"
          : "bg-[#2ACB42] border-[#1BAC2C]"
      )}
    ></div>
  );
};

const Window = ({
  data,
  dragConstraints,
  dockIconRef,
}: {
  data: WindowType;
  dragConstraints: React.RefObject<HTMLDivElement | null>;
  dockIconRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const dragControls = useDragControls();
  const {
    removeWindow,
    activeWindow,
    setActiveWindow,
    addFullScreenWindow,
    removeFullScreenWindow,
    transitionDuration,
  } = useAppStore((state) => state);
  const [changing, setChanging] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const dataRef = useRef(data);
  const [offsetX, offsetY] = useMemo(() => {
    const maxOffset = 200; // adjust how far it can be off-center
    const rand = () => Math.floor(Math.random() * maxOffset * 2) - maxOffset;
    return [rand(), rand()];
  }, []);
  const [searchUrl, setSearchUrl] = useState("");
  const [fullScreen, setFullScreen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const minimizedRef = useRef(minimized);
  const height = useMotionValue(200);
  const width = useMotionValue(400);
  const x = useMotionValue(
    dragConstraints.current
      ? dragConstraints.current.getBoundingClientRect().width / 2 -
          width.get() / 2 +
          offsetX
      : 0
  );
  const y = useMotionValue(
    dragConstraints.current
      ? dragConstraints.current.getBoundingClientRect().height / 2 -
          height.get() / 2 +
          offsetY
      : 0
  );
  const [position, setPosition] = useState({ x: x.get(), y: y.get() });
  const [size, setSize] = useState({
    width: width.get(),
    height: height.get(),
  });
  const [enableConstraints, setEnableConstraints] = useState(true);
  const [currentAnimation, setCurrentAnimation] = useState("enter");

  const enterFullScreen = useCallback(() => {
    if (!fullScreen) {
      addFullScreenWindow(dataRef.current.id);
      setPosition({ x: x.get(), y: y.get() });
      animate(x, 0, { duration: transitionDuration });
      animate(y, 0, { duration: transitionDuration });
      setCurrentAnimation("enterFullScreen");
    } else {
      removeFullScreenWindow(dataRef.current.id);
      animate(x, position.x, { duration: transitionDuration });
      animate(y, position.y, { duration: transitionDuration });
      setCurrentAnimation("exitFullScreen");
    }
    setFullScreen(!fullScreen);
  }, [
    fullScreen,
    position,
    addFullScreenWindow,
    removeFullScreenWindow,
    x,
    y,
    transitionDuration,
  ]);

  const onAnimationComplete = (def: string) => {
    switch (def) {
      case "enterFullScreen":
        setChanging(false);
        setEnableConstraints(false);
        break;

      case "exitFullScreen":
        setChanging(false);
        setEnableConstraints(true);
        break;

      case "exit":
        removeWindow(dataRef.current.id);
        break;

      case "enterMinimized":
        setMinimized(true);
        break;

      default:
        break;
    }
  };

  const onAnimationStart = (def: string) => {
    switch (def) {
      case "enterFullScreen":
        setChanging(true);
        break;

      case "exitFullScreen":
        setChanging(true);
        setEnableConstraints(true);
        break;

      default:
        break;
    }
  };

  const closeWindow = () => {
    setCurrentAnimation("exit");
    removeFullScreenWindow(dataRef.current.id);
  };

  const minimizeWindow = useCallback(() => {
    const tempX = dockIconRef.current
      ? dockIconRef.current.getBoundingClientRect().x
      : 0;
    const tempY = dockIconRef.current
      ? dockIconRef.current.getBoundingClientRect().y
      : 0;
    const tempWidth = dockIconRef.current
      ? dockIconRef.current.getBoundingClientRect().width
      : 0;
    const tempHeight = dockIconRef.current
      ? dockIconRef.current.getBoundingClientRect().height
      : 0;

    if (!minimizedRef.current) {
      setPosition({ x: x.get(), y: y.get() });
      animate(x, tempX + tempWidth / 2 - width.get() / 2, {
        duration: transitionDuration,
      });
      animate(y, tempY + tempHeight / 2 - height.get() / 2, {
        duration: transitionDuration,
      });
      setCurrentAnimation("enterMinimized");
    } else {
      animate(x, position.x, { duration: transitionDuration });
      animate(y, position.y, { duration: transitionDuration });
      setMinimized(false);
      setCurrentAnimation("exitMinimized");
    }
  }, [dockIconRef, height, position, transitionDuration, width, x, y]);

  useEffect(() => {
    const tempRef = dockIconRef.current;
    const dockIconClick = () => {
      if (!fullScreen) minimizeWindow();
    };
    tempRef?.addEventListener("click", dockIconClick);

    return () => {
      tempRef?.removeEventListener("click", dockIconClick);
    };
  }, [dockIconRef, minimizeWindow, fullScreen]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    minimizedRef.current = minimized;
  }, [minimized]);

  const setAsActive = useCallback(() => {
    if (activeWindow === dataRef.current.id) return;
    setActiveWindow(dataRef.current.id);
  }, [setActiveWindow, activeWindow]);

  useEffect(() => {
    if (activeWindow === dataRef.current.id) setIsActive(true);
    else setIsActive(false);
  }, [activeWindow]);

  useEffect(() => {
    console.log("search url");
  }, [searchUrl]);

  return (
    <motion.div
      variants={{
        enter: {
          opacity: 1,
          scale: 1,
        },
        enterFullScreen: {
          opacity: 1,
          scale: 1,
          width: "100%",
          height: "100%",
        },
        exitFullScreen: {
          opacity: 1,
          scale: 1,
          width: size.width,
          height: size.height,
        },
        exit: {
          opacity: 0,
          scale: 0.5,
        },
        enterMinimized: {
          opacity: 0,
          scale: 0.1,
        },
        exitMinimized: {
          opacity: 1,
          scale: 1,
        },
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        setAsActive();
      }}
      onClick={(e) => e.stopPropagation()}
      style={{
        x,
        y,
        width,
        height,
        ...(!fullScreen && { maxHeight, maxWidth, minWidth, minHeight }),
      }}
      initial={{
        opacity: 0,
        scale: 0.5,
        width: width.get(),
        height: height.get(),
      }}
      animate={currentAnimation}
      onAnimationStart={onAnimationStart}
      onAnimationComplete={onAnimationComplete}
      transition={{ duration: transitionDuration }}
      drag={!fullScreen || !changing}
      dragControls={dragControls}
      dragConstraints={enableConstraints ? dragConstraints : undefined}
      dragElastic={0}
      dragMomentum={false}
      dragListener={false}
      onDragStart={() => setChanging(true)}
      onDragEnd={() => {
        setChanging(false);
        setPosition({ x: x.get(), y: y.get() });
      }}
      className={clsx(
        !fullScreen && "rounded-[10px] window",
        minimized && "hidden",
        "absolute bg-[#ffffffbe] border-solid border-[#0000001e] backdrop-blur-[40px] overflow-hidden"
      )}
    >
      <Resizable
        bounds={dragConstraints.current!}
        boundsByDirection
        {...(fullScreen
          ? { enable: false }
          : { minHeight, maxHeight, minWidth, maxWidth })}
        {...(changing && { enable: false })}
        {...(isActive ? {} : { enable: false })}
        size={{ width: "100%", height: "100%" }}
        onResize={(e, direction, ref, delta) => {
          if (["left", "topLeft", "top"].includes(direction)) {
            x.set(position.x - delta.width);
            y.set(position.y - delta.height);
          }
          if (["topRight"].includes(direction)) {
            y.set(position.y - delta.height);
          }
          if (["bottomLeft"].includes(direction)) {
            x.set(position.x - delta.width);
          }
          width.set(ref.offsetWidth);
          height.set(ref.offsetHeight);
        }}
        onResizeStart={() => setChanging(true)}
        onResizeStop={() => {
          setChanging(false);
          setSize({
            width: width.get(),
            height: height.get(),
          });
          setPosition({ x: x.get(), y: y.get() });
        }}
        className="grid grid-rows-[auto_1fr]"
      >
        <WindowMenu
          enterFullScreen={enterFullScreen}
          onPointerDown={(e) => {
            if (!fullScreen) dragControls.start(e);
          }}
          closeWindow={closeWindow}
          data={data}
          fullScreen={fullScreen}
          isActive={isActive}
          minimizeWindow={minimizeWindow}
          searchUrl={searchUrl}
          setSearchUrl={setSearchUrl}
        />
        {data.id === "safari" ? (
          <div className="relative">
            <iframe
              sandbox="allow-scripts allow-same-origin allow-forms"
              className={clsx(
                "h-full w-full",
                changing && "pointer-events-none"
              )}
              src={searchUrl ? searchUrl : undefined}
            />
            {!isActive && (
              <div className="absolute w-full h-full top-0 left-0"></div>
            )}
          </div>
        ) : (
          <div>Test</div>
        )}
      </Resizable>
    </motion.div>
  );
};

export default Window;
