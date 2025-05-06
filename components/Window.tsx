import clsx from "clsx";
import { isURL } from "validator";
import { motion, useDragControls, useMotionValue } from "motion/react";
import { useAppStore } from "../hooks/useAppStore";
import React, {
  Dispatch,
  FocusEvent,
  MouseEventHandler,
  PointerEventHandler,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BrowserHistory } from "@/utils/BrowserHistory";
import LeftIcon from "@/public/Safari/left.svg";
import RightIcon from "@/public/Safari/right.svg";
import { ItemType } from "@/configs/apps";
import { IoIosClose, IoIosRemove } from "react-icons/io";
import { IoCaretDown, IoCaretUp } from "react-icons/io5";

const resizeDirections = {
  top: "top-0 left-4 right-4 h-2 cursor-n-resize -translate-y-1/2",
  bottom: "bottom-0 left-4 right-4 h-2 cursor-s-resize translate-y-1/2",
  left: "top-4 bottom-4 left-0 w-2 cursor-w-resize -translate-x-1/2",
  right: "top-4 bottom-4 right-0 w-2 cursor-e-resize translate-x-1/2",
  "top-left":
    "top-0 left-0 w-4 h-4 cursor-nw-resize -translate-x-1/2 -translate-y-1/2",
  "top-right":
    "top-0 right-0 w-4 h-4 cursor-ne-resize translate-x-1/2 -translate-y-1/2",
  "bottom-left":
    "bottom-0 left-0 w-4 h-4 cursor-sw-resize -translate-x-1/2 translate-y-1/2",
  "bottom-right":
    "bottom-0 right-0 w-4 h-4  cursor-se-resize translate-x-1/2 translate-y-1/2",
};

