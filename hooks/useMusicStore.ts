import { TrackInfo } from "@/app/api/music/route";
import { create } from "zustand";

export type WindowType = {
  id: string;
  title: string;
};

interface MusicStoreType {
  musicPlaying: boolean;
  setMusicPlaying: (val: boolean) => void;
  musicProgress: number;
  setMusicProgress: (val: number) => void;
  musicList: Map<number, TrackInfo>;
  setMusicList: (list: Map<number, TrackInfo>) => void;
  currentTrack: TrackInfo | null;
  setCurrentTrack: (id: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  audioRef: HTMLAudioElement | null;
  setAudioRef: (ref: HTMLAudioElement) => void;
  handleSeek: (val: number) => void;
}

export const useMusicStore = create<MusicStoreType>((set, get) => ({
  musicProgress: 0,
  setMusicProgress: (val: number) => set(() => ({ musicProgress: val })),
  musicPlaying: false,
  setMusicPlaying: (val) => set(() => ({ musicPlaying: val })),
  currentTrack: null,
  setCurrentTrack: (id) =>
    set((state) => ({ currentTrack: state.musicList.get(id) })),
  musicList: new Map(),
  setMusicList: (list) => set(() => ({ musicList: list })),
  showLockscreen: true,
  nextTrack: () => {
    set((state) => {
      if (state.currentTrack?.id === state.musicList.size)
        return { currentTrack: state.musicList.get(1) || null };
      return {
        currentTrack:
          state.musicList.get(
            state.currentTrack?.id ? state.currentTrack.id + 1 : 1
          ) || null,
      };
    });
  },
  prevTrack: () => {
    set((state) => {
      if (state.currentTrack?.id === 1)
        return {
          currentTrack: state.musicList.get(state.musicList.size) || null,
        };
      return {
        currentTrack:
          state.musicList.get(
            state.currentTrack?.id ? state.currentTrack.id - 1 : 1
          ) || null,
      };
    });
  },
  audioRef: null as HTMLAudioElement | null,
  setAudioRef: (ref: HTMLAudioElement) => set({ audioRef: ref }),
  handleSeek: (val: number) => {
    const audio = get().audioRef;
    if (audio) {
      audio.currentTime = (audio.duration * val) / 100;
      set({ musicProgress: val });
    }
  },
}));
