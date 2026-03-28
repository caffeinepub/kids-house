import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const cards = [
  {
    id: "learning",
    emoji: "📚",
    title: "Learning",
    button: "Start",
    btnColor: "bg-emerald-500 hover:bg-emerald-600",
    glow: "from-emerald-300 to-teal-300",
    border: "border-emerald-200",
  },
  {
    id: "games",
    emoji: "🎮",
    title: "Games",
    button: "Play",
    btnColor: "bg-orange-500 hover:bg-orange-600",
    glow: "from-orange-300 to-yellow-300",
    border: "border-orange-200",
  },
  {
    id: "videos",
    emoji: "🎬",
    title: "Videos",
    button: "Watch",
    btnColor: "bg-sky-500 hover:bg-sky-600",
    glow: "from-sky-300 to-blue-300",
    border: "border-sky-200",
  },
  {
    id: "drawing",
    emoji: "🎨",
    title: "Drawing",
    button: "Draw",
    btnColor: "bg-pink-500 hover:bg-pink-600",
    glow: "from-pink-300 to-purple-300",
    border: "border-pink-200",
  },
];

function ComingSoonModal({
  title,
  onClose,
}: { title: string; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-default border-0"
        onClick={onClose}
        aria-label="Close modal"
        data-ocid="modal.close_button"
      />
      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-xs w-full text-center"
        initial={{ scale: 0.7, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.7, y: 40 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        data-ocid="modal.dialog"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-extrabold text-purple-700 mb-2">
          {title}
        </h2>
        <p className="text-gray-500 font-semibold mb-6">Coming Soon!</p>
        <button
          type="button"
          onClick={onClose}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-8 rounded-full text-lg transition-colors"
          data-ocid="modal.confirm_button"
        >
          OK!
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-10"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.72 0.18 255) 0%, oklch(0.65 0.22 290) 50%, oklch(0.60 0.20 320) 100%)",
      }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="text-6xl mb-3">🏠</div>
        <h1 className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg tracking-tight">
          Kids House
        </h1>
        <p className="text-white/80 font-semibold text-lg mt-2">
          Fun &amp; Learning for Kids! ✨
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-5 sm:gap-6 w-full max-w-sm sm:max-w-xl">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            className={`bg-white rounded-3xl border-2 ${card.border} shadow-card flex flex-col items-center justify-center py-7 px-4 select-none`}
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: i * 0.1 + 0.2,
              duration: 0.5,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 60px 0 oklch(0.55 0.18 290 / 0.22)",
            }}
            whileTap={{ scale: 0.97 }}
            data-ocid={`${card.id}.card`}
          >
            {/* Gradient bubble */}
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-br ${card.glow} flex items-center justify-center mb-4 shadow-md`}
            >
              <span className="text-4xl">{card.emoji}</span>
            </div>
            <h2 className="text-xl font-extrabold text-gray-800 mb-4">
              {card.title}
            </h2>
            <button
              type="button"
              onClick={() => setActiveModal(card.title)}
              className={`${card.btnColor} text-white font-bold py-2 px-7 rounded-full text-base transition-all duration-150 shadow-md active:scale-95`}
              data-ocid={`${card.id}.primary_button`}
            >
              {card.button}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-white/60 text-sm font-semibold">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          className="underline hover:text-white transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          caffeine.ai
        </a>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeModal && (
          <ComingSoonModal
            title={activeModal}
            onClose={() => setActiveModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
