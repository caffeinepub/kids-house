import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { UserProfile, UserRole } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveBasicSettings } from "../hooks/useQueries";

interface Props {
  profile: UserProfile | null;
}

export default function SettingsPage({ profile }: Props) {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const saveSettings = useSaveBasicSettings();

  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newParentalPin, setNewParentalPin] = useState("");

  const handleSave = async () => {
    if (!profile) {
      toast.error("Profile not loaded");
      return;
    }
    if (!currentPin) {
      toast.error("Enter your current PIN to save changes 🔒");
      return;
    }
    if (currentPin !== profile.settings.pinSettings.userPIN) {
      toast.error("Incorrect PIN ❌");
      return;
    }
    try {
      const updatedSettings = {
        ...profile.settings,
        pinSettings: {
          userPIN: newPin || profile.settings.pinSettings.userPIN,
          parentalPIN:
            newParentalPin || profile.settings.pinSettings.parentalPIN,
        },
      };
      await saveSettings.mutateAsync(updatedSettings);
      setCurrentPin("");
      setNewPin("");
      setNewPassword("");
      setNewParentalPin("");
      toast.success("Settings saved! ✅");
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const userRole: UserRole | undefined = profile?.settings?.userRole;

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 pt-6 pb-3 border-b border-border">
        <h1 className="text-2xl font-black">
          <span className="text-kids-purple">Set</span>
          <span className="text-kids-blue">tings</span> ⚙️
        </h1>
        <p className="text-xs text-muted-foreground font-semibold">
          Manage your account & PIN
        </p>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl shadow-card p-5 flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-kids-blue to-kids-purple flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <p className="font-black text-xl text-foreground">
              {profile?.username ?? "Guest"}
            </p>
            <p className="text-sm text-muted-foreground font-semibold">
              {profile?.email ?? ""}
            </p>
            {userRole && (
              <span className="inline-block mt-1 text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {userRole}
              </span>
            )}
          </div>
        </motion.div>

        {/* PIN Settings */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-card rounded-3xl shadow-card p-5 space-y-4"
        >
          <h2 className="font-black text-lg text-foreground">
            🔐 PIN Settings
          </h2>

          <div>
            <Label className="font-bold text-foreground">
              Current PIN (required to save)
            </Label>
            <Input
              data-ocid="settings.current_pin.input"
              type="password"
              maxLength={6}
              placeholder="Enter current PIN"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              className="mt-1 rounded-2xl border-2 border-border focus:border-kids-purple h-12 font-semibold text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="font-bold text-foreground">New User PIN</Label>
              <Input
                data-ocid="settings.new_pin.input"
                type="password"
                maxLength={6}
                placeholder="Leave blank to keep"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="mt-1 rounded-2xl border-2 border-border focus:border-kids-purple h-12 font-semibold text-base"
              />
            </div>
            <div>
              <Label className="font-bold text-foreground">
                New Parent PIN
              </Label>
              <Input
                data-ocid="settings.new_parental_pin.input"
                type="password"
                maxLength={6}
                placeholder="Leave blank to keep"
                value={newParentalPin}
                onChange={(e) => setNewParentalPin(e.target.value)}
                className="mt-1 rounded-2xl border-2 border-border focus:border-kids-purple h-12 font-semibold text-base"
              />
            </div>
          </div>
        </motion.div>

        {/* Password change */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="bg-card rounded-3xl shadow-card p-5 space-y-4"
        >
          <h2 className="font-black text-lg text-foreground">
            🔑 Change Password
          </h2>
          <div>
            <Label className="font-bold text-foreground">New Password</Label>
            <Input
              data-ocid="settings.new_password.input"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 rounded-2xl border-2 border-border focus:border-primary h-12 font-semibold text-base"
            />
          </div>
        </motion.div>

        {/* Save button */}
        <Button
          data-ocid="settings.save_button"
          onClick={handleSave}
          disabled={saveSettings.isPending || !currentPin}
          className="w-full h-14 rounded-full text-lg font-black shadow-btn bg-primary"
        >
          {saveSettings.isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            "💾"
          )}
          {saveSettings.isPending ? "Saving..." : "Save Settings"}
        </Button>

        {/* Logout button */}
        <Button
          data-ocid="settings.logout_button"
          onClick={handleLogout}
          variant="outline"
          className="w-full h-12 rounded-full font-bold border-2 border-destructive text-destructive hover:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>

        {/* Principal */}
        {identity && (
          <div className="bg-muted/50 rounded-2xl p-3">
            <p className="text-xs font-bold text-muted-foreground">Your ID:</p>
            <p className="text-xs font-mono text-muted-foreground truncate mt-0.5">
              {identity.getPrincipal().toString()}
            </p>
          </div>
        )}

        <footer className="text-center py-2 text-xs text-muted-foreground font-semibold">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
