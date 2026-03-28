import { Switch } from "@/components/ui/switch";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { AppLocks, UserProfile } from "../backend";
import { useSaveAppLock } from "../hooks/useQueries";

const STORAGE_PIN_KEY = "kidshouse_pin";
const STORAGE_LOCKS_KEY = "kidshouse_locks";
const DEFAULT_PIN = "1234";

const ALL_APPS = [
  {
    key: "youtube",
    name: "YouTube",
    emoji: "▶️",
    gradient: "from-red-400 to-red-600",
    backend: true,
  },
  {
    key: "instagram",
    name: "Instagram",
    emoji: "📸",
    gradient: "from-purple-400 to-pink-500",
    backend: true,
  },
  {
    key: "whatsapp",
    name: "WhatsApp",
    emoji: "💬",
    gradient: "from-green-400 to-green-600",
    backend: false,
  },
  {
    key: "games",
    name: "Games",
    emoji: "🎮",
    gradient: "from-blue-500 to-purple-600",
    backend: false,
  },
  {
    key: "tiktok",
    name: "TikTok",
    emoji: "🎵",
    gradient: "from-gray-700 to-gray-900",
    backend: true,
  },
  {
    key: "facebook",
    name: "Facebook",
    emoji: "👥",
    gradient: "from-blue-500 to-blue-700",
    backend: true,
  },
];

