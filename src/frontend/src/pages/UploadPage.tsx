import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Film, Loader2, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useCreateVideoMeta } from "../hooks/useQueries";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const createVideoMeta = useCreateVideoMeta();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setUploaded(false);
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      toast.error("Please add a title 📝");
      return;
    }
    if (!file) {
      toast.error("Please select a video 🎬");
      return;
    }
    setIsUploading(true);
    setProgress(0);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
        setProgress(pct),
      );
      await createVideoMeta.mutateAsync({ title, blob });
      setUploaded(true);
      setTitle("");
      setFile(null);
      setProgress(100);
      toast.success("Video uploaded! 🎉");
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 pt-6 pb-3 border-b border-border">
        <h1 className="text-2xl font-black">
          <span className="text-kids-green">Upload</span>{" "}
          <span className="text-kids-blue">Video</span> 📤
        </h1>
        <p className="text-xs text-muted-foreground font-semibold">
          Share your videos with kids!
        </p>
      </header>

      <div className="px-4 py-6 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl shadow-card p-6 space-y-4"
        >
          <div>
            <Label className="font-black text-foreground text-base">
              Video Title 📝
            </Label>
            <Input
              data-ocid="upload.title.input"
              placeholder="e.g. ABC Song for Kids"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 rounded-2xl border-2 border-border focus:border-kids-green h-12 font-semibold text-base"
            />
          </div>

          <div>
            <Label className="font-black text-foreground text-base">
              Select Video 🎬
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
              className="mt-2 w-full h-32 rounded-2xl border-4 border-dashed border-kids-green/60 bg-kids-green/5 flex flex-col items-center justify-center gap-2 hover:bg-kids-green/10 transition-colors"
            >
              {file ? (
                <>
                  <Film className="w-10 h-10 text-kids-green" />
                  <span className="font-bold text-kids-green text-sm text-center px-2 truncate w-full">
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
                <span className="text-kids-blue">{Math.round(progress)}%</span>
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
            style={{ background: "oklch(var(--secondary))", color: "white" }}
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Upload className="mr-2 h-5 w-5" />
            )}
            {isUploading ? "Uploading..." : "Upload Video 📤"}
          </Button>
        </motion.div>

        <div className="bg-card rounded-2xl p-4 border-2 border-kids-amber">
          <p className="font-black text-sm text-foreground">📌 Upload Tips:</p>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground font-semibold">
            <li>🎬 Use fun, educational video titles</li>
            <li>📏 Max recommended size: 100MB</li>
            <li>✅ Supported: MP4, MOV, WebM</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
