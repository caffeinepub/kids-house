import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { VideoMeta } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllVideos,
  useIsSubscribed,
  useSubscribeMutation,
  useSubscriberCount,
  useUnsubscribeMutation,
} from "../hooks/useQueries";

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

const DEMO_SHORT_VIDEOS = [
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

type DemoVideo = (typeof DEMO_VIDEOS)[0];

function getVideoExt(videoId: string) {
  try {
    return JSON.parse(localStorage.getItem(`kh_video_ext_${videoId}`) || "{}");
  } catch {
    return {};
  }
}

function getVideoType(videoId: string): "short" | "long" {
  const ext = getVideoExt(videoId);
  return ext.type === "short" ? "short" : "long";
}

function formatId(n: number) {
  return String(n).padStart(3, "0");
}

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// ─── Video Detail Page ───────────────────────────────────────────────

function VideoDetailPage({
  video,
  index,
  allVideos,
  onBack,
  onSelect,
}: {
  video: VideoMeta | DemoVideo;
  index: number;
  allVideos: (VideoMeta | DemoVideo)[];
  onBack: () => void;
  onSelect: (v: VideoMeta | DemoVideo, i: number) => void;
}) {
  const [liked, setLiked] = useState(false);
  const isReal = "blob" in video;
  const isDemo = !isReal;
  const demoVideo = isDemo ? (video as DemoVideo) : null;
  const realVideo = isReal ? (video as VideoMeta) : null;
  const uploaderShort = realVideo
    ? `${realVideo.uploader.toString().slice(0, 10)}...`
    : "Kids House";

  const otherVideos = allVideos.filter((v) => v.id !== video.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      className="min-h-screen bg-background pb-8"
    >
      {/* Back button */}
      <div className="px-4 pt-4 pb-2">
        <button
          type="button"
          data-ocid="videos.button"
          onClick={onBack}
          className="flex items-center gap-2 text-kids-blue font-black text-sm hover:opacity-80 transition-opacity"
        >
          ← Back
        </button>
      </div>

      {/* Main player */}
      <div className="px-4">
        <div className="rounded-3xl overflow-hidden border-4 border-kids-blue/40 shadow-xl bg-black">
          {isReal && realVideo ? (
            // biome-ignore lint/a11y/useMediaCaption: kids video
            <video
              src={realVideo.blob.getDirectURL()}
              controls
              autoPlay
              className="w-full aspect-video bg-black"
            />
          ) : demoVideo ? (
            <div
              className={`w-full aspect-video bg-gradient-to-br ${demoVideo.gradient} flex items-center justify-center`}
            >
              <span className="text-9xl">{demoVideo.emoji}</span>
            </div>
          ) : null}
        </div>

        {/* Title + info */}
        <div className="mt-4">
          <h1 className="text-xl font-black text-foreground leading-tight">
            {video.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1 bg-kids-blue/10 text-kids-blue text-xs font-black px-2.5 py-1 rounded-full border border-kids-blue/30">
              🎬 ID: {formatId(index + 1)}
            </span>
            <span className="inline-flex items-center gap-1 bg-kids-amber/10 text-kids-amber text-xs font-black px-2.5 py-1 rounded-full border border-kids-amber/30">
              👤 {uploaderShort}
            </span>
            {realVideo && <SubscribeButton video={realVideo} />}
            <button
              type="button"
              data-ocid={`videos.like_button.${index + 1}`}
              onClick={() => setLiked((v) => !v)}
              className="ml-auto flex items-center gap-1.5 transition-transform active:scale-125"
            >
              <span className="text-xl">{liked ? "❤️" : "🤍"}</span>
              <span className="text-xs font-black text-muted-foreground">
                {demoVideo
                  ? formatCount(demoVideo.likes + (liked ? 1 : 0))
                  : liked
                    ? "1"
                    : "0"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* More Videos */}
      {otherVideos.length > 0 && (
        <section className="px-4 mt-8">
          <h2 className="text-lg font-black mb-4">
            <span className="text-kids-blue">More Videos </span>
            <span className="text-kids-red">🎬</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {otherVideos.map((v, i) => {
              const isDemoV = !("blob" in v);
              const dv = isDemoV ? (v as DemoVideo) : null;
              const rv = !isDemoV ? (v as VideoMeta) : null;
              return (
                <button
                  key={v.id}
                  type="button"
                  data-ocid={`videos.item.${i + 1}`}
                  onClick={() => onSelect(v, i)}
                  className="rounded-2xl overflow-hidden border-2 border-border shadow-sm hover:shadow-md hover:border-kids-blue/50 transition-all text-left"
                >
                  {rv ? (
                    <video
                      src={rv.blob.getDirectURL()}
                      className="w-full aspect-video bg-black object-cover"
                      preload="metadata"
                      muted
                    />
                  ) : dv ? (
                    <div
                      className={`w-full aspect-video bg-gradient-to-br ${dv.gradient} flex items-center justify-center`}
                    >
                      <span className="text-4xl">{dv.emoji}</span>
                    </div>
                  ) : null}
                  <div className="px-2 py-1.5">
                    <p className="text-xs font-black text-foreground line-clamp-2 leading-snug">
                      {v.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </motion.div>
  );
}

// ─── Subscribe Button ─────────────────────────────────────────────────

function SubscribeButton({ video }: { video: VideoMeta }) {
  const { identity } = useInternetIdentity();
  const myPrincipal = identity?.getPrincipal().toString();
  const isOwnVideo = myPrincipal === video.uploader.toString();

  const { data: subscribed, isLoading: subLoading } = useIsSubscribed(
    isOwnVideo ? null : video.uploader,
  );
  const { data: count } = useSubscriberCount(video.uploader);
  const subscribeMutation = useSubscribeMutation();
  const unsubscribeMutation = useUnsubscribeMutation();

  if (isOwnVideo) return null;
  if (!identity) return null;

  const isPending =
    subscribeMutation.isPending || unsubscribeMutation.isPending;

  const handleClick = () => {
    if (subscribed) {
      unsubscribeMutation.mutate(video.uploader);
    } else {
      subscribeMutation.mutate(video.uploader);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {count !== undefined && count > 0n && (
        <span className="text-[10px] font-black text-muted-foreground">
          {count.toString()} sub{count === 1n ? "" : "s"}
        </span>
      )}
      <button
        type="button"
        data-ocid="videos.toggle"
        disabled={isPending || subLoading}
        onClick={handleClick}
        className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full transition-all active:scale-95 disabled:opacity-60 ${
          subscribed
            ? "bg-teal-100 text-teal-700 border border-teal-300"
            : "bg-kids-amber text-white border border-kids-amber/80 shadow-sm"
        }`}
      >
        {subscribed ? "✅ Subscribed" : "🔔 Subscribe"}
      </button>
    </div>
  );
}

// ─── Demo Video Card ──────────────────────────────────────────────────

function DemoVideoCard({
  video,
  index,
  onClick,
}: {
  video: DemoVideo;
  index: number;
  onClick: () => void;
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
        onClick={() => {
          setShowControls((v) => !v);
          onClick();
        }}
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

// ─── Real Video Card ──────────────────────────────────────────────────

function RealVideoCard({
  video,
  index,
  onClick,
}: {
  video: VideoMeta;
  index: number;
  onClick: () => void;
}) {
  const [liked, setLiked] = useState(false);
  const borderColor = BORDER_COLORS[index % BORDER_COLORS.length];
  const uploaderShort = `${video.uploader.toString().slice(0, 10)}...`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      data-ocid={`videos.item.${index + 1}`}
      className={`rounded-3xl overflow-hidden border-4 ${borderColor} shadow-lg bg-card cursor-pointer`}
    >
      <button
        type="button"
        className="w-full"
        onClick={onClick}
        data-ocid={`videos.play_button.${index + 1}`}
      >
        <video
          src={video.blob.getDirectURL()}
          className="w-full aspect-video bg-black"
          preload="metadata"
          muted
        />
      </button>

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
          <SubscribeButton video={video} />
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

// ─── Short Video Action Bar (TikTok-style) ────────────────────────────

function ShortActionBar({
  liked,
  likeCount,
  commentCount,
  onLike,
  onComment,
  onShare,
  onFollow,
  onAccount,
  followed,
}: {
  liked: boolean;
  likeCount: number;
  commentCount: number;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onFollow: () => void;
  onAccount: () => void;
  followed: boolean;
}) {
  return (
    <div className="absolute right-3 bottom-20 flex flex-col gap-4 items-center z-20">
      {[
        {
          icon: "👤",
          label: "Account",
          onClick: onAccount,
          ocid: "shorts.button",
          active: false,
        },
        {
          icon: liked ? "❤️" : "🤍",
          label: formatCount(likeCount),
          onClick: onLike,
          ocid: "shorts.toggle",
          active: liked,
        },
        {
          icon: "💬",
          label: String(commentCount),
          onClick: onComment,
          ocid: "shorts.button",
          active: false,
        },
        {
          icon: "↗️",
          label: "Share",
          onClick: onShare,
          ocid: "shorts.button",
          active: false,
        },
        {
          icon: followed ? "✅" : "➕",
          label: followed ? "Following" : "Follow",
          onClick: onFollow,
          ocid: "shorts.toggle",
          active: followed,
        },
      ].map((action) => (
        <button
          key={action.label + action.icon}
          type="button"
          data-ocid={action.ocid}
          onClick={action.onClick}
          className="flex flex-col items-center gap-0.5 group"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg transition-transform active:scale-110 group-hover:scale-105 ${
              action.active
                ? "bg-kids-red text-white"
                : "bg-white/90 backdrop-blur-sm"
            }`}
          >
            {action.icon}
          </div>
          <span className="text-white text-[10px] font-black drop-shadow-md">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Real Short Card (with action buttons) ────────────────────────────

function RealShortCard({
  video,
  index,
  current,
}: {
  video: VideoMeta;
  index: number;
  current: number;
}) {
  const ext = getVideoExt(video.id);
  const [liked, setLiked] = useState(false);
  const [followed, setFollowed] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: video.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  return (
    <div
      key={video.id}
      data-ocid={`shorts.item.${index + 1}`}
      style={{
        scrollSnapAlign: "start",
        height: "calc(100dvh - 130px)",
      }}
      className="relative bg-black flex flex-col"
    >
      {/* biome-ignore lint/a11y/useMediaCaption: kids video */}
      <video
        src={video.blob.getDirectURL()}
        controls
        autoPlay={current === index}
        loop
        className="flex-1 w-full object-contain bg-black"
        preload="metadata"
      />
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-sm">
        <div className="flex-1 min-w-0">
          <p className="text-white font-black text-sm truncate">
            {video.title}
          </p>
          {ext.hashtags && ext.hashtags.length > 0 && (
            <p className="text-white/60 text-xs truncate mt-0.5">
              {ext.hashtags
                .slice(0, 3)
                .map((h: string) => `#${h}`)
                .join(" ")}
            </p>
          )}
        </div>
        <span className="ml-3 shrink-0 inline-flex items-center gap-1 bg-kids-amber/20 text-kids-amber text-xs font-black px-2.5 py-1 rounded-full border border-kids-amber/40">
          ⚡ Short
        </span>
      </div>
      <ShortActionBar
        liked={liked}
        likeCount={liked ? 1 : 0}
        commentCount={0}
        onLike={() => setLiked((v) => !v)}
        onComment={() => toast.info("Comments coming soon! 💬")}
        onShare={handleShare}
        onFollow={() => setFollowed((v) => !v)}
        onAccount={() => toast.info("View account 👤")}
        followed={followed}
      />
    </div>
  );
}

// ─── Demo Short Card (with action buttons) ────────────────────────────

function DemoShortCard({
  short,
  index,
  current,
  liked,
  onLike,
  total,
  onNav,
}: {
  short: (typeof DEMO_SHORT_VIDEOS)[0];
  index: number;
  current: number;
  liked: Set<number>;
  onLike: (id: number) => void;
  total: number;
  onNav: (idx: number) => void;
}) {
  const [followed, setFollowed] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: short.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  return (
    <div
      data-ocid={`shorts.item.${index + 1}`}
      style={{
        scrollSnapAlign: "start",
        height: "calc(100dvh - 130px)",
      }}
      className={`relative bg-gradient-to-b ${short.gradient} flex flex-col`}
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
        <motion.div
          animate={current === index ? { scale: [1, 1.15, 1] } : { scale: 1 }}
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
        {current === index && (
          <p className="text-white/60 text-sm font-semibold mt-1 animate-pulse">
            ↕ Swipe to navigate
          </p>
        )}
      </div>

      <div className="flex items-center justify-between px-6 py-4 bg-black/25 backdrop-blur-sm">
        <button
          type="button"
          data-ocid={`shorts.like_button.${index + 1}`}
          onClick={() => onLike(short.id)}
          className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 active:scale-110 transition-transform"
        >
          <span className="text-xl">{liked.has(short.id) ? "❤️" : "🤍"}</span>
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
          {Array.from({ length: total }).map((_, idx) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: positional dots
              key={idx}
              type="button"
              data-ocid="shorts.tab"
              onClick={() => onNav(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === current
                  ? "w-5 h-2.5 bg-white"
                  : "w-2.5 h-2.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* TikTok-style right side action buttons */}
      <ShortActionBar
        liked={liked.has(short.id)}
        likeCount={short.likes + (liked.has(short.id) ? 1 : 0)}
        commentCount={short.views}
        onLike={() => onLike(short.id)}
        onComment={() => toast.info(`💬 ${short.views} views`)}
        onShare={handleShare}
        onFollow={() => setFollowed((v) => !v)}
        onAccount={() => toast.info("👤 Kids Channel")}
        followed={followed}
      />
    </div>
  );
}

// ─── Short Videos Section ─────────────────────────────────────────────

function ShortVideosSection({ allVideos }: { allVideos?: VideoMeta[] }) {
  const [current, setCurrent] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(current);
  currentRef.current = current;
  const touchStartY = useRef(0);

  const realShorts = (allVideos ?? []).filter(
    (v) => getVideoType(v.id) === "short",
  );
  const useRealShorts = realShorts.length > 0;
  const totalCount = useRealShorts
    ? realShorts.length
    : DEMO_SHORT_VIDEOS.length;

  const goTo = useCallback(
    (idx: number) => {
      const next = (idx + totalCount) % totalCount;
      setCurrent(next);
      const el = containerRef.current;
      if (el) {
        const itemHeight = el.clientHeight;
        el.scrollTo({ top: next * itemHeight, behavior: "smooth" });
      }
    },
    [totalCount],
  );

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
          {useRealShorts
            ? realShorts.map((video, i) => (
                <RealShortCard
                  key={video.id}
                  video={video}
                  index={i}
                  current={current}
                />
              ))
            : DEMO_SHORT_VIDEOS.map((short, i) => (
                <DemoShortCard
                  key={short.id}
                  short={short}
                  index={i}
                  current={current}
                  liked={liked}
                  onLike={toggleLike}
                  total={DEMO_SHORT_VIDEOS.length}
                  onNav={goTo}
                />
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

// ─── Main Videos Page ─────────────────────────────────────────────────

export default function VideosPage() {
  const { data: realVideos, isLoading } = useAllVideos();
  const [selectedVideo, setSelectedVideo] = useState<
    VideoMeta | DemoVideo | null
  >(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const longVideos = (realVideos ?? []).filter(
    (v) => getVideoType(v.id) === "long",
  );
  const hasLongVideos = longVideos.length > 0;

  const allDisplayVideos: (VideoMeta | DemoVideo)[] = hasLongVideos
    ? longVideos
    : DEMO_VIDEOS;

  const handleSelectVideo = (v: VideoMeta | DemoVideo, i: number) => {
    setSelectedVideo(v);
    setSelectedIndex(i);
  };

  if (selectedVideo) {
    return (
      <VideoDetailPage
        video={selectedVideo}
        index={selectedIndex}
        allVideos={allDisplayVideos}
        onBack={() => setSelectedVideo(null)}
        onSelect={handleSelectVideo}
      />
    );
  }

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
        ) : hasLongVideos ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {longVideos.map((video, i) => (
              <RealVideoCard
                key={video.id}
                video={video}
                index={i}
                onClick={() => handleSelectVideo(video, i)}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DEMO_VIDEOS.map((video, i) => (
              <DemoVideoCard
                key={video.id}
                video={video}
                index={i}
                onClick={() => handleSelectVideo(video, i)}
              />
            ))}
          </div>
        )}
      </section>

      <ShortVideosSection allVideos={realVideos} />
    </div>
  );
}
