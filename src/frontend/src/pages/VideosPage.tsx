import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { VideoMeta } from "../backend";
import { useAllVideos } from "../hooks/useQueries";

const BORDER_COLORS = [
  "border-kids-blue",
  "border-kids-red",
  "border-kids-green",
  "border-kids-purple",
  "border-kids-amber",
];

const DEMO_VIDEOS = [
  {
    id: 1,
    title: "ABC Song Fun 🎵",
    emoji: "🎵",
    gradient: "from-blue-400 via-blue-500 to-indigo-600",
    likes: 1204,
    views: 8430,
    category: "Education",
  },
  {
    id: 2,
    title: "Count with Me! 🍎🍊🍋",
    emoji: "🔢",
    gradient: "from-orange-400 via-amber-500 to-yellow-500",
    likes: 987,
    views: 5621,
    category: "Fun",
  },
  {
    id: 3,
    title: "Dance with Animals 🐘",
    emoji: "🐘",
    gradient: "from-green-400 via-emerald-500 to-teal-600",
    likes: 2341,
    views: 12050,
    category: "Fun",
  },
  {
    id: 4,
    title: "Colors of Rainbow 🌈",
    emoji: "🌈",
    gradient: "from-purple-400 via-pink-500 to-rose-500",
    likes: 1876,
    views: 9870,
    category: "Education",
  },
  {
    id: 5,
    title: "Coding for Kids 💻",
    emoji: "💻",
    gradient: "from-cyan-400 via-sky-500 to-blue-600",
    likes: 654,
    views: 3320,
    category: "Coding",
  },
  {
    id: 6,
    title: "Draw a Butterfly 🦋",
    emoji: "🦋",
    gradient: "from-pink-400 via-rose-500 to-red-500",
    likes: 1532,
    views: 7800,
    category: "Fun",
  },
];

const SHORT_VIDEOS = [
  {
    id: 1,
    title: "Quick ABC! 🔤",
    emoji: "🔤",
    gradient: "from-blue-500 via-indigo-500 to-violet-600",
    likes: 432,
    views: 3210,
  },
  {
    id: 2,
    title: "Math Magic ✨",
    emoji: "✨",
    gradient: "from-amber-400 via-orange-500 to-red-500",
    likes: 765,
    views: 5432,
  },
  {
    id: 3,
    title: "Animal Sounds 🦁",
    emoji: "🦁",
    gradient: "from-green-500 via-teal-500 to-cyan-600",
    likes: 988,
    views: 8901,
  },
  {
    id: 4,
    title: "Rainbow Dance 🌈",
    emoji: "🌈",
    gradient: "from-pink-500 via-fuchsia-500 to-purple-600",
    likes: 1123,
    views: 11230,
  },
  {
    id: 5,
    title: "Space Adventure 🚀",
    emoji: "🚀",
    gradient: "from-slate-700 via-blue-800 to-indigo-900",
    likes: 540,
    views: 4210,
  },
  {
    id: 6,
    title: "Flower Art 🌸",
    emoji: "🌸",
    gradient: "from-rose-400 via-pink-500 to-fuchsia-600",
    likes: 876,
    views: 7654,
  },
];

