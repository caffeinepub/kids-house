import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ExternalBlob, VideoMeta } from "../backend";
import { useLanguage } from "../contexts/LanguageContext";
import { useAllVideos } from "../hooks/useQueries";

const CATEGORY_IDS = [
  { id: "all", emoji: "🌈" },
  { id: "education", emoji: "📖" },
  { id: "fun", emoji: "😄" },
  { id: "coding", emoji: "💻" },
  { id: "career", emoji: "🌟" },
  { id: "games", emoji: "🎮" },
] as const;

const BORDER_COLORS = [
  "border-kids-blue",
  "border-kids-red",
  "border-kids-green",
  "border-kids-purple",
  "border-kids-amber",
];

const FOOTER_GRADIENTS = [
  "from-kids-blue to-blue-600",
  "from-kids-red to-red-600",
  "from-kids-green to-green-600",
  "from-kids-purple to-purple-700",
  "from-kids-amber to-amber-600",
];

const DEMO_VIDEOS = [
  {
    id: 1,
    title: "Counting 1 to 10 with Fruits 🍎",
    uploader: "FunLearn Kids",
    emoji: "🍎",
    gradient: "from-blue-400 via-blue-500 to-indigo-600",
    category: "education",
    likes: 342,
    views: 4230,
  },
  {
    id: 2,
    title: "ABC Song for Children 🎵",
    uploader: "Happy Kids TV",
    emoji: "🎵",
    gradient: "from-orange-400 via-amber-500 to-yellow-500",
    category: "education",
    likes: 521,
    views: 7890,
  },
  {
    id: 3,
    title: "Learn Colors with Balloons 🎈",
    uploader: "Rainbow Kids",
    emoji: "🎈",
    gradient: "from-green-400 via-emerald-500 to-teal-600",
    category: "fun",
    likes: 289,
    views: 3120,
  },
  {
    id: 4,
    title: "Python for Kids - Episode 1 💻",
    uploader: "Code Kids",
    emoji: "💻",
    gradient: "from-cyan-400 via-sky-500 to-blue-600",
    category: "coding",
    likes: 198,
    views: 2340,
  },
  {
    id: 5,
    title: "How to be a Doctor 🏥",
    uploader: "Career Kids",
    emoji: "🏥",
    gradient: "from-purple-400 via-pink-500 to-rose-500",
    category: "career",
    likes: 156,
    views: 1980,
  },
  {
    id: 6,
    title: "Fun Math Tricks 🔢",
    uploader: "Math Magic",
    emoji: "🔢",
    gradient: "from-pink-400 via-rose-500 to-red-500",
    category: "education",
    likes: 412,
    views: 5670,
  },
];

type DemoVideo = (typeof DEMO_VIDEOS)[0];

type DisplayVideo = {
  id: number | string;
  title: string;
  uploader: string;
  emoji?: string;
  gradient?: string;
  blob?: ExternalBlob;
  category?: string;
  likes: number;
  views?: number;
};

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// ─── Demo Player (inside modal) ───────────────────────────────────────

