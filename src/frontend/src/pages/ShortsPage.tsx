import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

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

export default function ShortsPage() {
  const [current, setCurrent] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(current);
  currentRef.current = current;

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
      if (delta > 60) setCurrent((c) => Math.min(c + 1, SHORTS.length - 1));
      else if (delta < -60) setCurrent((c) => Math.max(c - 1, 0));
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const short = SHORTS[current];

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
                    onClick={() => setCurrent((c) => Math.max(c - 1, 0))}
                    disabled={current === 0}
                    className="bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
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
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? "bg-white w-4" : "bg-white/40"}`}
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