function formatId(n: number) {
  return String(n).padStart(3, "0");
}

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function DemoVideoCard({
  video,
  index,
}: {
  video: (typeof DEMO_VIDEOS)[0];
  index: number;
}) {
  const [liked, setLiked] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const borderColor = BORDER_COLORS[index % BORDER_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      data-ocid={`videos.item.${index + 1}`}
      className={`rounded-3xl overflow-hidden border-4 ${borderColor} shadow-lg bg-card`}
    >
      <button
        type="button"
        data-ocid={`videos.play_button.${index + 1}`}
        onClick={() => setShowControls((v) => !v)}
        className={`relative w-full aspect-video bg-gradient-to-br ${video.gradient} flex items-center justify-center group`}
      >
        <div className="text-7xl md:text-8xl">{video.emoji}</div>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
            <span className="text-3xl ml-1">{showControls ? "⏸" : "▶️"}</span>
          </div>
        </div>
        {showControls && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/40 rounded-xl px-3 py-1 flex items-center gap-2">
            <span className="text-white text-xs font-bold">▶</span>
            <div className="flex-1 h-1.5 bg-white/30 rounded-full">
              <div className="h-full w-1/3 bg-white rounded-full" />
            </div>
            <span className="text-white text-xs">🔊</span>
          </div>
        )}
      </button>

      <div className="px-4 py-3">
        <p className="font-black text-base md:text-lg text-foreground leading-tight mb-2">
          {video.title}
        </p>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 bg-kids-blue/10 text-kids-blue text-xs font-black px-2.5 py-1 rounded-full border border-kids-blue/30">
            🎬 Video ID: {formatId(video.id)}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-ocid={`videos.like_button.${index + 1}`}
              onClick={() => setLiked((v) => !v)}
              className="flex items-center gap-1 transition-transform active:scale-125"
            >
              <span className="text-lg">{liked ? "❤️" : "🤍"}</span>
              <span className="text-xs font-black text-muted-foreground">
                {formatCount(video.likes + (liked ? 1 : 0))}
              </span>
            </button>
            <div className="flex items-center gap-1">
              <span className="text-lg">👁️</span>
              <span className="text-xs font-black text-muted-foreground">
                {formatCount(video.views)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RealVideoCard({ video, index }: { video: VideoMeta; index: number }) {
  const [liked, setLiked] = useState(false);
  const borderColor = BORDER_COLORS[index % BORDER_COLORS.length];
  const uploaderShort = `${video.uploader.toString().slice(0, 10)}...`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      data-ocid={`videos.item.${index + 1}`}
      className={`rounded-3xl overflow-hidden border-4 ${borderColor} shadow-lg bg-card`}
    >
      {/* biome-ignore lint/a11y/useMediaCaption: kids video captions not available */}
      <video
        src={video.blob.getDirectURL()}
        controls
        className="w-full aspect-video bg-black"
        preload="metadata"
      />

      <div className="px-4 py-3">
        <p className="font-black text-base md:text-lg text-foreground leading-tight mb-2 truncate">
          {video.title}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-kids-blue/10 text-kids-blue text-xs font-black px-2.5 py-1 rounded-full border border-kids-blue/30">
            🎬 Video ID: {formatId(index + 1)}
          </span>
          <span className="inline-flex items-center gap-1 bg-kids-amber/10 text-kids-amber text-xs font-black px-2.5 py-1 rounded-full border border-kids-amber/30">
            👤 By: {uploaderShort}
          </span>
          <button
            type="button"
            data-ocid={`videos.like_button.${index + 1}`}
            onClick={() => setLiked((v) => !v)}
            className="ml-auto flex items-center gap-1 transition-transform active:scale-125"
          >
            <span className="text-lg">{liked ? "❤️" : "🤍"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ShortVideosSection() {
  const [current, setCurrent] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(current);
  currentRef.current = current;
  const touchStartY = useRef(0);

  const goTo = useCallback((idx: number) => {
    const next = (idx + SHORT_VIDEOS.length) % SHORT_VIDEOS.length;
    setCurrent(next);
    const el = containerRef.current;
    if (el) {
      const itemHeight = el.clientHeight;
      el.scrollTo({ top: next * itemHeight, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo(currentRef.current + 1);
    }, 7000);
    return () => clearInterval(timer);
  }, [goTo]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollTop / el.clientHeight);
      if (idx !== currentRef.current) setCurrent(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (delta > 60) goTo(currentRef.current + 1);
      else if (delta < -60) goTo(currentRef.current - 1);
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [goTo]);

  const toggleLike = (id: number) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="mt-10">
      <h2 className="text-2xl md:text-3xl font-black mb-4 px-4">
        <span className="text-kids-amber">⚡ </span>
        <span className="text-kids-red">Short </span>
        <span className="text-kids-purple">Videos</span>
      </h2>

      <div className="relative">
        <div
          ref={containerRef}
          data-ocid="shorts.panel"
          className="overflow-y-scroll rounded-3xl"
          style={{
            height: "calc(100dvh - 130px)",
            scrollSnapType: "y mandatory",
            scrollbarWidth: "none",
          }}
        >
          {SHORT_VIDEOS.map((short, i) => (
            <div
              key={short.id}
              data-ocid={`shorts.item.${i + 1}`}
              style={{
                scrollSnapAlign: "start",
                height: "calc(100dvh - 130px)",
              }}
              className={`relative bg-gradient-to-b ${short.gradient} flex flex-col`}
            >
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
                <motion.div
                  animate={
                    current === i ? { scale: [1, 1.15, 1] } : { scale: 1 }
                  }
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="text-8xl md:text-9xl"
                >
                  {short.emoji}
                </motion.div>
                <p className="font-black text-2xl md:text-3xl text-white text-center drop-shadow-lg">
                  {short.title}
                </p>
                <span className="inline-flex items-center gap-1 bg-white/20 text-white text-sm font-black px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/30">
                  ⚡ Short ID: {formatId(short.id)}
                </span>
                {current === i && (
                  <p className="text-white/60 text-sm font-semibold mt-1 animate-pulse">
                    ↕ Swipe to navigate
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between px-6 py-4 bg-black/25 backdrop-blur-sm">
                <button
                  type="button"
                  data-ocid={`shorts.like_button.${i + 1}`}
                  onClick={() => toggleLike(short.id)}
                  className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 active:scale-110 transition-transform"
                >
                  <span className="text-xl">
                    {liked.has(short.id) ? "❤️" : "🤍"}
                  </span>
                  <span className="text-white font-black">
                    {formatCount(short.likes + (liked.has(short.id) ? 1 : 0))}
                  </span>
                </button>

                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <span className="text-lg">👁️</span>
                  <span className="text-white font-black">
                    {formatCount(short.views)}
                  </span>
                </div>

                <div className="flex gap-1.5 items-center">
                  {SHORT_VIDEOS.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      data-ocid="shorts.tab"
                      onClick={() => goTo(idx)}
                      className={`rounded-full transition-all duration-300 ${
                        idx === current
                          ? "w-5 h-2.5 bg-white"
                          : "w-2.5 h-2.5 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:flex flex-col gap-2 absolute right-3 top-1/2 -translate-y-1/2 z-10">
          <button
            type="button"
            data-ocid="shorts.pagination_prev"
            onClick={() => goTo(current - 1)}
            className="w-10 h-10 rounded-full bg-white/80 shadow-lg flex items-center justify-center font-black text-kids-blue hover:bg-white transition-colors"
          >
            ↑
          </button>
          <button
            type="button"
            data-ocid="shorts.pagination_next"
            onClick={() => goTo(current + 1)}
            className="w-10 h-10 rounded-full bg-white/80 shadow-lg flex items-center justify-center font-black text-kids-blue hover:bg-white transition-colors"
          >
            ↓
          </button>
        </div>
      </div>
    </section>
  );
}

export default function VideosPage() {
  const { data: realVideos, isLoading } = useAllVideos();
  const hasRealVideos = realVideos && realVideos.length > 0;

  return (
    <div className="min-h-screen bg-background pb-8">
      <section className="px-4 pt-6">
        <h1 className="text-2xl md:text-3xl font-black mb-5">
          <span className="text-kids-blue">🎬 </span>
          <span className="text-kids-red">Videos</span>
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                data-ocid="videos.loading_state"
                className="rounded-3xl overflow-hidden border-4 border-border animate-pulse"
              >
                <Skeleton className="w-full aspect-video" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : hasRealVideos ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {realVideos.map((video, i) => (
              <RealVideoCard key={video.id} video={video} index={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DEMO_VIDEOS.map((video, i) => (
              <DemoVideoCard key={video.id} video={video} index={i} />
            ))}
          </div>
        )}
      </section>

      <ShortVideosSection />
    </div>
  );
}