type Direction = keyof typeof resizeDirections;

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
  data: ItemType;
  enterFullScreen: MouseEventHandler<HTMLDivElement>;
  fullScreen: boolean;
  searchUrl: string;
  setSearchUrl: Dispatch<SetStateAction<string>>;
}) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const urlListRef = useRef(new BrowserHistory(searchUrl));
  const [searchInput, setSearchInput] = useState("");
  const [arrowState, setArrowState] = useState({
    canBack: false,
    canForward: false,
  });
  const [showIcon, setShowIcon] = useState(false);

  const backClick = () => {
    if (!arrowState.canBack) return;

    urlListRef.current.back();
    const curr = urlListRef.current.getCurrentPage();
    setSearchUrl(curr);
    setSearchInput(curr);
  };

  const forwardClick = () => {
    if (!arrowState.canForward) return;

    urlListRef.current.forward();
    const curr = urlListRef.current.getCurrentPage();
    setSearchUrl(curr);
    setSearchInput(curr);
  };

  const visitPage = (page: string) => {
    urlListRef.current.visit(page);
  };

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
    let url;

    if (isURL(trimmed)) {
      url = hasProtocol ? trimmed : `https://${trimmed}`;
    } else {
      url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(
        trimmed
      )}`;
    }
    setSearchInput(url);
    setSearchFocused(false);
    setSearchUrl(url);
    visitPage(url);
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

    if (searchInput) {
      const length = searchInput.length;
      // Set cursor to end without selection
      searchInputRef.current?.setSelectionRange(length, length);
    }
  };

  useEffect(() => {
    setArrowState({
      canBack: urlListRef.current.canBack(),
      canForward: urlListRef.current.canForward(),
    });
  }, [searchUrl]);

  return (
    <div
      onDoubleClick={enterFullScreen}
      onPointerDown={onPointerDown}
      className={clsx(
        data.id === "safari" && "h-[53px]",
        "min-h-[28px] w-full flex items-center select-none backdrop-blur-[13px] transition-colors ease-in-out px-[10px]",
        isActive
          ? "shadow-window dark:shadow-window-dark"
          : "shadow-window-inactive dark:shadow-window-inactive-dark",
        isActive
          ? "bg-white dark:bg-[#1E1E1E]"
          : "bg-[#F6F6F6] dark:bg-[#1E1E1E]"
      )}
    >
      <div className="flex items-center gap-[8px]">
        <Button
          isActive={isActive}
          onClick={closeWindow}
          color="red"
          Icon={<IoIosClose color="#7D1A15" size={14} strokeWidth={30} />}
          showIcon={showIcon}
          setShowIcon={setShowIcon}
        />
        <Button
          isActive={isActive}
          onClick={minimizeWindow}
          color="yellow"
          disabled={fullScreen}
          Icon={<IoIosRemove color="	#996500" size={14} strokeWidth={30} />}
          showIcon={showIcon}
          setShowIcon={setShowIcon}
        />
        <Button
          onClick={enterFullScreen}
          isActive={isActive}
          disabled={data.disableFullscreen}
          color="green"
          Icon={
            <div
              className={clsx(
                "flex rotate-45",
                fullScreen ? "flex-col-reverse" : "flex-col"
              )}
            >
              <IoCaretUp
                size={7}
                color="#006B1B"
                className={clsx(fullScreen ? "-mt-[2px]" : "-mb-[2px]")}
              />
              <IoCaretDown size={7} color="#006B1B" />
            </div>
          }
          showIcon={showIcon}
          setShowIcon={setShowIcon}
        />
      </div>
      {data.id === "safari" ? (
        <div className="w-full grid grid-cols-[auto_minmax(0,1fr)_auto] items-center ml-[25px] gap-[15px] justify-items-center">
          <div
            className="flex flex-shrink-0"
            onDoubleClick={(e) => e.stopPropagation()}
          >
            <img src="/Safari/sidebar.svg" alt="" />
            <div className="flex ml-[20px] gap-[20px]">
              <LeftIcon
                onClick={backClick}
                className={clsx(
                  arrowState.canBack
                    ? "fill-[#737373] cursor-pointer"
                    : "fill-[#BFBFBF]"
                )}
              />
              <RightIcon
                onClick={forwardClick}
                className={clsx(
                  arrowState.canForward
                    ? "fill-[#737373] cursor-pointer"
                    : "fill-[#BFBFBF]"
                )}
              />
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
            isActive
              ? "text-[#3D3D3D] dark:text-[rgba(235,235,245,0.6)]"
              : "text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.3)]"
          )}
        >
          {data.name}
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
  Icon,
  showIcon,
  setShowIcon,
}: {
  color: "red" | "yellow" | "green";
  isActive: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
  Icon: ReactNode;
  showIcon: boolean;
  setShowIcon: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div
      onMouseEnter={() => setShowIcon(true)}
      onMouseLeave={() => setShowIcon(false)}
      onClick={(e) => {
        if (disabled) return;
        onClick(e);
      }}
      onDoubleClick={(e) => e.stopPropagation()}
      className={clsx(
        "h-[14px] w-[14px] rounded-full border-solid border-[0.5px] transition-colors ease-in-out flex items-center justify-center",
        !isActive || disabled
          ? "bg-inactive-btn dark:bg-inactive-btn-dark border-[rgba(0,0,0,0.12)]"
          : color === "red"
          ? "bg-[#FF6157] border-[#E24640]"
          : color === "yellow"
          ? "bg-[#FFC12F] border-[#DFA023]"
          : "bg-[#2ACB42] border-[#1BAC2C]"
      )}
    >
      {showIcon && !disabled && isActive && <div>{Icon}</div>}
    </div>
  );
};

const ResizeHandle = ({
  direction,
  onMouseDown,
}: {
  direction: Direction;
  onMouseDown: (e: React.MouseEvent, dir: Direction) => void;
}) => (
  <div
    onMouseDown={(e) => onMouseDown(e, direction)}
    className={`absolute z-10 bg-transparent ${resizeDirections[direction]}`}
  />
);

const Window = ({
  data,
  dragConstraints,
  dockIconRef,
  Content,
}: {
  data: ItemType;
  dragConstraints: React.RefObject<HTMLDivElement | null>;
  dockIconRef: React.RefObject<HTMLDivElement | null>;
  Content: React.ReactNode;
}) => {
  const minWidth = 400;
  const maxWidth = window.innerWidth;
  const minHeight = 200;
  const maxHeight = window.innerHeight - 30;
  const dragControls = useDragControls();
  const {
    removeWindow,
    activeWindow,
    setActiveWindow,
    addFullScreenWindow,
    removeFullScreenWindow,
    transitionDuration,
    showLockscreen,
  } = useAppStore((state) => state);
  const windows = useAppStore((state) => state.windows);
  const [changing, setChanging] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const dataRef = useRef(data);
  const [offsetX, offsetY] = useMemo(() => {
    const maxOffset = 200; // adjust how far it can be off-center
    const rand = () => Math.floor(Math.random() * maxOffset * 2) - maxOffset;
    return windows.size === 1 ? [0, 0] : [rand(), rand()];
  }, [windows]);
  const [searchUrl, setSearchUrl] = useState("home");
  const [fullScreen, setFullScreen] = useState(false);
  const [minimized, setMinimized] = useState(false);
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
  const isResizing = useRef(false);

  const startResize = (e: React.MouseEvent, direction: Direction) => {
    e.preventDefault();
    isResizing.current = true;
    const startWidth = width.get();
    const startHeight = height.get();
    const startXVal = x.get();
    const startYVal = y.get();

    const parentRect = dragConstraints.current?.getBoundingClientRect();
    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !parentRect) return;

      setChanging(true);
      // Cursor position relative to parent
      const relX = e.clientX - parentRect.left;
      const relY = e.clientY - parentRect.top;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startXVal;
      let newY = startYVal;

      if (direction.includes("right")) {
        newWidth = Math.min(
          parentRect.width - startXVal,
          Math.max(minWidth, relX - startXVal)
        );
      }

      if (direction.includes("left")) {
        const leftEdge = Math.max(
          0,
          Math.min(startXVal + startWidth - minWidth, relX)
        );
        newX = leftEdge;
        newWidth = startXVal + startWidth - leftEdge;
      }

      if (direction.includes("bottom")) {
        newHeight = Math.min(
          parentRect.height - startYVal,
          Math.max(minHeight, relY - startYVal)
        );
      }

      if (direction.includes("top")) {
        const topEdge = Math.max(
          0,
          Math.min(startYVal + startHeight - minHeight, relY)
        );
        newY = topEdge;
        newHeight = startYVal + startHeight - topEdge;
      }

      width.set(newWidth);
      height.set(newHeight);
      x.set(newX);
      y.set(newY);
    };

    const onMouseUp = () => {
      setChanging(false);
      setSize({ width: width.get(), height: height.get() });
      isResizing.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const enterFullScreen = useCallback(() => {
    if (!fullScreen) {
      setPosition({ x: x.get(), y: y.get() });
      setCurrentAnimation("enterFullScreen");
      addFullScreenWindow(dataRef.current.id);
    } else {
      removeFullScreenWindow(dataRef.current.id);
      setCurrentAnimation("exitFullScreen");
    }
  }, [fullScreen, addFullScreenWindow, removeFullScreenWindow, x, y]);

  const onAnimationComplete = (def: string) => {
    console.log("done animation", def);

    switch (def) {
      case "enterFullScreen":
        setFullScreen(true);
        setChanging(false);
        setEnableConstraints(false);
        break;

      case "exitFullScreen":
        setFullScreen(false);
        setChanging(false);
        setEnableConstraints(true);
        break;

      case "exit":
        removeWindow(dataRef.current.id);
        break;

      case "enterMinimized":
        setChanging(false);

        setMinimized(true);
        break;

      case "exitMinimized":
        setChanging(false);

        setCurrentAnimation("idle");
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

      case "enterMinimized":
        setChanging(true);
        break;

      case "exitMinimized":
        setChanging(true);
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
    if (!minimized) {
      setPosition({ x: x.get(), y: y.get() });
      setCurrentAnimation("enterMinimized");
    } else {
      setMinimized(false);
      setCurrentAnimation("exitMinimized");
    }
  }, [minimized, x, y]);

  useEffect(() => {
    const tempRef = dockIconRef.current;
    const dockIconClick = () => {
      if (!fullScreen && !changing) minimizeWindow();
    };
    tempRef?.addEventListener("click", dockIconClick);

    return () => {
      tempRef?.removeEventListener("click", dockIconClick);
    };
  }, [dockIconRef, minimizeWindow, fullScreen, changing]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const setAsActive = useCallback(() => {
    if (activeWindow === dataRef.current.id) return;
    setActiveWindow(dataRef.current.id);
  }, [setActiveWindow, activeWindow]);

  useEffect(() => {
    if (activeWindow === dataRef.current.id) setIsActive(true);
    else setIsActive(false);
  }, [activeWindow]);

  useEffect(() => {
    if (dragConstraints.current) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (fullScreen) {
            width.set(entry.contentRect.width);
            height.set(entry.contentRect.height);
          }
        }
      });

      observer.observe(dragConstraints.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [fullScreen, dragConstraints, height, width]);

  const variants = useMemo(
    () => ({
      enter: { opacity: 1, scale: 1 },
      enterFullScreen: {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        width: dragConstraints.current?.getBoundingClientRect().width,
        height: dragConstraints.current?.getBoundingClientRect().height,
      },
      exitFullScreen: {
        x: position.x,
        y: position.y,
        opacity: 1,
        scale: 1,
        width: size.width,
        height: size.height,
      },
      exit: { opacity: 0, scale: 0.5 },
      enterMinimized: {
        opacity: 0.3,
        scale: 0.1,
        x:
          (dockIconRef.current?.getBoundingClientRect().x || 0) +
          (dockIconRef.current?.getBoundingClientRect().width || 0) / 2 -
          width.get() / 2,
        y:
          (dockIconRef.current?.getBoundingClientRect().y || 0) +
          (dockIconRef.current?.getBoundingClientRect().height || 0) / 2 -
          width.get() / 2,
      },
      exitMinimized: {
        opacity: 1,
        scale: 1,
        x: position.x,
        y: position.y,
      },
      idle: {
        opacity: 1,
        scale: 1,
      },
    }),
    [dockIconRef, dragConstraints, position, size, width]
  );

  return (
    <motion.div
      variants={variants}
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
        minHeight,
        maxHeight,
        maxWidth,
        minWidth,
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
      className={clsx((minimized || showLockscreen) && "hidden", "absolute")}
    >
      <motion.div
        style={{ width, height }}
        className={clsx(
          !fullScreen && "rounded-[10px]",
          !fullScreen && isActive ? "active" : "inactive",
          "grid grid-rows-[auto_1fr] bg-[#ffffffbe] dark:bg-[#282828] overflow-hidden border-solid border-[#0000001e] backdrop-blur-[40px] transition-[filter] window"
        )}
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
          <div className="relative h-full w-full">
            <iframe
              sandbox="allow-scripts allow-same-origin allow-forms"
              className={clsx(
                "h-full w-full",
                changing && "pointer-events-none"
              )}
              src={searchUrl ? searchUrl : undefined}
            />
            {(fullScreen || !isActive) && (
              <div
                className={clsx(
                  !isActive ? "h-full" : "h-[85px]",
                  "absolute bottom-0 left-0 w-full"
                )}
              ></div>
            )}
          </div>
        ) : (
          <div className="h-full w-full">{Content}</div>
        )}
      </motion.div>
      {!fullScreen &&
        Object.keys(resizeDirections).map((dir) => (
          <ResizeHandle
            key={dir}
            direction={dir as Direction}
            onMouseDown={startResize}
          />
        ))}
    </motion.div>
  );
};

export default Window;
