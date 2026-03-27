import { Toaster } from "@/components/ui/sonner";
import { motion } from "motion/react";
import { useState } from "react";
import BottomNav from "./components/BottomNav";
import NotificationsPanel from "./components/NotificationsPanel";
import ProfileModal from "./components/ProfileModal";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useCallerProfile } from "./hooks/useQueries";
import ChatPage from "./pages/ChatPage";
import CoursesPage from "./pages/CoursesPage";
import GamesPage from "./pages/GamesPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ShortsPage from "./pages/ShortsPage";

export type Tab = "home" | "shorts" | "games" | "courses" | "chat";

const LOADING_DOTS = ["purple", "red", "green", "blue", "amber"] as const;

const SIDEBAR_TABS: { id: Tab; label: string; hindi: string; emoji: string }[] =
  [
    { id: "home", label: "Home", hindi: "घर", emoji: "🏠" },
    { id: "shorts", label: "Shorts", hindi: "शॉर्ट्स", emoji: "▶️" },
    { id: "games", label: "Games", hindi: "गेम्स", emoji: "🎮" },
    { id: "courses", label: "Courses", hindi: "कोर्स", emoji: "📚" },
    { id: "chat", label: "Chat", hindi: "चैट", emoji: "💬" },
  ];

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifCount, setNotifCount] = useState(3);
  const { data: profile, isLoading: profileLoading } = useCallerProfile();

  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-7xl animate-bounce">🏠</div>
          <div className="text-3xl font-black">
            <span className="text-kids-blue">Kids </span>
            <span className="text-kids-red">House</span>
          </div>
          <div className="flex gap-1">
            {LOADING_DOTS.map((color, i) => (
              <div
                key={color}
                className={`w-3 h-3 rounded-full bg-kids-${color} animate-bounce`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-center" />
        <LoginPage />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header — full width on desktop */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          data-ocid="header.home.link"
          onClick={() => setActiveTab("home")}
          className="flex items-center gap-2"
        >
          <span className="text-2xl">🏠</span>
          <span className="text-xl font-black">
            <span className="text-kids-blue">Kids </span>
            <span className="text-kids-red">House</span>
          </span>
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="header.notifications.button"
            onClick={() => {
              setShowNotifications(true);
              setNotifCount(0);
            }}
            className="relative w-10 h-10 rounded-full bg-kids-amber/10 flex items-center justify-center hover:bg-kids-amber/20 transition-colors"
          >
            <span className="text-xl">🔔</span>
            {notifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-kids-red rounded-full text-white text-[10px] font-black flex items-center justify-center">
                {notifCount}
              </span>
            )}
          </button>
          <button
            type="button"
            data-ocid="header.profile.button"
            onClick={() => setShowProfile(true)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-kids-blue to-kids-purple flex items-center justify-center text-white font-black text-lg shadow-btn"
          >
            {profile?.username?.[0]?.toUpperCase() ?? "👤"}
          </button>
        </div>
      </header>

      {/* Body: sidebar on desktop, bottom nav on mobile */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 sticky top-[57px] h-[calc(100vh-57px)] border-r border-border bg-white/80 backdrop-blur-sm pt-4 pb-6 px-3">
          {SIDEBAR_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 font-black text-sm transition-all ${
                  isActive
                    ? "bg-kids-blue/10 text-kids-blue"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-pill"
                    className="absolute inset-0 bg-kids-blue/10 rounded-2xl"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="text-xl">{tab.emoji}</span>
                <span>{tab.hindi}</span>
              </button>
            );
          })}
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 pb-24 md:pb-8 overflow-y-auto">
          <div className="w-full max-w-3xl mx-auto">
            {activeTab === "home" && <HomePage />}
            {activeTab === "shorts" && <ShortsPage />}
            {activeTab === "games" && <GamesPage />}
            {activeTab === "courses" && <CoursesPage />}
            {activeTab === "chat" && <ChatPage />}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />

      {showProfile && (
        <ProfileModal
          profile={profile ?? null}
          onClose={() => setShowProfile(false)}
        />
      )}

      {showNotifications && (
        <NotificationsPanel onClose={() => setShowNotifications(false)} />
      )}

      <Toaster position="top-center" />
    </div>
  );
}