function loadLocks(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_LOCKS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveLocks(locks: Record<string, boolean>) {
  localStorage.setItem(STORAGE_LOCKS_KEY, JSON.stringify(locks));
}

function loadPin(): string {
  return localStorage.getItem(STORAGE_PIN_KEY) ?? DEFAULT_PIN;
}

interface Props {
  profile: UserProfile | null;
}

// ── Lock Screen Overlay ────────────────────────────────────────────────────

interface LockScreenProps {
  appName: string;
  appEmoji: string;
  onClose: () => void;
}

function LockScreen({ appName, appEmoji, onClose }: LockScreenProps) {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<
    "idle" | "granted" | "denied" | "timeout"
  >("idle");
  const [timeLeft, setTimeLeft] = useState(5);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const correctPin = loadPin();

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    setTimeLeft(5);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setStatus("timeout");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  // Close after timeout message
  useEffect(() => {
    if (status === "timeout") {
      const t = setTimeout(onClose, 1500);
      return () => clearTimeout(t);
    }
  }, [status, onClose]);

  // Close after granted message
  useEffect(() => {
    if (status === "granted") {
      const t = setTimeout(onClose, 2000);
      return () => clearTimeout(t);
    }
  }, [status, onClose]);

  // Close after denied message (Kids House Opening)
  useEffect(() => {
    if (status === "denied") {
      const t = setTimeout(onClose, 1500);
      return () => clearTimeout(t);
    }
  }, [status, onClose]);

  const handleKey = (key: string) => {
    if (status !== "idle") return;
    if (key === "⌫") {
      setPin((p) => p.slice(0, -1));
      startTimer();
      return;
    }
    if (key === "✓") {
      checkPin(pin);
      return;
    }
    if (pin.length >= 4) return;
    const next = pin + key;
    setPin(next);
    startTimer();
    if (next.length === 4) {
      setTimeout(() => checkPin(next), 100);
    }
  };

  const checkPin = (p: string) => {
    clearTimer();
    if (p === correctPin) {
      setStatus("granted");
    } else {
      setStatus("denied");
    }
  };

  const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-ocid="applock.modal"
      className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm"
      >
        {/* Branding */}
        <div className="text-center mb-4">
          <div className="text-4xl mb-1">🏠</div>
          <div className="text-xl font-black">
            <span className="text-kids-blue">Kids </span>
            <span className="text-kids-red">House</span>
          </div>
        </div>

        {/* App name */}
        <div className="text-center mb-5">
          <div className="text-3xl mb-1">{appEmoji}</div>
          <p className="font-black text-gray-800 text-lg">
            {appName} is locked 🔒
          </p>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Enter parent PIN to unlock
          </p>
        </div>

        {/* Status messages */}
        <AnimatePresence mode="wait">
          {status === "granted" && (
            <motion.div
              key="granted"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6"
            >
              <div className="text-5xl mb-2">✅</div>
              <p className="text-green-600 font-black text-lg">
                Access Granted!
              </p>
              <p className="text-gray-500 text-sm mt-1">Opening {appName}...</p>
            </motion.div>
          )}
          {status === "denied" && (
            <motion.div
              key="denied"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6"
            >
              <div className="text-5xl mb-2">🏠</div>
              <p className="text-kids-blue font-black text-lg">
                Kids House Opening...
              </p>
              <p className="text-gray-500 text-sm mt-1">Wrong PIN entered</p>
            </motion.div>
          )}
          {status === "timeout" && (
            <motion.div
              key="timeout"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6"
            >
              <div className="text-5xl mb-2">⏳</div>
              <p className="text-kids-red font-black text-lg">
                Time's Up! Screen locked.
              </p>
            </motion.div>
          )}
          {status === "idle" && (
            <motion.div key="input" exit={{ opacity: 0 }}>
              {/* PIN dots */}
              <div className="flex justify-center gap-4 mb-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed 4 dots
                    key={i}
                    className={`w-5 h-5 rounded-full border-2 transition-all duration-150 ${
                      i < pin.length
                        ? "bg-kids-blue border-kids-blue"
                        : "bg-gray-100 border-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="text-center mb-4">
                <span
                  className={`text-sm font-black px-3 py-1 rounded-full ${
                    timeLeft <= 2
                      ? "bg-kids-red/10 text-kids-red"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  ⏰ {timeLeft}s
                </span>
              </div>

              {/* Numpad */}
              <div className="grid grid-cols-3 gap-2">
                {KEYS.map((key) => (
                  <motion.button
                    type="button"
                    key={key}
                    data-ocid={`applock.${key === "⌫" ? "delete_button" : key === "✓" ? "confirm_button" : `${key}.button`}`}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => handleKey(key)}
                    className={`min-h-[72px] rounded-2xl text-xl font-black transition-colors select-none ${
                      key === "✓"
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : key === "⌫"
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-kids-blue/10 text-kids-blue hover:bg-kids-blue/20"
                    }`}
                  >
                    {key}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cancel */}
        {status === "idle" && (
          <button
            type="button"
            data-ocid="applock.close_button"
            onClick={onClose}
            className="w-full mt-4 text-xs text-gray-400 font-semibold hover:text-gray-600 transition-colors"
          >
            Cancel
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── PIN Change Panel ────────────────────────────────────────────────────────

function PinSettingsCard() {
  const [expanded, setExpanded] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [currentPin] = useState(loadPin);
  const [saved, setSaved] = useState(false);

  const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"];

  const handleKey = (key: string) => {
    if (key === "⌫") {
      setNewPin((p) => p.slice(0, -1));
      return;
    }
    if (key === "✓") {
      if (newPin.length === 4) {
        localStorage.setItem(STORAGE_PIN_KEY, newPin);
        setSaved(true);
        toast.success("PIN updated! 🔐");
        setTimeout(() => {
          setExpanded(false);
          setNewPin("");
          setSaved(false);
        }, 1200);
      }
      return;
    }
    if (newPin.length < 4) setNewPin((p) => p + key);
  };

  return (
    <div className="bg-white rounded-3xl shadow-card border-2 border-kids-amber/40 p-5 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-black text-gray-800 text-sm">🔐 Parent PIN</p>
          <div className="flex gap-2 mt-1">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed 4 dots
              <span key={i} className="text-xl text-kids-blue">
                ●
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">
            Current PIN: {currentPin}
          </p>
        </div>
        <button
          type="button"
          data-ocid="applock.open_modal_button"
          onClick={() => setExpanded((v) => !v)}
          className="bg-kids-amber/20 hover:bg-kids-amber/30 text-kids-amber font-black text-xs px-4 py-2 rounded-xl transition-colors"
        >
          {expanded ? "Cancel" : "Change PIN"}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              <p className="text-xs text-gray-500 font-semibold text-center mb-2">
                Enter new 4-digit PIN
              </p>
              {/* New PIN dots */}
              <div className="flex justify-center gap-4 mb-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      i < newPin.length
                        ? "bg-kids-amber border-kids-amber"
                        : "bg-gray-100 border-gray-300"
                    }`}
                  />
                ))}
              </div>
              {saved && (
                <p className="text-center text-green-600 font-black text-sm mb-2">
                  ✅ Saved!
                </p>
              )}
              <div className="grid grid-cols-3 gap-2">
                {KEYS.map((key) => (
                  <motion.button
                    type="button"
                    key={key}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => handleKey(key)}
                    className={`min-h-[60px] rounded-xl text-lg font-black transition-colors ${
                      key === "✓"
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : key === "⌫"
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-kids-amber/10 text-kids-amber hover:bg-kids-amber/20"
                    }`}
                  >
                    {key}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function AppLockPage({ profile }: Props) {
  const [locks, setLocks] = useState<Record<string, boolean>>(loadLocks);
  const [lockScreen, setLockScreen] = useState<{
    key: string;
    name: string;
    emoji: string;
  } | null>(null);
  const saveAppLock = useSaveAppLock();

  // Sync from profile on mount
  useEffect(() => {
    if (profile?.settings?.appLocks) {
      const al = profile.settings.appLocks;
      setLocks((prev) => ({
        ...prev,
        youtube: al.youtube.isLocked,
        instagram: al.instagram.isLocked,
        tiktok: al.tiktok.isLocked,
        facebook: al.facebook.isLocked,
      }));
    }
  }, [profile]);

  const toggleLock = async (key: string, isBackend: boolean) => {
    const updated = { ...locks, [key]: !locks[key] };
    setLocks(updated);
    saveLocks(updated);

    if (isBackend) {
      const backendLocks: AppLocks = {
        youtube: { isLocked: updated.youtube ?? false },
        instagram: { isLocked: updated.instagram ?? false },
        tiktok: { isLocked: updated.tiktok ?? false },
        facebook: { isLocked: updated.facebook ?? false },
      };
      try {
        await saveAppLock.mutateAsync(backendLocks);
      } catch {
        // silently ignore backend errors — localStorage is source of truth for demo
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 md:px-8 pt-6 pb-4 border-b border-border">
        <h1 className="text-2xl font-black">
          <span className="text-kids-red">App</span>{" "}
          <span className="text-kids-blue">Lock</span> 🔒
        </h1>
        <p className="text-xs text-muted-foreground font-semibold mt-0.5">
          Control which apps kids can access
        </p>
      </header>

      <div className="px-4 md:px-8 py-5 space-y-4 max-w-2xl">
        {/* PIN Settings */}
        <PinSettingsCard />

        {/* Info banner */}
        <div className="bg-kids-blue/5 border-2 border-kids-blue/20 rounded-2xl px-4 py-3">
          <p className="text-xs font-bold text-kids-blue">
            💡 Toggle to lock apps. Tap <strong>▶ Try Demo</strong> on a locked
            app to test the lock screen.
          </p>
        </div>

        {/* App grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ALL_APPS.map((app, i) => {
            const isLocked = locks[app.key] ?? false;
            return (
              <motion.div
                key={app.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                data-ocid={`applock.item.${i + 1}`}
                className="bg-white rounded-2xl shadow-card border border-border p-4 flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-2xl flex-shrink-0 shadow-md`}
                >
                  {app.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-800">{app.name}</p>
                  <p
                    className={`text-xs font-semibold ${
                      isLocked ? "text-kids-red" : "text-secondary"
                    }`}
                  >
                    {isLocked ? "🔒 Locked" : "🔓 Unlocked"}
                  </p>
                  {isLocked && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      data-ocid={`applock.secondary_button.${i + 1}`}
                      onClick={() =>
                        setLockScreen({
                          key: app.key,
                          name: app.name,
                          emoji: app.emoji,
                        })
                      }
                      className="mt-1.5 bg-kids-red/10 hover:bg-kids-red/20 text-kids-red text-xs font-black px-3 py-1 rounded-xl transition-colors"
                    >
                      ▶ Try Demo
                    </motion.button>
                  )}
                </div>
                <Switch
                  data-ocid={`applock.toggle.${i + 1}`}
                  checked={isLocked}
                  onCheckedChange={() => toggleLock(app.key, app.backend)}
                  className="data-[state=checked]:bg-kids-red flex-shrink-0"
                />
              </motion.div>
            );
          })}
        </div>

        {/* Locked count badge */}
        {Object.values(locks).some(Boolean) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-kids-red/10 border-2 border-kids-red/30 rounded-2xl p-4 text-center"
          >
            <div className="text-3xl mb-1">🛡️</div>
            <p className="font-black text-kids-red text-sm">
              {Object.values(locks).filter(Boolean).length} app(s) locked
            </p>
            <p className="text-xs text-muted-foreground font-semibold mt-1">
              Kids will see the PIN screen when trying to open locked apps
            </p>
          </motion.div>
        )}
      </div>

      {/* Lock screen overlay */}
      <AnimatePresence>
        {lockScreen && (
          <LockScreen
            appName={lockScreen.name}
            appEmoji={lockScreen.emoji}
            onClose={() => setLockScreen(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
