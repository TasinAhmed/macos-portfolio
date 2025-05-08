import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { FaBackward, FaForward, FaPlay } from "react-icons/fa";
import MusicSlider from "../MusicSlider";
import { IoMdPause } from "react-icons/io";
import clsx from "clsx";
import { TrackInfo } from "@/app/api/music/route";
import { useMusicStore } from "@/hooks/useMusicStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAppStore } from "@/hooks/useAppStore";

const Music = () => {
  const {
    musicList,
    currentTrack,
    setCurrentTrack,
    musicPlaying,
    setMusicPlaying,
    setMusicList,
    setMusicProgress,
    nextTrack,
    prevTrack,
    setAudioRef,
  } = useMusicStore((state) => state);
  const { sound } = useAppStore((state) => state);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playingRef = useRef(musicPlaying);
  const prevTrackId = useRef<number | null>(null);
  const hasSetRef = useRef(false);

  const setAudioDomRef = (el: HTMLAudioElement | null) => {
    audioRef.current = el;
    if (audioRef.current && !hasSetRef.current) {
      audioRef.current.volume = sound / 100;
      setAudioRef(audioRef.current);
      hasSetRef.current = true;
    }
  };

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    const audio = audioRef.current;

    const isNewTrack = prevTrackId.current !== currentTrack.id;

    if (isNewTrack) {
      audio.pause();
      audio.src = `/music/${currentTrack.file}`;
      audio.load();
      audio.currentTime = 0;
      setMusicProgress(0);
      prevTrackId.current = currentTrack.id || null;
    }

    if (musicPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Audio play failed:", err);
        });
      }
    } else {
      audio.pause();
    }
  }, [currentTrack, musicPlaying, setMusicProgress]);

  useEffect(() => {
    playingRef.current = musicPlaying;
  }, [musicPlaying]);

  const onSelect = (id: number) => {
    setCurrentTrack(id);
    setMusicPlaying(id !== currentTrack?.id || !musicPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setMusicProgress((current / duration) * 100);
    }
  };

  const togglePlay = () => {
    setMusicPlaying(!musicPlaying);
  };

  const fetchData: () => Promise<TrackInfo[]> = async () => {
    const { data } = await axios.get("/api/music");
    return data;
  };

  const { data } = useQuery({
    queryKey: ["music"],
    queryFn: fetchData,
  });

  useEffect(() => {
    if (data) {
      let i = 1;
      const tempMap = new Map();

      for (const d of data) {
        tempMap.set(i, { id: i, ...d });
        i++;
      }
      setMusicList(tempMap);
    }
  }, [data, setMusicList]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = sound / 100;
  }, [sound]);

  return (
    <div className="col-span-2 row-span-2 widget bg-[#141414] grid grid-rows-[auto_1fr] dark text-white">
      <div>
        {currentTrack && (
          <div className="h-[100px] bg-[#242424] flex items-center p-[16px]">
            <div className="flex gap-[16px] overflow-ellipsis flex-1 items-center">
              <div className="relative">
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgba(0,0,0,0.4)] flex items-center justify-center rounded-full w-[40px] h-[40px] border-1 border-white cursor-pointer"
                  onClick={togglePlay}
                >
                  {musicPlaying ? <IoMdPause /> : <FaPlay size={13} />}
                </div>
                <Image
                  src={`/music/${currentTrack.image}`}
                  alt="Track Image"
                  width={70}
                  height={70}
                  className="rounded-[6px]"
                />
              </div>
              <div className="flex-1">
                <div className="w-[160px] mb-[6px]">
                  <div className="text-white text-[14px] font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                    {currentTrack.title}
                  </div>
                  <div className="whitespace-nowrap text-[14px] text-[#ACABB1] overflow-hidden text-ellipsis">
                    {currentTrack.artists.join(", ")}
                  </div>
                </div>
                <div className="flex items-center gap-[10px]">
                  <audio
                    ref={setAudioDomRef}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={nextTrack}
                  />
                  <FaBackward onClick={prevTrack} className="cursor-pointer" />
                  <MusicSlider />
                  <FaForward onClick={nextTrack} className="cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        <div className="absolute h-full w-full overflow-x-hidden overflow-y-auto top-0 left-0 p-[10px] grid gap-[8px]">
          {musicList &&
            Array.from(musicList).map(([key, value]) => (
              <div
                key={key}
                className={clsx(
                  "flex gap-[10px] p-[8px] rounded-[6px]",
                  currentTrack?.id === key && "bg-[rgba(255,255,255,0.05)]"
                )}
              >
                <Image
                  src={`/music/${value.image}`}
                  alt="Track Image"
                  width={48}
                  height={48}
                  className="rounded-[6px]"
                />
                <div className="flex items-center justify-between w-full">
                  <div className="max-w-[150px]">
                    <div className="text-white text-[14px] font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                      {value.title}
                    </div>
                    <div className="whitespace-nowrap text-[14px] text-[#ACABB1] overflow-hidden text-ellipsis">
                      {value.artists.join(", ")}
                    </div>
                  </div>
                  <div
                    className="h-[25px] w-[25px] rounded-full bg-[#2C2C2C] flex items-center justify-center cursor-pointer"
                    onClick={() => onSelect(key)}
                  >
                    {musicPlaying && key === currentTrack?.id ? (
                      <IoMdPause size={12} />
                    ) : (
                      <FaPlay size={10} />
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Music;
