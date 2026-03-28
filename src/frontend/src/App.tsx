import { Toaster } from "@/components/ui/sonner";
import { Bell, Gamepad2, Home, PlusSquare, User, Video } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import GamesPage from "./pages/GamesPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import UploadPage from "./pages/UploadPage";
import VideosPage from "./pages/VideosPage";

type Tab = "home" | "videos" | "upload" | "games" | "profile";

const NAV_ITEMS: {
  id: Tab;
  icon: React.ReactNode;
  labelKey: keyof ReturnType<typeof useLanguage>["t"]["nav"];
}[] = [
  { id: "home", icon: <Home className="w-5 h-5" />, labelKey: "home" },
  { id: "videos", icon: <Video className="w-5 h-5" />, labelKey: "videos" },
  {
    id: "upload",
    icon: <PlusSquare className="w-5 h-5" />,
    labelKey: "addvideo",
  },
  { id: "games", icon: <Gamepad2 className="w-5 h-5" />, labelKey: "games" },
  { id: "profile", icon: <User className="w-5 h-5" />, labelKey: "profile" },
];

const TAB_COLORS: Record<Tab, string> = {
  home: "bg-kids-blue text-white",
  videos: "bg-kids-red text-white",
  upload: "bg-kids-green text-white",
  games: "bg-kids-amber text-white",
  profile: "bg-kids-purple text-white",
};

const TAB_ICON_COLORS: Record<Tab, string> = {
  home: "text-kids-blue",
  videos: "text-kids-red",
  upload: "text-kids-green",
  games: "text-kids-amber",
  profile: "text-kids-purple",
};

function AppShell() {
  const { identity, isInitializing } = useInternetIdentity();
  const { lang, toggleLang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [showNotif, setShowNotif] = useState(false);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-16 h-16 rounded-full border-4 border-kids-blue border-t-transparent"
        />
      </div>
    );
  }

  if (!identity) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return <HomePage />;
      case "videos":
        return <VideosPage />;
      case "upload":
        return <UploadPage />;
      case "games":
        return <GamesPage />;
      case "profile":
        return <ProfilePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r-2 border-border fixed left-0 top-0 h-full z-30 shadow-card">
        {/* Logo */}
        <div className="px-6 py-5 border-b-2 border-border">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏠</span>
            <div>
              <div className="font-black text-xl leading-tight">
                <span className="text-kids-blue">KIDS </span>
                <span className="text-kids-red">HO</span>
                <span className="text-kids-green">USE</span>
              </div>
              <div className="text-xs text-muted-foreground font-semibold">
                Fun &amp; Learning ✨
              </div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav
          className="flex-1 px-3 py-4 space-y-1"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-ocid={`nav.${item.id}.link`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-base transition-all ${
                  isActive
                    ? `${TAB_COLORS[item.id]} shadow-btn`
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className={isActive ? "" : TAB_ICON_COLORS[item.id]}>
                  {item.icon}
                </span>
                {t.nav[item.labelKey]}
              </button>
            );
          })}
        </nav>

        {/* Lang toggle + logout at bottom */}
        <div className="px-3 pb-5 space-y-2">
          <button
            type="button"
            data-ocid="sidebar.lang.toggle"
            onClick={toggleLang}
            className="w-full px-4 py-2.5 rounded-2xl bg-kids-blue text-white font-black text-sm transition-all hover:opacity-90"
          >
            {lang === "en" ? "🇮🇳 हिंदी" : "🇬🇧 English"}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-card border-b-2 border-border shadow-sm flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-2 md:hidden">
            <span className="text-2xl">🏠</span>
            <span className="font-black text-lg">
              <span className="text-kids-blue">KIDS </span>
              <span className="text-kids-red">HO</span>
              <span className="text-kids-green">USE</span>
            </span>
          </div>
          <div className="hidden md:block font-black text-lg text-foreground">
            {NAV_ITEMS.find((n) => n.id === activeTab) && (
              <span className={TAB_ICON_COLORS[activeTab]}>
                {t.nav[NAV_ITEMS.find((n) => n.id === activeTab)!.labelKey]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="header.lang.toggle"
              onClick={toggleLang}
              className="rounded-full bg-gradient-to-r from-kids-blue to-kids-purple text-white text-xs font-black px-3 py-1.5 shadow-btn"
            >
              {lang === "en" ? "HI" : "EN"}
            </button>
            <button
              type="button"
              data-ocid="header.notifications.button"
              onClick={() => setShowNotif((v) => !v)}
              className="relative w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-kids-red rounded-full border-2 border-card" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-card border-t-2 border-border flex"
        aria-label="Bottom navigation"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              data-ocid={`bottom_nav.${item.id}.link`}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-xs font-black transition-all ${
                isActive ? TAB_ICON_COLORS[item.id] : "text-muted-foreground"
              }`}
            >
              <span
                className={`p-1.5 rounded-xl transition-all ${isActive ? `${TAB_COLORS[item.id]} shadow-btn` : ""}`}
              >
                {item.icon}
              </span>
              <span>{t.nav[item.labelKey]}</span>
            </button>
          );
        })}
      </nav>

      {/* Notifications panel */}
      <AnimatePresence>
        {showNotif && (
          <motion.div
            data-ocid="notifications.panel"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed top-16 right-4 z-50 bg-card rounded-3xl shadow-card-hover border-2 border-border p-4 w-72"
          >
            <button
              type="button"
              data-ocid="notifications.close_button"
              onClick={() => setShowNotif(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
            <h3 className="font-black text-base mb-3 text-foreground">
              🔔 Notifications
            </h3>
            <div className="space-y-2">
              <div className="bg-kids-blue/10 rounded-2xl p-3 border-l-4 border-kids-blue">
                <p className="text-xs font-bold text-foreground">
                  🎉 New video uploaded by FunLearn Kids!
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  2 minutes ago
                </p>
              </div>
              <div className="bg-kids-green/10 rounded-2xl p-3 border-l-4 border-kids-green">
                <p className="text-xs font-bold text-foreground">
                  🎮 Try the new Color Match game!
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  1 hour ago
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
}
