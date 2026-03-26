import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useQueryClient } from "@tanstack/react-query";
import { Film, Loader2, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { AppLocks, UserProfile } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllVideos,
  useCreateVideoMeta,
  useSaveAppLock,
} from "../hooks/useQueries";

const APP_LIST = [
  { key: "youtube" as keyof AppLocks, name: "YouTube", emoji: "▶️" },
  { key: "instagram" as keyof AppLocks, name: "Instagram", emoji: "📸" },
  { key: "tiktok" as keyof AppLocks, name: "TikTok", emoji: "🎵" },
  { key: "facebook" as keyof AppLocks, name: "Facebook", emoji: "👥" },
];

const CATEGORIES = ["Education", "Fun", "Coding", "Career", "Games"];

interface Props {
  profile: UserProfile | null;
  onClose: () => void;
}

export default function ProfileModal({ profile, onClose }: Props) {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: allVideos } = useAllVideos();
  const createVideoMeta = useCreateVideoMeta();
  const saveAppLock = useSaveAppLock();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Education");
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [locks, setLocks] = useState<AppLocks>(
    profile?.settings?.appLocks ?? {
      youtube: { isLocked: false },
      instagram: { isLocked: false },
      tiktok: { isLocked: false },
      facebook: { isLocked: false },
    },
  );

  const myVideos = (allVideos ?? []).filter(
    (v) =>
      identity && v.uploader.toString() === identity.getPrincipal().toString(),
  );

  const handleUpload = async () => {
    if (!title.trim() || !file) {
      toast.error("Please fill title and select video");
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
        setUploadProgress(pct),
      );
      await createVideoMeta.mutateAsync({ title, blob });
      setTitle("");
      setDescription("");
      setFile(null);
      toast.success("Video uploaded! 🎉");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleLock = async (key: keyof AppLocks) => {
    const updated = { ...locks, [key]: { isLocked: !locks[key].isLocked } };
    setLocks(updated);
    try {
      await saveAppLock.mutateAsync(updated);
      toast.success(
        `${key} ${updated[key].isLocked ? "locked 🔒" : "unlocked 🔓"}`,
      );
    } catch (e: any) {
      setLocks(locks);
      toast.error(e.message ?? "Failed to update");
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    onClose();
  };

  const initial = profile?.username?.[0]?.toUpperCase() ?? "?";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-ocid="profile.modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-[420px] bg-background rounded-t-3xl overflow-y-auto"
        style={{ maxHeight: "92vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
          <h2 className="text-xl font-black">
            <span className="text-kids-blue">प्रोफाइल </span>Profile
          </h2>
          <button
            type="button"
            data-ocid="profile.close_button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Avatar + info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-kids-blue to-kids-purple flex items-center justify-center text-3xl font-black text-white shadow-btn">
              {initial}
            </div>
            <div>
              <p className="font-black text-xl text-foreground">
                {profile?.username ?? "Guest"}
              </p>
              <p className="text-sm text-muted-foreground">
                {profile?.email ?? ""}
              </p>
              <div className="flex gap-2 mt-1">
                <span className="text-xs bg-kids-blue/10 text-kids-blue font-bold px-2 py-0.5 rounded-full">
                  {myVideos.length} Videos
                </span>
                {profile?.settings?.userRole && (
                  <span className="text-xs bg-kids-amber/10 text-kids-amber font-bold px-2 py-0.5 rounded-full">
                    {profile.settings.userRole}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Upload Video */}
          <div className="bg-card rounded-3xl border-4 border-kids-green p-4 space-y-3">
            <h3 className="font-black text-foreground">
              📤 Upload Video / वीडियो अपलोड
            </h3>
            <Input
              data-ocid="profile.upload.title.input"
              placeholder="Video Title / शीर्षक"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-2xl border-2 h-11 font-semibold"
            />
            <Input
              data-ocid="profile.upload.description.input"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-2xl border-2 h-11 font-semibold"
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                data-ocid="profile.upload.category.select"
                className="rounded-2xl border-2 h-11"
              >
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              ref={fileRef}
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
            <button
              type="button"
              data-ocid="profile.upload.dropzone"
              onClick={() => fileRef.current?.click()}
              className="w-full h-20 rounded-2xl border-4 border-dashed border-kids-green/60 bg-kids-green/5 flex items-center justify-center gap-2 font-bold text-sm text-kids-green"
            >
              {file ? (
                <>
                  <Film className="w-5 h-5" />
                  {file.name}
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Select Video 🎬
                </>
              )}
            </button>
            {isUploading && (
              <div data-ocid="profile.upload.loading_state">
                <Progress value={uploadProgress} className="h-2 rounded-full" />
                <p className="text-xs text-kids-green font-bold text-center mt-1">
                  {Math.round(uploadProgress)}%
                </p>
              </div>
            )}
            <Button
              data-ocid="profile.upload.submit_button"
              onClick={handleUpload}
              disabled={isUploading || !title || !file}
              className="w-full rounded-full h-11 font-black"
              style={{ background: "oklch(var(--secondary))", color: "white" }}
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "📤"
              )}
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>

          {/* My Videos */}
          {myVideos.length > 0 && (
            <div className="bg-card rounded-3xl border-4 border-kids-blue p-4">
              <h3 className="font-black text-foreground mb-3">
                🎬 My Videos / मेरे वीडियो ({myVideos.length})
              </h3>
              <div className="space-y-2">
                {myVideos.map((v, i) => (
                  <div
                    key={v.id}
                    data-ocid={`profile.video.item.${i + 1}`}
                    className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-border"
                  >
                    <div className="w-12 h-12 rounded-xl bg-kids-blue/10 flex items-center justify-center text-2xl flex-shrink-0">
                      🎬
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{v.title}</p>
                      <p className="text-xs text-muted-foreground">Uploaded</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* App Lock */}
          <div className="bg-card rounded-3xl border-4 border-kids-red p-4 space-y-3">
            <h3 className="font-black text-foreground">🔒 App Lock / ऐप लॉक</h3>
            {APP_LIST.map((app, i) => (
              <div
                key={app.key}
                data-ocid={`profile.applock.item.${i + 1}`}
                className="flex items-center gap-3"
              >
                <span className="text-2xl">{app.emoji}</span>
                <span className="flex-1 font-bold text-sm">{app.name}</span>
                <Switch
                  data-ocid={`profile.applock.toggle.${i + 1}`}
                  checked={locks[app.key]?.isLocked ?? false}
                  onCheckedChange={() => toggleLock(app.key)}
                  className="data-[state=checked]:bg-kids-red"
                />
              </div>
            ))}
          </div>

          {/* Logout */}
          <Button
            data-ocid="profile.logout_button"
            onClick={handleLogout}
            variant="outline"
            className="w-full h-12 rounded-full font-bold border-2 border-destructive text-destructive hover:bg-destructive/10"
          >
            🚪 Logout
          </Button>

          {identity && (
            <div className="bg-muted/50 rounded-2xl p-3">
              <p className="text-xs font-bold text-muted-foreground">ID:</p>
              <p className="text-xs font-mono truncate mt-0.5 text-muted-foreground">
                {identity.getPrincipal().toString()}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
