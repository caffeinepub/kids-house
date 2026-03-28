import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { VideoMeta } from "../backend";
import { useAllVideos } from "../hooks/useQueries";

const SHORTS = [
  {
    id: 1,
    title: "ABC Song Fun 🎵",
    creator: "Happy Kids",
    emoji: "🎵",
    gradient: "from-blue-400 via-blue-500 to-indigo-600",
    likes: 1204,
    comments: 89,
  },
  {
    id: 2,
    title: "Count with me! 🍎🍊🍋",
    creator: "Math Fun",
    emoji: "🔢",
    gradient: "from-orange-400 via-amber-500 to-yellow-500",
    likes: 987,
    comments: 56,
  },
  {
    id: 3,
    title: "Dance with Animals 🐘",
    creator: "Animal World",
    emoji: "🐘",
    gradient: "from-green-400 via-emerald-500 to-teal-600",
    likes: 2341,
    comments: 134,
  },
  {
    id: 4,
    title: "Colors of Rainbow 🌈",
    creator: "Rainbow Kids",
    emoji: "🌈",
    gradient: "from-purple-400 via-pink-500 to-rose-500",
    likes: 1876,
    comments: 98,
  },
  {
    id: 5,
    title: "Coding for Beginners 💻",
    creator: "Code Kids",
    emoji: "💻",
    gradient: "from-cyan-400 via-sky-500 to-blue-600",
    likes: 654,
    comments: 43,
  },
  {
    id: 6,
    title: "Draw a Butterfly 🦋",
    creator: "Art Academy",
    emoji: "🦋",
    gradient: "from-pink-400 via-rose-500 to-red-500",
    likes: 1532,
    comments: 76,
  },
];

function getVideoType(videoId: string): "short" | "long" {
  try {
    const ext = JSON.parse(
      localStorage.getItem(`kh_video_ext_${videoId}`) || "{}",
    );
    return ext.type === "short" ? "short" : "long";
  } catch {
    return "long";
  }
}

function getVideoExt(videoId: string) {
  try {
    return JSON.parse(localStorage.getItem(`kh_video_ext_${videoId}`) || "{}");
  } catch {
    return {};
  }
}

