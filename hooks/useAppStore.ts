import { create } from "zustand";
interface AppStoreType {
  wallpaper: number;
  setWallpaper: (val: number) => void;
  showLockscreen: boolean;
  setShowLockscreen: (value: boolean) => void;
  brightness: number;
  setBrightness: (val: number) => void;
  sound: number;
  setSound: (val: number) => void;
}

export const useAppStore = create<AppStoreType>((set) => ({
  wallpaper: 1,
  setWallpaper: (val) => set(() => ({ wallpaper: val })),
  showLockscreen: true,
  setShowLockscreen: (val) => set(() => ({ showLockscreen: val })),
  brightness: 100,
  setBrightness: (val) => set(() => ({ brightness: val })),
  sound: 30,
  setSound: (val) => set(() => ({ sound: val })),
}));
