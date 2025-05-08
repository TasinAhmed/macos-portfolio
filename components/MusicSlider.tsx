import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useMusicStore } from "@/hooks/useMusicStore";

const MusicSlider = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const isDragging = useRef(dragging);
  const [currentAnimation, setCurrentAnimation] = useState("idle");
  const { musicProgress, handleSeek, currentTrack } = useMusicStore(
    (state) => state
  );
  const onMouseMoveRef = useRef<(e: MouseEvent) => void>(() => {});
  const onMouseUpRef = useRef<() => void>(() => {});

  useEffect(() => {
    isDragging.current = dragging;

    if (dragging) {
      setCurrentAnimation("dragging");
    } else {
      setCurrentAnimation("idle");
    }
  }, [dragging]);

  const getValueFromX = (clientX: number) => {
    if (!sliderRef.current) return musicProgress;
    const rect = sliderRef.current.getBoundingClientRect();
    const minX = 0;
    const maxX = rect.width;
    const x = clientX - rect.left;
    const clampedX = Math.max(minX, Math.min(maxX, x));
    const percent = ((clampedX - minX) / (maxX - minX)) * 100;
    return percent;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true); // ✅ This was missing from earlier suggestion

    const newValue = getValueFromX(e.clientX);
    handleSeek(newValue);

    onMouseMoveRef.current = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const newValue = getValueFromX(e.clientX);
      handleSeek(newValue);
    };

    onMouseUpRef.current = () => {
      setDragging(false);
      window.removeEventListener("mousemove", onMouseMoveRef.current);
      window.removeEventListener("mouseup", onMouseUpRef.current);
    };

    window.addEventListener("mousemove", onMouseMoveRef.current);
    window.addEventListener("mouseup", onMouseUpRef.current);
  };

  useEffect(() => {
    if (isDragging.current) {
      setDragging(false);
      window.removeEventListener("mousemove", onMouseMoveRef.current);
      window.removeEventListener("mouseup", onMouseUpRef.current);
    }
  }, [currentTrack]);

  return (
    <motion.div
      variants={{
        idle: {
          height: 7,
        },
        dragging: {
          height: 12,
        },
      }}
      ref={sliderRef}
      onMouseDown={onMouseDown}
      className="relative h-[7px] bg-[rgba(63,63,63,0.7)] w-full overflow-hidden rounded-full"
      animate={currentAnimation}
      transition={{ duration: 0.1 }}
    >
      <div
        className="absolute bg-white left-0 top-0 h-full"
        style={{
          width: `calc(100% * ${musicProgress / 100})`,
        }}
      ></div>
    </motion.div>
  );
};

export default MusicSlider;
