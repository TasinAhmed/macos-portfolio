import { create } from "zustand";

export type WindowType = {
  id: string;
  title: string;
};

interface AppStoreType {
  windows: Map<string, WindowType>;
  activeWindow: string | null;
  addWindow: (key: string, value: WindowType) => void;
  removeWindow: (key: string) => void;
  setWindows: (newMap: Map<string, WindowType>) => void;
  setActiveWindow: (key: string | null) => void;
}

export const useAppStore = create<AppStoreType>((set) => ({
  windows: new Map(),
  activeWindow: null,
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
  addWindow: (key, value) =>
    set((state) => {
      const newMap = new Map(state.windows);
      newMap.set(key, value);
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
