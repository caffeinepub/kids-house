import { Skeleton } from "@/components/ui/skeleton";
import { Play } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { VideoMeta } from "../backend";
import { useAllVideos } from "../hooks/useQueries";

const BORDER_COLORS = [
  "border-kids-purple",
  "border-kids-red",
  "border-kids-green",
  "border-kids-blue",
  "border-kids-amber",
];

const FOOTER_COLORS = [
  "bg-kids-purple",
  "bg-kids-red",
  "bg-kids-green",
  "bg-kids-blue",
  "bg-kids-amber",
];

const THUMB_GRADIENTS = [
  "from-purple-300 to-purple-500",
  "from-red-300 to-red-500",
  "from-green-300 to-green-500",
  "from-blue-300 to-blue-500",
  "from-amber-300 to-amber-500",
];

const DEMO_VIDEOS = [
  {
    id: "demo1",
    title: "Counting 1 to 10 with Fruits 🍎",
    uploader: "FunLearn Kids",
    emoji: "🍎",
  },
  {
    id: "demo2",
    title: "ABC Song for Children 🎵",
    uploader: "Happy Kids TV",
    emoji: "🎵",
  },
  {
    id: "demo3",
    title: "Learn Colors with Balloons 🎈",
    uploader: "Rainbow Kids",
    emoji: "🎈",
  },
  {
    id: "demo4",
    title: "Animals Sound Song 🦁",
    uploader: "Animal World",
    emoji: "🦁",
  },
  {
    id: "demo5",
    title: "Draw a Butterfly Step by Step 🦋",
    uploader: "Art for Kids",
    emoji: "🦋",
  },
];

type DisplayVideo = {
  id: string;
  title: string;
  uploader: string;
  emoji?: string;
  blob?: VideoMeta["blob"];
};

function VideoCard({
  video,
  index,
  isDemo,
}: { video: DisplayVideo; index: number; isDemo: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const border = BORDER_COLORS[index % BORDER_COLORS.length];
  const footer = FOOTER_COLORS[index % FOOTER_COLORS.length];
  const gradient = THUMB_GRADIENTS[index % THUMB_GRADIENTS.length];

  const handlePlay = () => setIsPlaying(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      data-ocid={`videos.item.${index + 1}`}
      className={`bg-card rounded-3xl overflow-hidden border-4 ${border} shadow-card`}
    >
      <div className="relative aspect-video">
        {!isDemo && video.blob ? (
          // biome-ignore lint/a11y/useMediaCaption: user-uploaded videos may not have captions
          <video
            src={video.blob.getDirectURL()}
            className="w-full h-full object-cover"
            controls={isPlaying}
            playsInline
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <span className="text-7xl">{isDemo ? video.emoji : "🎬"}</span>
          </div>
        )}
        {!isPlaying && (
          <button
            type="button"
            data-ocid={`videos.play_button.${index + 1}`}
            onClick={handlePlay}
            onKeyDown={(e) => e.key === "Enter" && handlePlay()}
            className="absolute inset-0 flex items-center justify-center group"
            aria-label="Play video"
          >
            <div className="bg-white/80 rounded-full p-4 shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-foreground fill-current" />
            </div>
          </button>
        )}
      </div>
      <div className={`${footer} px-4 py-3`}>
        <p className="font-black text-white text-sm leading-tight truncate">
          {video.title}
        </p>
        <p className="text-white/80 text-xs font-semibold mt-0.5">
          {isDemo ? video.uploader : "Uploaded"}
        </p>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const { data: videos, isLoading } = useAllVideos();

  const hasReal = videos && videos.length > 0;
  const displayVideos: DisplayVideo[] = hasReal
    ? (videos as VideoMeta[]).map((v) => ({
        id: v.id,
        title: v.title,
        blob: v.blob,
        uploader: "Uploaded",
      }))
    : DEMO_VIDEOS;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 bg-background/90 backdrop-blur-sm z-10 px-4 pt-6 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏠</span>
          <div>
            <h1 className="text-2xl font-black leading-tight">
              <span className="text-kids-blue">Kids </span>
              <span className="text-kids-red">House</span>
            </h1>
            <p className="text-xs text-muted-foreground font-semibold">
              Fun videos for kids! 🌈
            </p>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {isLoading ? (
          <div data-ocid="videos.loading_state" className="space-y-4">
            {([1, 2, 3] as const).map((i) => (
              <Skeleton key={i} className="w-full aspect-video rounded-3xl" />
            ))}
          </div>
        ) : (
          <>
            {!hasReal && (
              <div className="bg-card rounded-2xl px-4 py-2 border-2 border-kids-amber">
                <p className="text-xs font-bold text-muted-foreground">
                  🎬 Demo videos — Upload your own!
                </p>
              </div>
            )}
            {displayVideos.map((v, i) => (
              <VideoCard key={v.id} video={v} index={i} isDemo={!hasReal} />
            ))}
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
