import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const INITIAL_NOTIFS = [
  {
    id: 1,
    emoji: "🎬",
    title: "New video uploaded!",
    body: "Fun Math Tricks is now live 🔢",
    time: "2m ago",
    read: false,
  },
  {
    id: 2,
    emoji: "🔴",
    title: "Live session starting!",
    body: "ABC Song Live — join now! 🎵",
    time: "15m ago",
    read: false,
  },
  {
    id: 3,
    emoji: "❤️",
    title: "Someone liked your video",
    body: "Your video got 10 new likes! 🎉",
    time: "1h ago",
    read: false,
  },
  {
    id: 4,
    emoji: "📚",
    title: "New course available",
    body: "Business for Kids course added! 💼",
    time: "3h ago",
    read: true,
  },
  {
    id: 5,
    emoji: "🎮",
    title: "New game unlocked!",
    body: "Color Match game is ready to play 🎨",
    time: "1d ago",
    read: true,
  },
];

type Notif = (typeof INITIAL_NOTIFS)[0];

interface Props {
  onClose: () => void;
}

export default function NotificationsPanel({ onClose }: Props) {
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS);

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const clear = () => setNotifs([]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-ocid="notifications.panel"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="w-full max-w-[420px] bg-background rounded-3xl overflow-hidden shadow-card mx-4"
        style={{ maxHeight: "75vh" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-black text-lg">
            🔔 <span className="text-kids-blue">सूचनाएं</span> Notifications
          </h2>
          <button
            type="button"
            data-ocid="notifications.close_button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 px-5 py-3 border-b border-border">
          <button
            type="button"
            data-ocid="notifications.mark_read_button"
            onClick={markAllRead}
            className="text-xs font-black text-kids-blue hover:underline"
          >
            ✓ Mark all read
          </button>
          <span className="text-muted-foreground">·</span>
          <button
            type="button"
            data-ocid="notifications.clear_button"
            onClick={clear}
            className="text-xs font-black text-kids-red hover:underline"
          >
            🗑 Clear all
          </button>
        </div>

        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(75vh - 110px)" }}
        >
          {notifs.length === 0 ? (
            <div
              data-ocid="notifications.empty_state"
              className="text-center py-12"
            >
              <div className="text-5xl mb-2">🔕</div>
              <p className="font-black text-muted-foreground">कोई सूचना नहीं</p>
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <AnimatePresence>
              {notifs.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.04 }}
                  data-ocid={`notifications.item.${i + 1}`}
                  className={`flex gap-3 px-5 py-4 border-b border-border last:border-0 ${
                    n.read ? "opacity-60" : "bg-kids-blue/3"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-kids-blue/10 flex items-center justify-center text-xl flex-shrink-0">
                    {n.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-foreground">
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold truncate">
                      {n.body}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {n.time}
                    </p>
                  </div>
                  {!n.read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-kids-red mt-1 flex-shrink-0" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
