import { apps, ItemType } from "@/configs/apps";
import { create } from "zustand";

export type WindowType = {
  id: string;
  title: string;
};

interface AppStoreType {
  windows: Map<string, ItemType>;
  activeWindow: string | null;
  fullScreenWindows: Set<string>;
  transitionDuration: number;
  addWindow: (key: string) => void;
  removeWindow: (key: string) => void;
  setWindows: (newMap: Map<string, ItemType>) => void;
  setActiveWindow: (key: string | null) => void;
  addFullScreenWindow: (key: string) => void;
  removeFullScreenWindow: (key: string) => void;
}

export const useAppStore = create<AppStoreType>((set) => ({
  transitionDuration: 0.15,
  windows: new Map(),
  activeWindow: null,
  fullScreenWindows: new Set(),
  addFullScreenWindow: (key) =>
    set((state) => {
      const newSet = new Set(state.fullScreenWindows);
      newSet.add(key);
      return { fullScreenWindows: newSet };
    }),
  removeFullScreenWindow: (key) =>
    set((state) => {
      const newSet = new Set(state.fullScreenWindows);
      newSet.delete(key);
      return { fullScreenWindows: newSet };
    }),
  setWindows: (newMap) => set(() => ({ windows: newMap })),
  setActiveWindow: (key) => {
    set((state) => {
      if (key) {
        const newMap = new Map(state.windows);
        const deletedWindow = newMap.get(key);
        newMap.delete(key);
        newMap.set(key, deletedWindow!);
        state.setWindows(newMap);
      }

      return { activeWindow: key };
    });
  },
  addWindow: (key) =>
    set((state) => {
      const newMap = new Map(state.windows);
      newMap.set(key, apps.get(key)!);
      return { windows: newMap, activeWindow: key };
    }),
  removeWindow: (key) =>
    set((state) => {
      if (!state.windows.has(key)) return {};
      const newMap = new Map(state.windows);
      newMap.delete(key);
      return {
        windows: newMap,
        activeWindow: Array.from(newMap.keys()).pop() || null,
      };
    }),
}));
