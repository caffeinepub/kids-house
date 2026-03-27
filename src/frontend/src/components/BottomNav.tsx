import { motion } from "motion/react";
import type { Tab } from "../App";
import { useLanguage } from "../contexts/LanguageContext";

interface BottomNavProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export default function BottomNav({ activeTab, onChange }: BottomNavProps) {
  const { t } = useLanguage();

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: "home", label: t.nav.home, emoji: "🏠" },
    { id: "videos", label: t.nav.videos, emoji: "▶️" },
    { id: "games", label: t.nav.games, emoji: "🎮" },
    { id: "about", label: t.nav.about, emoji: "ℹ️" },
    { id: "contact", label: t.nav.contact, emoji: "📞" },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-border px-2 py-2 z-50"
      style={{ boxShadow: "0 -4px 20px rgba(59,130,246,0.15)" }}
    >
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              data-ocid={`nav.${tab.id}.tab`}
              onClick={() => onChange(tab.id)}
              className="flex flex-col items-center gap-0 relative min-w-[52px] min-h-[52px] justify-center px-1"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-kids-blue/10 rounded-2xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="text-xl relative z-10">{tab.emoji}</span>
              <span
                className={`text-[9px] font-black relative z-10 leading-tight truncate max-w-[48px] text-center ${
                  isActive ? "text-kids-blue" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
