import clsx from "clsx";
import { animate, motion, useDragControls, useMotionValue } from "motion/react";
import { useAppStore, WindowType } from "../hooks/useAppStore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Resizable } from "re-resizable";

const minWidth = 400;
const maxWidth = "90vw";
const minHeight = 200;
const maxHeight = "90vh";

const Button = ({
  color,
  isActive,
  onClick,
}: {
  color: "red" | "yellow" | "green";
  isActive: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <div
      onClick={(e) => {
        console.log("click click");
        if (onClick) onClick(e);
      }}
      className={clsx(
        "h-[12px] w-[12px] rounded-full border-solid border-[0.5px] transition-colors ease-in-out",
        !isActive
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
}: {
  data: WindowType;
  dragConstraints: React.RefObject<HTMLDivElement | null>;
}) => {
  const dragControls = useDragControls();
  const { removeWindow, activeWindow, setActiveWindow } = useAppStore(
    (state) => state
  );
  const [isActive, setIsActive] = useState(false);
  const dataRef = useRef(data);
  const [offsetX, offsetY] = useMemo(() => {
    const maxOffset = 200; // adjust how far it can be off-center
    const rand = () => Math.floor(Math.random() * maxOffset * 2) - maxOffset;
    return [rand(), rand()];
  }, []);
  const [fullScreen, setFullScreen] = useState(false);
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
  const [isClosing, setIsClosing] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState("enter");
  const TRANSITION_DURATION = 70;

  const enterFullScreen = () => {
    if (!fullScreen) {
      setPosition({ x: x.get(), y: y.get() });
      animate(x, 0, { duration: TRANSITION_DURATION / 1000 });
      animate(y, 0, { duration: TRANSITION_DURATION / 1000 });
      setCurrentAnimation("enterFullScreen");
    } else {
      animate(x, position.x, { duration: TRANSITION_DURATION / 1000 });
      animate(y, position.y, { duration: TRANSITION_DURATION / 1000 });
      setCurrentAnimation("exitFullScreen");
    }
    setFullScreen(!fullScreen);
  };

  useEffect(() => {
    if (isClosing) {
      const timeout = setTimeout(() => {
        removeWindow(data.id);
      }, TRANSITION_DURATION);

      return () => clearTimeout(timeout);
    }
  }, [isClosing, data.id, removeWindow]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const setAsActive = useCallback(() => {
    if (activeWindow === data.id) return;
    setActiveWindow(dataRef.current.id);
  }, [setActiveWindow, activeWindow, data]);

  useEffect(() => {
    if (activeWindow === dataRef.current.id) setIsActive(true);
    else setIsActive(false);
  }, [activeWindow]);

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
      exit={{
        opacity: 0,
        scale: 0.5,
      }}
      onAnimationComplete={(def) => {
        if (def === "enterFullScreen") {
          setEnableConstraints(false);
        } else if (def === "exitFullScreen") {
          setEnableConstraints(true);
        }
      }}
      transition={{ duration: TRANSITION_DURATION / 1000 }}
      drag={!fullScreen}
      dragControls={dragControls}
      dragConstraints={enableConstraints ? dragConstraints : undefined}
      dragElastic={0}
      dragMomentum={false}
      dragListener={false}
      onDragEnd={() => setPosition({ x: x.get(), y: y.get() })}
      className={clsx(
        !fullScreen && "rounded-[10px]",
        "absolute bg-[#ffffffbe] border-solid border-[#0000001e] backdrop-blur-[40px] overflow-hidden window"
      )}
    >
      <Resizable
        bounds={dragConstraints.current!}
        boundsByDirection
        {...(fullScreen
          ? { enable: false }
          : { minHeight, maxHeight, minWidth, maxWidth })}
        {...(isActive ? {} : { enable: false })}
        size={fullScreen ? { width: "100%", height: "100%" } : size}
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
        onResizeStop={(e, direction, ref, delta) => {
          setSize({
            width: size.width + delta.width,
            height: size.height + delta.height,
          });
          setPosition({ x: x.get(), y: y.get() });
        }}
      >
        <div
          onDoubleClick={enterFullScreen}
          onPointerDown={(e) => {
            if (!fullScreen) dragControls.start(e);
          }}
          className={clsx(
            "h-[28px] absolute top-0 left-0 w-full flex items-center px-[8px] select-none backdrop-blur-[13px] transition-colors ease-in-out",
            isActive ? "shadow-window" : "shadow-window-inactive",
            isActive ? "bg-white" : "bg-[#F6F6F6]"
          )}
        >
          <div className="flex items-center gap-[8px]">
            <Button
              isActive={isActive}
              onClick={() => {
                setIsClosing(true);
              }}
              color="red"
            />
            <Button isActive={isActive} color="yellow" />
            <Button
              onClick={enterFullScreen}
              isActive={isActive}
              color="green"
            />
          </div>
          <div
            className={clsx(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-[13px] transition-colors ease-in-out",
              isActive ? "text-[#3D3D3D]" : "text-[rgba(60,60,67,0.6)]"
            )}
          >
            {data.title}
          </div>
        </div>
      </Resizable>
    </motion.div>
  );
};

export default Window;
