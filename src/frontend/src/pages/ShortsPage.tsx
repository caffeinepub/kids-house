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

  // biome-ignore lint/correctness/useExhaustiveDependencies: stable ref-based handlers
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
    <div
      ref={containerRef}
      className="relative bg-black overflow-hidden"
      style={{ height: "calc(100vh - 130px)" }}
      data-ocid="shorts.canvas_target"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={short.id}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`absolute inset-0 bg-gradient-to-b ${short.gradient} flex items-center justify-center`}
        >
          <span className="text-[120px] opacity-80">{short.emoji}</span>
        </motion.div>
      </AnimatePresence>

      {/* Right side buttons */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-5 items-center z-20">
        <button
          type="button"
          data-ocid="shorts.like_button"
          onClick={() => toggleLike(short.id)}
          className="flex flex-col items-center gap-1"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg transition-transform active:scale-90 ${
              liked.has(short.id)
                ? "bg-kids-red"
                : "bg-white/20 backdrop-blur-sm"
            }`}
          >
            {liked.has(short.id) ? "❤️" : "🤍"}
          </div>
          <span className="text-white text-xs font-black">
            {short.likes + (liked.has(short.id) ? 1 : 0)}
          </span>
        </button>

        <button
          type="button"
          data-ocid="shorts.comment_button"
          className="flex flex-col items-center gap-1"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-lg">
            💬
          </div>
          <span className="text-white text-xs font-black">
            {short.comments}
          </span>
        </button>

        <button
          type="button"
          data-ocid="shorts.share_button"
          className="flex flex-col items-center gap-1"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-lg">
            📤
          </div>
          <span className="text-white text-xs font-black">शेयर</span>
        </button>
      </div>

      {/* Progress dots */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-20">
        {SHORTS.map((s, i) => (
          <button
            type="button"
            key={s.id}
            onClick={() => setCurrent(i)}
            className={`w-1.5 rounded-full transition-all ${
              i === current ? "h-6 bg-white" : "h-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent z-20">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">
            👤
          </div>
          <div>
            <p className="text-white font-black text-sm">{short.creator}</p>
            <p className="text-white/60 text-xs">Follow करें</p>
          </div>
          <button
            type="button"
            className="ml-auto bg-kids-blue text-white text-xs font-black px-3 py-1.5 rounded-full"
          >
            + Follow
          </button>
        </div>
        <p className="text-white font-black text-base">{short.title}</p>
        <p className="text-white/60 text-xs font-semibold mt-0.5">
          Educational & Fun Content 🌟
        </p>
      </div>

      {/* Nav arrows */}
      <button
        type="button"
        data-ocid="shorts.pagination_prev"
        onClick={() => setCurrent((c) => Math.max(c - 1, 0))}
        disabled={current === 0}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-30"
      >
        ▲
      </button>
      <button
        type="button"
        data-ocid="shorts.pagination_next"
        onClick={() => setCurrent((c) => Math.min(c + 1, SHORTS.length - 1))}
        disabled={current === SHORTS.length - 1}
        className="absolute bottom-[7.5rem] left-4 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-30"
      >
        ▼
      </button>
    </div>
  );
}
