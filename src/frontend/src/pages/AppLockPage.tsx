import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { AppLocks, UserProfile } from "../backend";
import { useSaveAppLock } from "../hooks/useQueries";

const APP_LIST = [
  {
    key: "youtube" as const,
    name: "YouTube",
    emoji: "▶️",
    gradient: "from-red-400 to-red-600",
  },
  {
    key: "instagram" as const,
    name: "Instagram",
    emoji: "📸",
    gradient: "from-purple-400 to-pink-500",
  },
  {
    key: "tiktok" as const,
    name: "TikTok",
    emoji: "🎵",
    gradient: "from-gray-700 to-gray-900",
  },
  {
    key: "facebook" as const,
    name: "Facebook",
    emoji: "👥",
    gradient: "from-blue-500 to-blue-700",
  },
];

const DEMO_APPS = [
  {
    key: "snapchat",
    name: "Snapchat",
    emoji: "👻",
    gradient: "from-yellow-300 to-yellow-500",
  },
  {
    key: "whatsapp",
    name: "WhatsApp",
    emoji: "💬",
    gradient: "from-green-400 to-green-600",
  },
];

interface Props {
  profile: UserProfile | null;
}

export default function AppLockPage({ profile }: Props) {
  const [locks, setLocks] = useState<AppLocks>({
    youtube: { isLocked: false },
    instagram: { isLocked: false },
    tiktok: { isLocked: false },
    facebook: { isLocked: false },
  });
  const [demoLocks, setDemoLocks] = useState<Record<string, boolean>>({
    snapchat: false,
    whatsapp: false,
  });
  const saveAppLock = useSaveAppLock();

  useEffect(() => {
    if (profile?.settings?.appLocks) setLocks(profile.settings.appLocks);
  }, [profile]);

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
      toast.error(e.message || "Failed to update");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 md:px-8 pt-6 pb-3 border-b border-border">
        <h1 className="text-2xl font-black">
          <span className="text-kids-red">App</span>{" "}
          <span className="text-kids-blue">Lock</span> 🔒
        </h1>
        <p className="text-xs text-muted-foreground font-semibold">
          Control which apps kids can use
        </p>
      </header>

      <div className="px-4 md:px-8 py-4 space-y-3">
        <div className="bg-card rounded-2xl px-4 py-2 border-2 border-kids-amber">
          <p className="text-xs font-bold text-muted-foreground">
            🔒 Toggle to lock/unlock apps for kids
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {APP_LIST.map((app, i) => {
            const isLocked = locks[app.key]?.isLocked ?? false;
            return (
              <motion.div
                key={app.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                data-ocid={`applock.item.${i + 1}`}
                className="bg-card rounded-2xl shadow-card p-4 flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-2xl flex-shrink-0`}
                >
                  {app.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-black text-foreground">{app.name}</p>
                  <p
                    className={`text-xs font-semibold ${isLocked ? "text-kids-red" : "text-secondary"}`}
                  >
                    {isLocked ? "🔒 Locked" : "🔓 Unlocked"}
                  </p>
                </div>
                {saveAppLock.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : (
                  <Switch
                    data-ocid={`applock.toggle.${i + 1}`}
                    checked={isLocked}
                    onCheckedChange={() => toggleLock(app.key)}
                    className="data-[state=checked]:bg-kids-red"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="text-xs font-black text-muted-foreground px-1 pt-2">
          Demo Only (not saved to backend)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DEMO_APPS.map((app, i) => (
            <motion.div
              key={app.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (APP_LIST.length + i) * 0.06 }}
              data-ocid={`applock.demo.item.${i + 1}`}
              className="bg-card rounded-2xl shadow-card p-4 flex items-center gap-4 opacity-80"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-2xl flex-shrink-0`}
              >
                {app.emoji}
              </div>
              <div className="flex-1">
                <p className="font-black text-foreground">{app.name}</p>
                <p
                  className={`text-xs font-semibold ${demoLocks[app.key] ? "text-kids-red" : "text-secondary"}`}
                >
                  {demoLocks[app.key] ? "🔒 Locked" : "🔓 Unlocked"}
                </p>
              </div>
              <Switch
                checked={demoLocks[app.key] ?? false}
                onCheckedChange={(v) =>
                  setDemoLocks((prev) => ({ ...prev, [app.key]: v }))
                }
                className="data-[state=checked]:bg-kids-red"
              />
            </motion.div>
          ))}
        </div>

        {Object.entries(locks).some(([, v]) => v.isLocked) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-kids-red/10 border-2 border-kids-red rounded-2xl p-4 text-center"
          >
            <div className="text-4xl mb-2">🔒</div>
            <p className="font-black text-kids-red">App Locked!</p>
            <p className="text-xs text-muted-foreground font-semibold mt-1">
              When a locked app is opened, Kids House will open instead
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
