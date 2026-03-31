import { Skeleton } from "@/components/ui/skeleton";
import { Play } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { VideoMeta } from "../backend";
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

const THUMB_GRADIENTS = [
  "from-blue-200 to-blue-400",
  "from-red-200 to-red-400",
  "from-green-200 to-green-400",
  "from-purple-200 to-purple-400",
  "from-amber-200 to-amber-400",
];

const DEMO_VIDEOS = [
  {
    id: "demo1",
    title: "Counting 1 to 10 with Fruits 🍎",
    uploader: "FunLearn Kids",
    emoji: "🍎",
    category: "education",
    likes: 342,
  },
  {
    id: "demo2",
    title: "ABC Song for Children 🎵",
    uploader: "Happy Kids TV",
    emoji: "🎵",
    category: "education",
    likes: 521,
  },
  {
    id: "demo3",
    title: "Learn Colors with Balloons 🎈",
    uploader: "Rainbow Kids",
    emoji: "🎈",
    category: "fun",
    likes: 289,
  },
  {
    id: "demo4",
    title: "Python for Kids - Episode 1 💻",
    uploader: "Code Kids",
    emoji: "💻",
    category: "coding",
    likes: 198,
  },
  {
    id: "demo5",
    title: "How to be a Doctor 🏥",
    uploader: "Career Kids",
    emoji: "🏥",
    category: "career",
    likes: 156,
  },
  {
    id: "demo6",
    title: "Fun Math Tricks 🔢",
    uploader: "Math Magic",
    emoji: "🔢",
    category: "education",
    likes: 412,
  },
];

type DisplayVideo = {
  id: string;
  title: string;
  uploader: string;
  emoji?: string;
  blob?: VideoMeta["blob"];
  category?: string;
  likes: number;
};

function VideoCard({
  video,
  index,
  isDemo,
}: { video: DisplayVideo; index: number; isDemo: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes);

  const handleLike = () => {
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
      data-ocid={`videos.item.${index + 1}`}
      className={`bg-card rounded-3xl overflow-hidden border-4 ${BORDER_COLORS[index % BORDER_COLORS.length]} shadow-card`}
    >
      <div className="relative aspect-video">
        {!isDemo && video.blob ? (
          // biome-ignore lint/a11y/useMediaCaption: user-uploaded content
          <video
            src={video.blob.getDirectURL()}
            className="w-full h-full object-cover"
            controls={isPlaying}
            playsInline
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${THUMB_GRADIENTS[index % THUMB_GRADIENTS.length]} flex items-center justify-center`}
          >
            <span className="text-7xl">{video.emoji ?? "🎦"}</span>
          </div>
        )}
        {!isPlaying && (
          <button
            type="button"
            data-ocid={`videos.play_button.${index + 1}`}
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center group"
            aria-label="Play video"
          >
            <div className="bg-white/80 rounded-full p-4 shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-foreground fill-current" />
            </div>
          </button>
        )}
      </div>
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
          data-ocid={`videos.like_button.${index + 1}`}
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

export default function HomePage() {
  const { data: videos, isLoading } = useAllVideos();
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const { t } = useLanguage();

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
    ? (videos as VideoMeta[]).map((v) => ({
        id: v.id,
        title: v.title,
        blob: v.blob,
        uploader: "Uploaded",
        likes: 0,
      }))
    : DEMO_VIDEOS;

  const filtered = allVideos.filter((v) => {
    const matchCat = activeCategory === "all" || v.category === activeCategory;
    const matchSearch =
      !search || v.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

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
            data-ocid="videos.loading_state"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-full aspect-video rounded-3xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div data-ocid="videos.empty_state" className="text-center py-16">
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
                <VideoCard key={v.id} video={v} index={i} isDemo={!hasReal} />
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
    </div>
  );
}
