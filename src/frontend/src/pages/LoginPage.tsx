import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const RAINBOW_DOTS = ["blue", "red", "green", "amber", "purple"] as const;

const LOGO_SRC =
  "/assets/uploads/screenshot_20260329_005127-019d35eb-38bb-77ad-a1a4-c9cccee7d402-1.jpg";

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();
  const { lang, toggleLang, t } = useLanguage();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-kids-blue/10 via-kids-purple/5 to-kids-red/10 flex flex-col items-center justify-center px-4 py-8">
      {/* Lang toggle */}
      <div className="absolute top-4 right-4">
        <button
          type="button"
          data-ocid="login.lang.toggle"
          onClick={toggleLang}
          className="rounded-full bg-gradient-to-r from-kids-blue to-kids-purple text-white text-xs font-black px-3 py-1.5 shadow-btn"
        >
          {lang === "en" ? "हिंदी" : "English"}
        </button>
      </div>

      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-center mb-8"
        >
          <img
            src={LOGO_SRC}
            alt="Kids House"
            className="w-24 h-24 rounded-3xl object-cover mx-auto mb-2 shadow-lg"
          />
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
            {t.login.subtitle}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="bg-card rounded-3xl shadow-card p-1.5 flex mb-6 gap-1">
          {(["login", "signup"] as const).map((tabId) => (
            <button
              type="button"
              key={tabId}
              data-ocid={`auth.${tabId}.tab`}
              onClick={() => setTab(tabId)}
              className={`flex-1 py-2.5 rounded-2xl text-sm font-black transition-all ${
                tab === tabId
                  ? "bg-kids-blue text-white shadow-btn"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tabId === "login"
                ? t.login.loginBtn
                : lang === "en"
                  ? "Sign Up"
                  : "साइन अप"}
            </button>
          ))}
        </div>

        {/* Form */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-card rounded-3xl shadow-card p-6 space-y-4"
        >
          {tab === "signup" && (
            <>
              <div className="space-y-1.5">
                <label
                  htmlFor="auth-name"
                  className="text-sm font-black text-foreground"
                >
                  {lang === "en" ? "Your Name" : "आपका नाम"}
                </label>
                <Input
                  id="auth-name"
                  data-ocid="auth.name.input"
                  placeholder={lang === "en" ? "Your Name" : "आपका नाम"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-2xl h-12 font-semibold border-2 focus:border-kids-blue"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="auth-age"
                  className="text-sm font-black text-foreground"
                >
                  {lang === "en" ? "Your Age" : "आपकी उम्र"}
                </label>
                <Input
                  id="auth-age"
                  data-ocid="auth.age.input"
                  type="number"
                  placeholder={lang === "en" ? "Your Age" : "आपकी उम्र"}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min={3}
                  max={18}
                  className="rounded-2xl h-12 font-semibold border-2 focus:border-kids-blue"
                />
              </div>
            </>
          )}

          <Button
            data-ocid="auth.submit_button"
            onClick={() => login()}
            disabled={isLoggingIn}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-kids-blue to-kids-purple text-white font-black text-base shadow-btn hover:opacity-90 transition-opacity"
          >
            {isLoggingIn ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                {lang === "en" ? "Connecting..." : "जोड़ रहा हूँ..."}
              </span>
            ) : tab === "login" ? (
              t.login.loginBtn
            ) : lang === "en" ? (
              "Sign Up"
            ) : (
              "साइन अप"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground font-semibold pt-1">
            {lang === "en"
              ? "Powered by Internet Identity"
              : "इंटरनेट आइडेंटिटी द्वारा"}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
