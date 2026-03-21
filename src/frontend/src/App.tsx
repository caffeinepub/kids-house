import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import BottomNav from "./components/BottomNav";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useCallerProfile } from "./hooks/useQueries";
import AppLockPage from "./pages/AppLockPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import UploadPage from "./pages/UploadPage";

export type Tab = "home" | "upload" | "applock" | "settings";

const LOADING_DOTS = ["purple", "red", "green", "blue", "amber"] as const;

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const { data: profile, isLoading: profileLoading } = useCallerProfile();

  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-bounce-in">
          <div className="text-6xl">🏠</div>
          <div className="text-2xl font-black text-primary">Kids House</div>
          <div className="flex gap-1">
            {LOADING_DOTS.map((color) => (
              <div
                key={color}
                className={`w-3 h-3 rounded-full bg-kids-${color} animate-bounce`}
                style={{
                  animationDelay: `${LOADING_DOTS.indexOf(color) * 0.1}s`,
                }}
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
    <div className="min-h-screen bg-background flex items-start justify-center">
      <div className="w-full max-w-[420px] min-h-screen relative flex flex-col">
        <main className="flex-1 pb-24 overflow-y-auto">
          {activeTab === "home" && <HomePage />}
          {activeTab === "upload" && <UploadPage />}
          {activeTab === "applock" && <AppLockPage profile={profile ?? null} />}
          {activeTab === "settings" && (
            <SettingsPage profile={profile ?? null} />
          )}
        </main>
        <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
