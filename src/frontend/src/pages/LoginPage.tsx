import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateUser } from "../hooks/useQueries";

const RAINBOW_DOTS = ["purple", "red", "green", "blue", "amber"] as const;

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [parentalPin, setParentalPin] = useState("");

  const { login, isLoggingIn, identity } = useInternetIdentity();
  const createUser = useCreateUser();

  const handleLogin = () => {
    login();
  };

  const handleSignup = async () => {
    if (!identity) {
      toast.error("Please login with Internet Identity first");
      login();
      return;
    }
    if (!username || !email || !password || !pin) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await createUser.mutateAsync({
        username,
        email,
        password,
        pinSettings: {
          userPIN: pin,
          parentalPIN: parentalPin || "0000",
        },
      });
      toast.success("Account created! 🎉");
    } catch (e: any) {
      toast.error(e.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-center mb-8"
        >
          <div className="text-7xl mb-2">🏠</div>
          <div className="text-4xl font-black">
            <span className="text-kids-blue">KIDS </span>
            <span className="text-kids-red">HO</span>
            <span className="text-kids-green">USE</span>
          </div>
          <div className="flex justify-center gap-1 mt-2">
            {RAINBOW_DOTS.map((color) => (
              <div
                key={color}
                className={`w-4 h-4 rounded-full bg-kids-${color}`}
              />
            ))}
          </div>
          <p className="text-muted-foreground font-semibold mt-2 text-sm">
            Fun Learning for Kids! 🌟
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="bg-card rounded-3xl shadow-card p-1.5 flex mb-6 gap-1">
          {(["login", "signup"] as const).map((t) => (
            <button
              type="button"
              key={t}
              data-ocid={`auth.${t}.tab`}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 rounded-2xl font-black text-base transition-all ${
                tab === t
                  ? "bg-primary text-primary-foreground shadow-btn"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "login" ? "🔑 Login" : "✨ Sign Up"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: tab === "login" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: tab === "login" ? 20 : -20 }}
            transition={{ duration: 0.2 }}
            className="bg-card rounded-3xl shadow-card p-6 space-y-4"
          >
            {tab === "login" ? (
              <>
                <div className="text-center text-2xl font-black text-foreground mb-2">
                  Welcome Back! 👋
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="font-bold text-foreground">
                      Username
                    </Label>
                    <Input
                      data-ocid="login.username.input"
                      placeholder="Your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="mt-1 rounded-2xl border-2 border-border focus:border-primary h-12 font-semibold text-base"
                    />
                  </div>
                  <div>
                    <Label className="font-bold text-foreground">
                      Password
                    </Label>
                    <Input
                      data-ocid="login.password.input"
                      type="password"
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 rounded-2xl border-2 border-border focus:border-primary h-12 font-semibold text-base"
                    />
                  </div>
                </div>
                <Button
                  data-ocid="login.submit_button"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full h-14 rounded-full text-lg font-black bg-primary hover:bg-primary/90 shadow-btn"
                >
                  {isLoggingIn ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    "🔑"
                  )}
                  {isLoggingIn
                    ? "Logging in..."
                    : "Login with Internet Identity"}
                </Button>
              </>
            ) : (
              <>
                <div className="text-center text-2xl font-black text-foreground mb-2">
                  Create Account! 🎉
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="font-bold text-foreground">
                      Username
                    </Label>
                    <Input
                      data-ocid="signup.username.input"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="mt-1 rounded-2xl border-2 border-border focus:border-secondary h-12 font-semibold text-base"
                    />
                  </div>
                  <div>
                    <Label className="font-bold text-foreground">Email</Label>
                    <Input
                      data-ocid="signup.email.input"
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 rounded-2xl border-2 border-border focus:border-secondary h-12 font-semibold text-base"
                    />
                  </div>
                  <div>
                    <Label className="font-bold text-foreground">
                      Password
                    </Label>
                    <Input
                      data-ocid="signup.password.input"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 rounded-2xl border-2 border-border focus:border-secondary h-12 font-semibold text-base"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="font-bold text-foreground">
                        Your PIN
                      </Label>
                      <Input
                        data-ocid="signup.pin.input"
                        type="password"
                        maxLength={6}
                        placeholder="4-6 digits"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="mt-1 rounded-2xl border-2 border-border focus:border-secondary h-12 font-semibold text-base"
                      />
                    </div>
                    <div>
                      <Label className="font-bold text-foreground">
                        Parent PIN
                      </Label>
                      <Input
                        data-ocid="signup.parental_pin.input"
                        type="password"
                        maxLength={6}
                        placeholder="4-6 digits"
                        value={parentalPin}
                        onChange={(e) => setParentalPin(e.target.value)}
                        className="mt-1 rounded-2xl border-2 border-border focus:border-secondary h-12 font-semibold text-base"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {!identity && (
                    <Button
                      data-ocid="signup.connect_button"
                      onClick={handleLogin}
                      disabled={isLoggingIn}
                      variant="outline"
                      className="w-full h-12 rounded-full font-bold border-2 border-primary text-primary"
                    >
                      {isLoggingIn ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "🔗"
                      )}
                      {isLoggingIn
                        ? "Connecting..."
                        : "Connect Internet Identity"}
                    </Button>
                  )}
                  {identity && (
                    <div className="text-center text-xs text-secondary font-semibold">
                      ✅ Identity connected!
                    </div>
                  )}
                  <Button
                    data-ocid="signup.submit_button"
                    onClick={handleSignup}
                    disabled={createUser.isPending}
                    className="w-full h-14 rounded-full text-lg font-black shadow-btn"
                    style={{
                      background: "oklch(var(--secondary))",
                      color: "white",
                    }}
                  >
                    {createUser.isPending ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      "✨"
                    )}
                    {createUser.isPending ? "Creating..." : "Create Account"}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-xs text-muted-foreground mt-6 font-semibold">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
