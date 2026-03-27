import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Video } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAllVideos, useCallerProfile } from "../hooks/useQueries";

const BORDER_COLORS = [
  "border-kids-blue",
  "border-kids-red",
  "border-kids-green",
  "border-kids-purple",
  "border-kids-amber",
];

function formatId(n: number) {
  return String(n).padStart(3, "0");
}

export default function ProfilePage() {
  const { identity, clear } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useCallerProfile();
  const { data: allVideos, isLoading: videosLoading } = useAllVideos();
  const queryClient = useQueryClient();

  const principal = identity?.getPrincipal().toString() ?? "";
  const shortPrincipal = principal ? `${principal.slice(0, 16)}...` : "";

  const myVideos = (allVideos ?? []).filter(
    (v) => v.uploader.toString() === principal,
  );

  const handleLogout = () => {
    clear();
    queryClient.clear();
  };

  const username = profile?.username ?? "Kid";
  const avatarLetter = username[0]?.toUpperCase() ?? "K";

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Hero card */}
      <div className="px-4 pt-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-br from-kids-blue via-kids-purple to-kids-red p-6 text-white shadow-xl"
        >
          {profileLoading ? (
            <div className="flex items-center gap-4">
              <Skeleton className="w-20 h-20 rounded-full bg-white/30" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32 bg-white/30" />
                <Skeleton className="h-4 w-44 bg-white/30" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/50 flex items-center justify-center text-4xl font-black shadow-lg shrink-0">
                {avatarLetter}
              </div>
              {/* Info */}
              <div className="min-w-0">
                <h1 className="text-2xl font-black leading-tight truncate">
                  {username}
                </h1>
                <p className="text-white/70 text-xs font-semibold mt-1 break-all">
                  ID: {shortPrincipal}
                </p>
                <span className="inline-flex items-center gap-1 mt-2 bg-white/20 rounded-full px-3 py-1 text-xs font-black backdrop-blur-sm">
                  <Video className="w-3 h-3" />
                  {myVideos.length} {myVideos.length === 1 ? "Video" : "Videos"}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* My Videos */}
      <section className="px-4 mt-8">
        <h2 className="text-xl font-black mb-4">
          <span className="text-kids-blue">🎬 My </span>
          <span className="text-kids-purple">Videos</span>
        </h2>

        {videosLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-3xl" />
            ))}
          </div>
        ) : myVideos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            data-ocid="profile.empty_state"
            className="rounded-3xl border-4 border-dashed border-kids-blue/30 bg-kids-blue/5 flex flex-col items-center justify-center py-16 gap-3"
          >
            <div className="text-6xl">🎥</div>
            <p className="font-black text-lg text-kids-blue">No videos yet!</p>
            <p className="text-sm text-muted-foreground font-semibold text-center px-6">
              Tap ➕ Add Video to upload your first video
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myVideos.map((video, i) => {
              const borderColor = BORDER_COLORS[i % BORDER_COLORS.length];
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  data-ocid={`profile.item.${i + 1}`}
                  className={`rounded-3xl border-4 ${borderColor} bg-card overflow-hidden shadow-md`}
                >
                  {/* Video player */}
                  {/* biome-ignore lint/a11y/useMediaCaption: kids video captions not available */}
                  <video
                    src={video.blob.getDirectURL()}
                    controls
                    className="w-full aspect-video bg-black"
                    preload="metadata"
                  />
                  <div className="px-4 py-3">
                    <p className="font-black text-base text-foreground leading-tight mb-2 truncate">
                      {video.title}
                    </p>
                    <span className="inline-flex items-center gap-1 bg-kids-blue/10 text-kids-blue text-xs font-black px-2.5 py-1 rounded-full border border-kids-blue/30">
                      🎬 Video ID: {formatId(i + 1)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Logout */}
      <div className="px-4 mt-10">
        <button
          type="button"
          data-ocid="profile.delete_button"
          onClick={handleLogout}
          className="w-full h-14 rounded-full bg-gradient-to-r from-kids-red to-rose-500 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-opacity active:scale-95"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground font-semibold mt-8 px-4">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="text-kids-blue underline"
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
