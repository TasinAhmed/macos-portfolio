"use client"; // if used inside a client component in Next 13+/App Router

import { useState, useEffect, useCallback } from "react";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback((el?: HTMLElement) => {
    if (typeof document === "undefined") return;

    const doc = document as Document;

    if (!doc.fullscreenElement && el) {
      el.requestFullscreen?.().catch((err) => {
        console.error("Failed to enter fullscreen:", err);
      });
    } else if (doc.fullscreenElement) {
      try {
        doc.exitFullscreen?.();
      } catch (err) {
        console.error("Failed to exit fullscreen:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
    };
  }, []);

  return { isFullscreen, toggleFullscreen };
}