function DemoPlayer({
  video,
  playing,
  onPlay,
  onPause,
}: {
  video: DemoVideo;
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
}) {
  return (
    <div
      className={`relative w-full aspect-video bg-gradient-to-br ${video.gradient} flex items-center justify-center overflow-hidden`}
    >
      {/* Big emoji background */}
      <motion.span
        animate={playing ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{
          duration: 2,
          repeat: playing ? Number.POSITIVE_INFINITY : 0,
          ease: "easeInOut",
        }}
        className="text-[100px] md:text-[120px] select-none"
      >
        {video.emoji ?? "🎦"}
      </motion.span>

      {!playing ? (
        /* Watch Video button */
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <motion.button
            type="button"
            data-ocid="home.primary_button"
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.94 }}
            onClick={onPlay}
            className="flex items-center gap-3 bg-white text-gray-900 font-black text-lg px-8 py-4 rounded-full shadow-2xl border-4 border-white/40 hover:bg-white/95 transition-colors"
          >
            <span className="text-2xl">▶</span>
            Watch Video
          </motion.button>
        </div>
      ) : (
        /* Playing state overlay */
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-8 pb-3">
          <div className="flex items-center gap-3 mb-2">
            <button
              type="button"
              data-ocid="home.toggle"
              onClick={onPause}
              className="w-9 h-9 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              ⏸
            </button>
            <div className="flex-1">
              <p className="text-white text-xs font-black truncate mb-1">
                {video.title}
              </p>
              <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{
                    animation: "demo-progress 30s linear forwards",
                  }}
                />
              </div>
            </div>
            <span className="text-white text-xs font-bold">3:24</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes demo-progress {
          from { width: 0% }
          to { width: 100% }
        }
      `}</style>
    </div>
  );
}

// ─── Real Player (inside modal) ───────────────────────────────────────

function RealPlayer({
  blobUrl,
  playing,
  videoRef,
  onPlay,
}: {
  blobUrl: string;
  playing: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onPlay: () => void;
}) {
  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden">
      {/* biome-ignore lint/a11y/useMediaCaption: kids video */}
      <video
        ref={videoRef}
        src={blobUrl}
        controls={playing}
        className="w-full h-full object-contain bg-black"
        preload="metadata"
      />
      {!playing && (
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4">
          <motion.button
            type="button"
            data-ocid="home.primary_button"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.93 }}
            onClick={onPlay}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-black text-xl px-10 py-5 rounded-full shadow-2xl min-w-[160px] justify-center hover:from-blue-400 hover:to-purple-500 transition-all"
          >
            <span className="text-3xl">▶</span>
            Play
          </motion.button>
          <p className="text-white/70 text-sm font-semibold">
            Click to start playing
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Video Player Modal ───────────────────────────────────────────────

function VideoPlayerModal({
  video,
  index,
  allVideos,
  onClose,
  onSelect,
}: {
  video: DisplayVideo;
  index: number;
  allVideos: DisplayVideo[];
  onClose: () => void;
  onSelect: (v: DisplayVideo, i: number) => void;
}) {
  const isReal = !!video.blob;
  const [liked, setLiked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const otherVideos = allVideos.filter((v) => v.id !== video.id);

  // Lock body scroll when modal open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handlePlayReal = useCallback(() => {
    setPlaying(true);
    setTimeout(() => videoRef.current?.play(), 50);
  }, []);

  const demoVideoTyped: DemoVideo | null = !isReal
    ? {
        id: typeof video.id === "number" ? video.id : 0,
        title: video.title,
        uploader: video.uploader,
        emoji: video.emoji ?? "🎦",
        gradient: video.gradient ?? "from-blue-400 to-indigo-600",
        category: video.category ?? "education",
        likes: video.likes,
        views: video.views ?? 0,
      }
    : null;

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: escape key handled via useEffect
    <div
      data-ocid="home.modal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal card — stop propagation so clicking inside doesn't close */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Close button */}
        <button
          type="button"
          data-ocid="home.close_button"
          onClick={onClose}
          className="sticky top-3 left-full mr-3 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center text-lg hover:bg-black/80 transition-colors shadow-lg"
          style={{ marginLeft: "calc(100% - 2.5rem - 0.75rem)" }}
          aria-label="Close video"
        >
          ✕
        </button>

        {/* ── Player Area ── */}
        {!isReal && demoVideoTyped ? (
          <DemoPlayer
            video={demoVideoTyped}
            playing={playing}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        ) : isReal && video.blob ? (
          <RealPlayer
            blobUrl={video.blob.getDirectURL()}
            playing={playing}
            videoRef={videoRef}
            onPlay={handlePlayReal}
          />
        ) : null}

        {/* ── Info & actions ── */}
        <div className="px-5 pt-4 pb-2">
          <h2 className="text-xl font-black text-gray-900 leading-tight">
            {video.title}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-black px-2.5 py-1 rounded-full border border-blue-200">
              🎬 Video #{index + 1}
            </span>
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-black px-2.5 py-1 rounded-full border border-amber-200">
              👤 {video.uploader}
            </span>
            {video.views !== undefined && (
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-xs font-black px-2.5 py-1 rounded-full border border-green-200">
                👁️ {formatCount(video.views)}
              </span>
            )}
            <button
              type="button"
              data-ocid={`home.like_button.${index + 1}`}
              onClick={() => setLiked((v) => !v)}
              className="ml-auto flex items-center gap-1.5 transition-transform active:scale-125"
            >
              <span className="text-xl">{liked ? "❤️" : "🤍"}</span>
              <span className="text-xs font-black text-gray-400">
                {formatCount(video.likes + (liked ? 1 : 0))}
              </span>
            </button>
          </div>
        </div>

        {/* Kids House badge */}
        <div className="px-5 pb-4">
          <div className="mt-3 flex items-center gap-2 py-2.5 px-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
            <span className="text-2xl">🏠</span>
            <div>
              <p className="text-xs font-black text-blue-700">Kids House</p>
              <p className="text-[11px] text-gray-500">
                Safe &amp; Fun Learning for Kids
              </p>
            </div>
          </div>
        </div>

        {/* Separator + More Videos strip */}
        {otherVideos.length > 0 && (
          <>
            <div className="mx-5 border-t border-gray-100" />

            <div className="px-5 pt-4 pb-6">
              <h3 className="text-base font-black mb-3 text-gray-800">
                <span className="text-kids-blue">More Videos </span>
                <span className="text-kids-red">🎬</span>
              </h3>
              <div
                className="flex gap-3 overflow-x-auto pb-1"
                style={{ scrollbarWidth: "none" }}
              >
                {otherVideos.map((v, i) => (
                  <button
                    key={v.id}
                    type="button"
                    data-ocid={`home.item.${i + 1}`}
                    onClick={() => onSelect(v, allVideos.indexOf(v))}
                    className="flex-shrink-0 w-36 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left"
                  >
                    {v.blob ? (
                      // biome-ignore lint/a11y/useMediaCaption: thumbnail
                      <video
                        src={v.blob.getDirectURL()}
                        className="w-full aspect-video bg-black object-cover"
                        preload="metadata"
                        muted
                      />
                    ) : (
                      <div
                        className={`w-full aspect-video bg-gradient-to-br ${
                          v.gradient ?? "from-blue-400 to-indigo-600"
                        } flex items-center justify-center`}
                      >
                        <span className="text-2xl">{v.emoji ?? "🎦"}</span>
                      </div>
                    )}
                    <div className="px-2 py-1.5 bg-white">
                      <p className="text-xs font-black text-gray-800 line-clamp-2 leading-snug">
                        {v.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

// ─── Video Card ───────────────────────────────────────────────────────

function VideoCard({
  video,
  index,
  onClick,
}: {
  video: DisplayVideo;
  index: number;
  onClick: () => void;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes);
  const isReal = !!video.blob;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => {
      setLikeCount((c) => c + (prev ? -1 : 1));
      return !prev;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      data-ocid={`home.item.${index + 1}`}
      className={`bg-card rounded-3xl overflow-hidden border-4 ${BORDER_COLORS[index % BORDER_COLORS.length]} shadow-card`}
    >
      {/* Thumbnail / click area */}
      <button
        type="button"
        data-ocid={`home.play_button.${index + 1}`}
        onClick={onClick}
        className="relative w-full aspect-video block group"
        aria-label={`Play: ${video.title}`}
      >
        {isReal && video.blob ? (
          // biome-ignore lint/a11y/useMediaCaption: thumbnail
          <video
            src={video.blob.getDirectURL()}
            className="w-full h-full object-cover"
            preload="metadata"
            muted
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${
              video.gradient ?? "from-blue-400 to-indigo-600"
            } flex items-center justify-center`}
          >
            <span className="text-7xl">{video.emoji ?? "🎦"}</span>
          </div>
        )}
        {/* Hover overlay with play button */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all">
            <span className="text-3xl ml-1">▶️</span>
          </div>
        </div>
      </button>

      {/* Footer bar */}
      <div
        className={`bg-gradient-to-r ${FOOTER_GRADIENTS[index % FOOTER_GRADIENTS.length]} px-4 py-3 flex items-center justify-between`}
      >
        <div className="flex-1 min-w-0">
          <p className="font-black text-white text-sm leading-tight truncate">
            {video.title}
          </p>
          <p className="text-white/80 text-xs font-semibold mt-0.5">
            {video.uploader}
          </p>
        </div>
        <button
          type="button"
          data-ocid={`home.like_button.${index + 1}`}
          onClick={handleLike}
          className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 ml-2 flex-shrink-0"
        >
          <span className="text-sm">{liked ? "❤️" : "🤍"}</span>
          <span className="text-white text-xs font-black">{likeCount}</span>
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main HomePage ────────────────────────────────────────────────────

export default function HomePage() {
  const { data: videos, isLoading } = useAllVideos();
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const { t } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState<DisplayVideo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const catLabels: Record<string, string> = {
    all: t.home.categories.all,
    education: t.home.categories.education,
    fun: t.home.categories.fun,
    coding: t.home.categories.coding,
    career: t.home.categories.career,
    games: t.home.categories.games,
  };

  const hasReal = videos && videos.length > 0;
  const allVideos: DisplayVideo[] = hasReal
    ? (videos as VideoMeta[]).map((v, i) => ({
        id: v.id,
        title: v.title,
        blob: v.blob,
        uploader: "Uploaded",
        likes: 0,
        gradient: DEMO_VIDEOS[i % DEMO_VIDEOS.length].gradient,
        emoji: DEMO_VIDEOS[i % DEMO_VIDEOS.length].emoji,
      }))
    : DEMO_VIDEOS;

  const filtered = allVideos.filter((v) => {
    const matchCat = activeCategory === "all" || v.category === activeCategory;
    const matchSearch =
      !search || v.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSelectVideo = (v: DisplayVideo, i: number) => {
    setSelectedVideo(v);
    setSelectedIndex(i);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 md:px-8 pt-4 pb-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
            🔍
          </span>
          <input
            data-ocid="home.search_input"
            placeholder={t.home.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded-2xl border-2 border-border bg-card font-semibold text-sm focus:outline-none focus:border-kids-blue"
          />
        </div>
      </div>

      <div className="flex gap-2 px-4 md:px-8 py-2 overflow-x-auto no-scrollbar">
        {CATEGORY_IDS.map((cat) => (
          <button
            type="button"
            key={cat.id}
            data-ocid={`home.${cat.id}.tab`}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-full text-xs font-black border-2 transition-all ${
              activeCategory === cat.id
                ? "bg-kids-blue text-white border-kids-blue shadow-btn"
                : "bg-card text-foreground border-border"
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{catLabels[cat.id]}</span>
          </button>
        ))}
      </div>

      <div className="px-4 md:px-8 py-3">
        {isLoading ? (
          <div
            data-ocid="home.loading_state"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-full aspect-video rounded-3xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div data-ocid="home.empty_state" className="text-center py-16">
            <div className="text-6xl mb-3">🔍</div>
            <p className="font-black text-xl text-muted-foreground">
              {t.home.noVideos}
            </p>
          </div>
        ) : (
          <>
            {!hasReal && (
              <div className="bg-kids-amber/10 rounded-2xl px-4 py-2 border-2 border-kids-amber mb-4">
                <p className="text-xs font-bold text-kids-amber">
                  🎦 {t.home.demoNote}
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((v, i) => (
                <VideoCard
                  key={v.id}
                  video={v}
                  index={i}
                  onClick={() => handleSelectVideo(v, i)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <footer className="text-center py-6 text-xs text-muted-foreground font-semibold px-4">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          index={selectedIndex}
          allVideos={filtered}
          onClose={() => setSelectedVideo(null)}
          onSelect={handleSelectVideo}
        />
      )}
    </div>
  );
}
