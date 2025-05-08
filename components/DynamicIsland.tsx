import { useMusicStore } from "@/hooks/useMusicStore";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import MusicSlider from "./MusicSlider";
import { FaBackward, FaForward } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { IoPlay } from "react-icons/io5";

const DynamicIsland = () => {
  const [currentAnimation, setCurrentAnimation] = useState("initial");
  const {
    musicPlaying,
    currentTrack,
    musicProgress,
    nextTrack,
    prevTrack,
    setMusicPlaying,
  } = useMusicStore((state) => state);

  const currTime = useMemo(
    () => ({
      min: Math.floor(
        ((musicProgress / 100) * (currentTrack?.duration ?? 0)) / 60
      ),
      sec: Math.floor(
        ((musicProgress / 100) * (currentTrack?.duration ?? 0)) % 60
      ),
    }),
    [musicProgress, currentTrack]
  );
  const duration = useMemo(
    () => ({
      min: Math.floor((currentTrack?.duration ?? 0) / 60),
      sec: Math.floor((currentTrack?.duration ?? 0) % 60),
    }),
    [currentTrack]
  );

  return (
    <div className="flex absolute top-0 left-1/2 -translate-x-1/2">
      <div className="arc-left"></div>
      <motion.div
        className="text-white rounded-b-[12px] bg-black island overflow-hidden"
        variants={{
          initial: { width: 200, height: 30 },
          hover: currentTrack
            ? { width: 300, height: 140 }
            : { width: 225, height: 30 },
        }}
        initial={"initial"}
        onHoverStart={() => setCurrentAnimation("hover")}
        onHoverEnd={() => setCurrentAnimation("initial")}
        transition={{ type: "spring", bounce: 0.3 }}
        animate={currentAnimation}
      >
        {currentTrack && (
          <div className="grid h-full grid-rows-[auto_1fr]">
            <motion.div
              className="flex px-2 relative gap-[14px] items-center"
              variants={{
                initial: {
                  padding: 5,
                  width: 200,
                  height: 30,
                },
                hover: {
                  padding: 10,
                  width: 300,
                  height: 70,
                },
              }}
              initial={"initial"}
              transition={{ type: "spring", bounce: 0.3 }}
              animate={currentAnimation}
            >
              <motion.img
                variants={{
                  initial: { width: 20, height: 20, borderRadius: 4 },
                  hover: { width: 50, height: 50, borderRadius: 8 },
                }}
                src={`/music/${currentTrack?.image}`}
                alt="Music art"
                initial={"initial"}
                className="border-1 border-[rgba(255,255,255,0.1)]"
                transition={{ type: "spring", bounce: 0.3 }}
                animate={currentAnimation}
              />
              <motion.div
                variants={{
                  initial: { opacity: 0, scale: 0.8 },
                  hover: { opacity: 100, scale: 1 },
                }}
                initial={"initial"}
                animate={currentAnimation}
                className="flex-1 min-w-0"
              >
                <div className="whitespace-nowrap text-ellipsis overflow-hidden font-bold text-[14px]">
                  {currentTrack?.title}
                </div>
                <div className="whitespace-nowrap text-ellipsis overflow-hidden text-[13px] text-[#ACABB1]">
                  {currentTrack?.artists.join(", ")}
                </div>
              </motion.div>
              <motion.div className="loader">
                <span className="stroke"></span>
                <span className="stroke"></span>
                <span className="stroke"></span>
                <span className="stroke"></span>
                <span className="stroke"></span>
              </motion.div>
            </motion.div>
            <motion.div
              variants={{
                initial: { opacity: 0 },
                hover: { opacity: 100 },
              }}
              initial={"initial"}
              animate={currentAnimation}
              className="px-[10px] pb-[10px] text-[12px] text-[#9A9A9A]"
            >
              <div className="grid grid-cols-[40px_1fr_40px] items-center gap-[10px] mb-[10px]">
                <div className="justify-self-end">
                  {currTime.min}:{currTime.sec < 10 && 0}
                  {currTime.sec}
                </div>
                <MusicSlider />
                <div>
                  {duration.min}:{duration.sec}
                </div>
              </div>
              <div className="flex justify-center gap-[30px] items-center text-white">
                <FaBackward
                  className="cursor-pointer"
                  size={14}
                  onClick={prevTrack}
                />
                <div
                  className="cursor-pointer"
                  onClick={() => setMusicPlaying(!musicPlaying)}
                >
                  {musicPlaying ? <FaPause size={20} /> : <IoPlay size={20} />}
                </div>
                <FaForward
                  className="cursor-pointer"
                  size={14}
                  onClick={nextTrack}
                />
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
      <div className="arc-right"></div>
    </div>
  );
};

export default DynamicIsland;
