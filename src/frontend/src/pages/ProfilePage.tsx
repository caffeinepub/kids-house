import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Principal } from "@icp-sdk/core/principal";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, LogOut, Users, Video } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllVideos,
  useCallerProfile,
  useMySubscriptions,
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

function formatId(n: number) {
  return String(n).padStart(3, "0");
}

function getVideoExt(videoId: string) {
  try {
    return JSON.parse(localStorage.getItem(`kh_video_ext_${videoId}`) || "{}");
  } catch {
    return {};
  }
}

function useProfilePicture(principalStr: string) {
  const key = `profile_pic_${principalStr}`;
  const [pic, setPicState] = useState<string | null>(() =>
    principalStr ? localStorage.getItem(key) : null,
  );
  const setPic = (dataUrl: string) => {
    localStorage.setItem(key, dataUrl);
    setPicState(dataUrl);
  };
  return { pic, setPic };
}

function SubscribedChannelCard({
  creator,
  videoCount,
  index,
}: {
  creator: Principal;
  videoCount: number;
  index: number;
}) {
  const { data: subCount } = useSubscriberCount(creator);
  const unsubscribeMutation = useUnsubscribeMutation();
  const borderColor = BORDER_COLORS[index % BORDER_COLORS.length];
  const shortId = `${creator.toString().slice(0, 10)}...`;
  const avatarLetter = creator.toString()[0]?.toUpperCase() ?? "?";
  const picKey = `profile_pic_${creator.toString()}`;
  const creatorPic =
    typeof localStorage !== "undefined" ? localStorage.getItem(picKey) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      data-ocid={`subscriptions.item.${index + 1}`}
      className={`rounded-2xl border-4 ${borderColor} bg-card px-4 py-3 flex items-center gap-3 shadow-sm`}
    >
      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-kids-blue to-kids-purple flex items-center justify-center text-white font-black text-lg shrink-0 overflow-hidden">
        {creatorPic ? (
          <img
            src={creatorPic}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          avatarLetter
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-sm text-foreground truncate">{shortId}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground font-semibold">
            🎬 {videoCount} video{videoCount !== 1 ? "s" : ""}
          </span>
          {subCount !== undefined && (
            <span className="text-xs text-muted-foreground font-semibold">
              · 👥 {subCount.toString()} subscriber{subCount === 1n ? "" : "s"}
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        data-ocid={`subscriptions.delete_button.${index + 1}`}
        disabled={unsubscribeMutation.isPending}
        onClick={() => unsubscribeMutation.mutate(creator)}
        className="shrink-0 text-xs font-black px-3 py-1.5 rounded-full border-2 border-kids-red text-kids-red hover:bg-kids-red hover:text-white transition-all active:scale-95 disabled:opacity-50"
      >
        Unsubscribe
      </button>
    </motion.div>
  );
}

interface VideoMeta {
  id: string;
  title: string;
  uploader: Principal;
  blob: { getDirectURL(): string };
}

function LongVideoCard({ video, index }: { video: VideoMeta; index: number }) {
  const ext = getVideoExt(video.id);
  const hashtags: string[] = ext.hashtags ?? [];
  const thumbnail: string | null = ext.thumbnailDataUrl ?? null;
  const borderColor = BORDER_COLORS[index % BORDER_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      data-ocid={`profile.item.${index + 1}`}
      className={`rounded-2xl border-2 ${borderColor} bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Full-width thumbnail on top */}
      <div className="w-full aspect-video bg-black/5 relative overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={video.blob.getDirectURL()}
            className="w-full h-full object-cover"
            preload="metadata"
            muted
          />
        )}
        <span className="absolute bottom-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-full bg-kids-blue text-white">
          🎬 Long
        </span>
      </div>
      {/* Info below */}
      <div className="px-3 py-2.5">
        <p className="font-black text-sm text-foreground leading-snug line-clamp-2 mb-1.5">
          {video.title}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-muted-foreground font-semibold">
            ID: {formatId(index + 1)}
          </span>
          {hashtags.length > 0 && (
            <span className="text-[10px] text-kids-blue/70 font-semibold truncate">
              {hashtags
                .slice(0, 3)
                .map((h) => `#${h}`)
                .join(" ")}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ShortVideoCard({ video, index }: { video: VideoMeta; index: number }) {
  const ext = getVideoExt(video.id);
  const hashtags: string[] = ext.hashtags ?? [];
  const thumbnail: string | null = ext.thumbnailDataUrl ?? null;
  const borderColor = BORDER_COLORS[index % BORDER_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      data-ocid={`profile.item.${index + 1}`}
      className={`rounded-xl border-2 ${borderColor} bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Vertical portrait thumbnail */}
      <div className="w-full aspect-[9/16] bg-black/5 relative overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={video.blob.getDirectURL()}
            className="w-full h-full object-cover"
            preload="metadata"
            muted
          />
        )}
        <span className="absolute bottom-1 left-1 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-kids-amber text-white">
          ⚡
        </span>
      </div>
      <div className="px-2 py-1.5">
        <p className="font-black text-[11px] text-foreground leading-snug line-clamp-2">
          {video.title}
        </p>
        {hashtags.length > 0 && (
          <p className="text-[9px] text-kids-blue/70 font-semibold mt-0.5 truncate">
            {hashtags
              .slice(0, 2)
              .map((h) => `#${h}`)
              .join(" ")}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function ProfilePage() {
  const { identity, clear } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useCallerProfile();
  const { data: allVideos, isLoading: videosLoading } = useAllVideos();
  const { data: subscriptions, isLoading: subsLoading } = useMySubscriptions();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const principal = identity?.getPrincipal().toString() ?? "";
  const shortPrincipal = principal ? `${principal.slice(0, 16)}...` : "";

  const { pic: profilePic, setPic: setProfilePic } =
    useProfilePicture(principal);

  const myPrincipalObj = identity?.getPrincipal() ?? null;
  const { data: mySubscriberCount } = useSubscriberCount(myPrincipalObj);

  const myVideos = (allVideos ?? []).filter(
    (v) => v.uploader.toString() === principal,
  );

  const shortVideos = myVideos.filter((v) => {
    const ext = getVideoExt(v.id);
    return ext.type === "short";
  });
  const longVideos = myVideos.filter((v) => {
    const ext = getVideoExt(v.id);
    return ext.type !== "short";
  });

  const handleLogout = () => {
    clear();
    queryClient.clear();
  };

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") setProfilePic(result);
    };
    reader.readAsDataURL(file);
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
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/50 flex items-center justify-center text-4xl font-black shadow-lg overflow-hidden">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    avatarLetter
                  )}
                </div>
                <button
                  type="button"
                  data-ocid="profile.upload_button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
                  title="Change profile picture"
                >
                  <Camera className="w-4 h-4 text-kids-blue" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePicChange}
                />
              </div>
              {/* Info */}
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-black leading-tight truncate">
                  {username}
                </h1>
                <p className="text-white/70 text-xs font-semibold mt-0.5 break-all">
                  ID: {shortPrincipal}
                </p>
                {/* Stats row */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-xs font-black backdrop-blur-sm">
                    <Video className="w-3 h-3" />
                    {myVideos.length}{" "}
                    {myVideos.length === 1 ? "Video" : "Videos"}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-xs font-black backdrop-blur-sm">
                    <Users className="w-3 h-3" />
                    {mySubscriberCount !== undefined
                      ? `${mySubscriberCount.toString()} Sub${
                          mySubscriberCount === 1n ? "" : "s"
                        }`
                      : "0 Subs"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <Separator className="mt-6 mx-4" style={{ width: "calc(100% - 2rem)" }} />

      {/* My Videos */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black">
            <span className="text-kids-blue">🎬 My </span>
            <span className="text-kids-purple">Videos</span>
          </h2>
          {myVideos.length > 0 && (
            <span className="text-xs font-black text-muted-foreground bg-muted rounded-full px-3 py-1">
              {myVideos.length} total ·{" "}
              <span className="text-kids-amber">
                {shortVideos.length} short
              </span>{" "}
              · <span className="text-kids-blue">{longVideos.length} long</span>
            </span>
          )}
        </div>

        {videosLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
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
          <>
            {/* Long Videos - bigger cards */}
            {longVideos.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-black text-kids-blue mb-3 flex items-center gap-1.5">
                  🎬 Long Videos
                  <span className="bg-kids-blue/10 text-kids-blue rounded-full px-2 py-0.5 text-[10px]">
                    {longVideos.length}
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {longVideos.map((video, i) => (
                    <LongVideoCard key={video.id} video={video} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Short Videos - compact grid */}
            {shortVideos.length > 0 && (
              <div>
                <h3 className="text-sm font-black text-kids-amber mb-3 flex items-center gap-1.5">
                  ⚡ Short Videos
                  <span className="bg-kids-amber/10 text-kids-amber rounded-full px-2 py-0.5 text-[10px]">
                    {shortVideos.length}
                  </span>
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
                  {shortVideos.map((video, i) => (
                    <ShortVideoCard key={video.id} video={video} index={i} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Subscribed Channels */}
      <section className="px-4 mt-8">
        <h2 className="text-xl font-black mb-4">
          <span className="text-kids-amber">🔔 Subscribed </span>
          <span className="text-kids-blue">Channels</span>
          {subscriptions && subscriptions.length > 0 && (
            <span className="ml-2 text-sm font-black text-muted-foreground">
              ({subscriptions.length})
            </span>
          )}
        </h2>

        {subsLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 rounded-2xl" />
            ))}
          </div>
        ) : !subscriptions || subscriptions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            data-ocid="subscriptions.empty_state"
            className="rounded-3xl border-4 border-dashed border-kids-amber/30 bg-kids-amber/5 flex flex-col items-center justify-center py-12 gap-3"
          >
            <div className="text-5xl">🔕</div>
            <p className="font-black text-base text-kids-amber">
              No subscriptions yet!
            </p>
            <p className="text-sm text-muted-foreground font-semibold text-center px-6">
              Hit 🔔 Subscribe on a video to follow creators.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((creator, i) => {
              const videoCount = (allVideos ?? []).filter(
                (v) => v.uploader.toString() === creator.toString(),
              ).length;
              return (
                <SubscribedChannelCard
                  key={creator.toString()}
                  creator={creator}
                  videoCount={videoCount}
                  index={i}
                />
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