function RealShortPlayer({
  shorts,
  current,
  onPrev,
  onNext,
  onSelect,
}: {
  shorts: VideoMeta[];
  current: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
}) {
  const video = shorts[current];
  if (!video) return null;
  const ext = getVideoExt(video.id);

  return (
    <>
      {/* Desktop layout */}
      <div className="hidden md:flex flex-col items-center gap-4 px-8">
        <h1 className="text-2xl font-black self-start">
          <span className="text-kids-blue">Shorts </span>
          <span className="text-kids-red">▶️</span>
        </h1>
        {/* Pill selectors */}
        <div className="flex gap-2 w-full max-w-2xl justify-center flex-wrap">
          {shorts.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(i)}
              className={`px-4 py-2 rounded-full text-sm font-black border-2 transition-all truncate max-w-[160px] ${
                current === i
                  ? "bg-kids-blue text-white border-kids-blue"
                  : "bg-card border-border text-foreground"
              }`}
            >
              {s.title.slice(0, 18)}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-kids-purple/40 bg-black"
            style={{ minHeight: 480 }}
          >
            {/* biome-ignore lint/a11y/useMediaCaption: kids video */}
            <video
              src={video.blob.getDirectURL()}
              controls
              autoPlay
              loop
              className="w-full"
              style={{ minHeight: 380 }}
            />
            <div className="px-4 py-3 bg-black/90">
              <p className="font-black text-white text-sm truncate">
                {video.title}
              </p>
              {ext.hashtags && ext.hashtags.length > 0 && (
                <p className="text-white/50 text-xs mt-0.5 truncate">
                  {ext.hashtags
                    .slice(0, 3)
                    .map((h: string) => `#${h}`)
                    .join(" ")}
                </p>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  data-ocid="shorts.pagination_prev"
                  onClick={onPrev}
                  disabled={current === 0}
                  className="bg-white/10 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-40 hover:bg-white/20"
                >
                  ↑
                </button>
                <button
                  type="button"
                  data-ocid="shorts.pagination_next"
                  onClick={onNext}
                  disabled={current === shorts.length - 1}
                  className="bg-white/10 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-40 hover:bg-white/20"
                >
                  ↓
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile layout */}
      <div
        className="md:hidden relative bg-black"
        style={{ height: "calc(100dvh - 130px)" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute inset-0 flex flex-col bg-black"
          >
            {/* biome-ignore lint/a11y/useMediaCaption: kids video */}
            <video
              src={video.blob.getDirectURL()}
              controls
              autoPlay
              loop
              className="flex-1 w-full object-contain"
            />
            <div className="flex items-center justify-between px-4 py-3 bg-black/80">
              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-sm truncate">
                  {video.title}
                </p>
                {ext.hashtags && ext.hashtags.length > 0 && (
                  <p className="text-white/50 text-xs truncate">
                    {ext.hashtags
                      .slice(0, 3)
                      .map((h: string) => `#${h}`)
                      .join(" ")}
                  </p>
                )}
              </div>
              <div className="flex gap-1 ml-3">
                {shorts.map((_, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: positional dots
                    key={i}
                    className={`rounded-full transition-all ${
                      i === current
                        ? "w-4 h-1.5 bg-white"
                        : "w-1.5 h-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

export default function ShortsPage() {
  const [current, setCurrent] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(current);
  currentRef.current = current;

  const { data: allVideos } = useAllVideos();
  const realShorts = (allVideos ?? []).filter(
    (v) => getVideoType(v.id) === "short",
  );
  const useRealShorts = realShorts.length > 0;
  const listLength = useRealShorts ? realShorts.length : SHORTS.length;

  const toggleLike = (id: number) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (delta > 60) setCurrent((c) => Math.min(c + 1, listLength - 1));
      else if (delta < -60) setCurrent((c) => Math.max(c - 1, 0));
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [listLength]);

  const short = SHORTS[current];

  if (useRealShorts) {
    return (
      <div ref={containerRef} className="bg-background min-h-screen md:py-8">
        <RealShortPlayer
          shorts={realShorts}
          current={current}
          onPrev={() => setCurrent((c) => Math.max(c - 1, 0))}
          onNext={() =>
            setCurrent((c) => Math.min(c + 1, realShorts.length - 1))
          }
          onSelect={setCurrent}
        />
      </div>
    );
  }

  return (
    // Mobile: full screen. Desktop: centered card layout
    <div ref={containerRef} className="bg-background min-h-screen md:py-8">
      {/* Desktop: navigation + centered card */}
      <div className="hidden md:flex flex-col items-center gap-4 px-8">
        <h1 className="text-2xl font-black self-start">
          <span className="text-kids-blue">शॉर्ट्स </span>
          <span className="text-kids-red">Shorts</span> ▶️
        </h1>
        <div className="flex gap-3 w-full max-w-2xl justify-center flex-wrap">
          {SHORTS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrent(i)}
              className={`px-4 py-2 rounded-full text-sm font-black border-2 transition-all ${
                current === i
                  ? "bg-kids-blue text-white border-kids-blue"
                  : "bg-card border-border text-foreground"
              }`}
            >
              {s.emoji} {s.title.split(" ")[0]}
            </button>
          ))}
        </div>
        {/* Desktop card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={short.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30 bg-gradient-to-b ${short.gradient}`}
            style={{ minHeight: 480 }}
          >
            <div className="flex flex-col h-full" style={{ minHeight: 480 }}>
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
                <div className="text-9xl">{short.emoji}</div>
                <p className="font-black text-3xl text-white text-center drop-shadow-lg">
                  {short.title}
                </p>
                <p className="text-white/80 font-semibold text-lg">
                  by {short.creator}
                </p>
              </div>
              <div className="flex items-center justify-between px-6 py-4 bg-black/20">
                <button
                  type="button"
                  onClick={() => toggleLike(short.id)}
                  className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2"
                >
                  <span className="text-xl">
                    {liked.has(short.id) ? "❤️" : "🤍"}
                  </span>
                  <span className="text-white font-black">
                    {short.likes + (liked.has(short.id) ? 1 : 0)}
                  </span>
                </button>
                <span className="text-white/70 font-semibold text-sm">
                  💬 {short.comments}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    data-ocid="shorts.pagination_prev"
                    onClick={() => setCurrent((c) => Math.max(c - 1, 0))}
                    disabled={current === 0}
                    className="bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    data-ocid="shorts.pagination_next"
                    onClick={() =>
                      setCurrent((c) => Math.min(c + 1, SHORTS.length - 1))
                    }
                    disabled={current === SHORTS.length - 1}
                    className="bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-40"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile: full screen swipe */}
      <div
        className="md:hidden relative"
        style={{ height: "calc(100dvh - 130px)" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={short.id}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`absolute inset-0 bg-gradient-to-b ${short.gradient} flex flex-col`}
          >
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
              <div className="text-9xl">{short.emoji}</div>
              <p className="font-black text-3xl text-white text-center drop-shadow-lg">
                {short.title}
              </p>
              <p className="text-white/80 font-semibold text-lg">
                by {short.creator}
              </p>
              <p className="text-white/60 text-sm font-semibold mt-2">
                ↕ Swipe up/down
              </p>
            </div>
            <div className="flex items-center justify-between px-6 py-4 bg-black/20">
              <button
                type="button"
                data-ocid={`shorts.like_button.${short.id}`}
                onClick={() => toggleLike(short.id)}
                className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2"
              >
                <span className="text-xl">
                  {liked.has(short.id) ? "❤️" : "🤍"}
                </span>
                <span className="text-white font-black">
                  {short.likes + (liked.has(short.id) ? 1 : 0)}
                </span>
              </button>
              <span className="text-white/70 font-semibold text-sm">
                💬 {short.comments}
              </span>
              <div className="flex gap-1">
                {SHORTS.map((s, i) => (
                  <div
                    key={s.id}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === current ? "bg-white w-4" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
