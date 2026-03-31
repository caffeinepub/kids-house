import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Camera, Film, Hash, Loader2, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useCreateVideoMeta } from "../hooks/useQueries";

type VideoType = "short" | "long";

export default function UploadPage() {
  const [videoType, setVideoType] = useState<VideoType>("short");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [hashtagInput, setHashtagInput] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  const createVideoMeta = useCreateVideoMeta();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setUploaded(false);
  };

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setThumbnail(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addHashtags(hashtagInput);
    }
  };

  const addHashtags = (raw: string) => {
    const words = raw
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean)
      .map((w) => (w.startsWith("#") ? w : `#${w}`));
    const newTags = words.filter((w) => w.length > 1 && !hashtags.includes(w));
    if (newTags.length) setHashtags((prev) => [...prev, ...newTags]);
    setHashtagInput("");
  };

  const removeHashtag = (tag: string) =>
    setHashtags((prev) => prev.filter((t) => t !== tag));

  const handleUpload = async () => {
    if (!title.trim()) {
      toast.error("Please add a title 📝");
      return;
    }
    if (!file) {
      toast.error("Please select a video 🎦");
      return;
    }
    setIsUploading(true);
    setProgress(0);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
        setProgress(pct),
      );
      const videoId = await createVideoMeta.mutateAsync({ title, blob });
      // Save extra metadata to localStorage
      if (videoId) {
        const key = `kh_video_ext_${videoId}`;
        localStorage.setItem(
          key,
          JSON.stringify({
            type: videoType,
            thumbnailDataUrl: thumbnail,
            hashtags,
          }),
        );
      }
      setUploaded(true);
      setTitle("");
      setFile(null);
      setThumbnail(null);
      setHashtags([]);
      setHashtagInput("");
      setProgress(100);
      toast.success("Video uploaded! 🎉");
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const isShort = videoType === "short";
  const accentColor = isShort ? "kids-green" : "kids-blue";

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 md:px-8 pt-6 pb-3 border-b border-border">
        <h1 className="text-2xl font-black">
          <span className="text-kids-green">Upload</span>{" "}
          <span className="text-kids-blue">Video</span> 📤
        </h1>
        <p className="text-xs text-muted-foreground font-semibold">
          Share your videos with kids!
        </p>
      </header>

      <div className="px-4 md:px-8 py-6">
        <div className="max-w-lg mx-auto space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl shadow-card p-6 space-y-5"
          >
            {/* Video Type Toggle */}
            <div>
              <Label className="font-black text-foreground text-base">
                Video Type 🎬
              </Label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  data-ocid="upload.short_video.toggle"
                  onClick={() => setVideoType("short")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-3 font-black transition-all ${
                    isShort
                      ? "border-kids-green bg-kids-green/15 text-kids-green scale-[1.02]"
                      : "border-border bg-card text-muted-foreground hover:border-kids-green/40"
                  }`}
                  style={{ borderWidth: isShort ? 3 : 2 }}
                >
                  <span className="text-3xl">📱</span>
                  <span className="text-sm">Short Video</span>
                  <span className="text-xs font-semibold opacity-70">
                    Reels style
                  </span>
                </button>
                <button
                  type="button"
                  data-ocid="upload.long_video.toggle"
                  onClick={() => setVideoType("long")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl font-black transition-all ${
                    !isShort
                      ? "border-kids-blue bg-kids-blue/15 text-kids-blue scale-[1.02]"
                      : "border-border bg-card text-muted-foreground hover:border-kids-blue/40"
                  }`}
                  style={{ borderWidth: !isShort ? 3 : 2 }}
                >
                  <span className="text-3xl">🎬</span>
                  <span className="text-sm">Long Video</span>
                  <span className="text-xs font-semibold opacity-70">
                    Full length
                  </span>
                </button>
              </div>
            </div>

            {/* Thumbnail Picker */}
            <div>
              <Label className="font-black text-foreground text-base">
                Thumbnail 🖼️
              </Label>
              <input
                ref={thumbRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnail}
                className="hidden"
                id="thumb-file-input"
              />
              <button
                type="button"
                data-ocid="upload.thumbnail.upload_button"
                onClick={() => thumbRef.current?.click()}
                className="mt-2 w-full h-40 rounded-2xl border-4 border-dashed border-kids-amber/60 bg-kids-amber/5 flex items-center justify-center overflow-hidden hover:bg-kids-amber/10 transition-colors relative"
              >
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="w-10 h-10 text-kids-amber" />
                    <span className="font-bold text-kids-amber">
                      Add Thumbnail
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">
                      JPG, PNG, WebP
                    </span>
                  </div>
                )}
                {thumbnail && (
                  <button
                    type="button"
                    data-ocid="upload.thumbnail.delete_button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setThumbnail(null);
                    }}
                    className="absolute top-2 right-2 bg-black/60 rounded-full p-1 hover:bg-black/80"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </button>
            </div>

            {/* Title */}
            <div>
              <Label className="font-black text-foreground text-base">
                Video Title 📝
              </Label>
              <Input
                data-ocid="upload.title.input"
                placeholder="e.g. ABC Song for Kids"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`mt-2 rounded-2xl border-2 focus:border-${accentColor} h-12 font-semibold text-base`}
              />
            </div>

            {/* Hashtags */}
            <div>
              <Label className="font-black text-foreground text-base">
                Hashtags #️⃣
              </Label>
              <div className="mt-2 relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-ocid="upload.hashtags.input"
                  placeholder="e.g. #kids #fun #learning"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={handleHashtagKeyDown}
                  onBlur={() =>
                    hashtagInput.trim() && addHashtags(hashtagInput)
                  }
                  className="pl-9 rounded-2xl border-2 border-kids-purple/40 focus:border-kids-purple h-12 font-semibold text-base"
                />
              </div>
              {hashtags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {hashtags.map((tag) => (
                    <Badge
                      key={tag}
                      className="px-3 py-1 rounded-full font-bold text-sm cursor-pointer flex items-center gap-1 bg-kids-purple/15 text-kids-purple hover:bg-kids-purple/25 border-0"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeHashtag(tag)}
                        className="ml-1 rounded-full hover:text-red-500"
                        aria-label={`Remove ${tag}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1 font-semibold">
                Press Space or Enter to add a tag
              </p>
            </div>

            {/* Video File Picker */}
            <div>
              <Label className="font-black text-foreground text-base">
                Select Video 🎦
              </Label>
              <input
                ref={fileRef}
                type="file"
                accept="video/*"
                onChange={handleFile}
                className="hidden"
                id="video-file-input"
              />
              <button
                type="button"
                data-ocid="upload.dropzone"
                onClick={() => fileRef.current?.click()}
                onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
                className={`mt-2 w-full h-32 rounded-2xl border-4 border-dashed border-${accentColor}/60 bg-${accentColor}/5 flex flex-col items-center justify-center gap-2 hover:bg-${accentColor}/10 transition-colors`}
              >
                {file ? (
                  <>
                    <Film className={`w-10 h-10 text-${accentColor}`} />
                    <span
                      className={`font-bold text-${accentColor} text-sm text-center px-2 truncate w-full`}
                    >
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-muted-foreground" />
                    <span className="font-bold text-muted-foreground">
                      Tap to select video
                    </span>
                    <span className="text-xs text-muted-foreground">
                      MP4, MOV, WebM
                    </span>
                  </>
                )}
              </button>
            </div>

            {isUploading && (
              <div data-ocid="upload.loading_state" className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-kids-blue">Uploading...</span>
                  <span className="text-kids-blue">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-3 rounded-full" />
              </div>
            )}

            {uploaded && (
              <motion.div
                data-ocid="upload.success_state"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-4"
              >
                <div className="text-5xl mb-2">🎉</div>
                <p className="font-black text-kids-green text-lg">
                  Video Uploaded!
                </p>
                <p className="text-muted-foreground text-sm font-semibold">
                  It will appear in the Home feed
                </p>
              </motion.div>
            )}

            <Button
              data-ocid="upload.submit_button"
              onClick={handleUpload}
              disabled={isUploading || !title || !file}
              className="w-full h-14 rounded-full text-lg font-black shadow-btn"
              style={{
                background: isShort
                  ? "oklch(var(--kids-green))"
                  : "oklch(var(--kids-blue))",
                color: "white",
              }}
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Upload className="mr-2 h-5 w-5" />
              )}
              {isUploading
                ? "Uploading..."
                : `Upload ${isShort ? "Short" : "Long"} Video 📤`}
            </Button>
          </motion.div>

          <div className="bg-card rounded-2xl p-4 border-2 border-kids-amber">
            <p className="font-black text-sm text-foreground">
              📌 Upload Tips:
            </p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground font-semibold">
              <li>
                📱 Short Videos: vertical format, max 60 seconds recommended
              </li>
              <li>
                🎬 Long Videos: horizontal layout, great for educational content
              </li>
              <li>🖼️ Thumbnail: helps viewers find and click your video</li>
              <li>📏 Max recommended size: 100MB</li>
              <li>✅ Supported: MP4, MOV, WebM</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
