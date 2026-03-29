import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();

  const features = [
    { text: t.about.feature1, bg: "from-kids-blue to-blue-600" },
    { text: t.about.feature2, bg: "from-kids-green to-green-600" },
    { text: t.about.feature3, bg: "from-kids-amber to-amber-600" },
    { text: t.about.feature4, bg: "from-kids-purple to-purple-700" },
  ];

  return (
    <div
      className="min-h-screen bg-background px-4 md:px-8 py-6"
      data-ocid="about.page"
    >
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <img
          src="/assets/generated/kids-house-logo-transparent.dim_512x512.png"
          alt="Kids House"
          className="w-24 h-24 object-contain mx-auto mb-3"
        />
        <h1 className="text-3xl font-black">
          <span className="text-kids-blue">Kids </span>
          <span className="text-kids-red">House</span>
        </h1>
        <p className="text-muted-foreground font-semibold text-sm mt-2 max-w-sm mx-auto">
          {t.about.desc}
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-kids-blue/10 to-kids-purple/10 rounded-3xl p-6 mb-6 border-2 border-kids-blue/20"
      >
        <h2 className="text-xl font-black text-kids-blue mb-2">
          🎯 {t.about.mission}
        </h2>
        <p className="text-foreground font-semibold">{t.about.missionText}</p>
      </motion.div>

      {/* Features */}
      <div className="mb-6">
        <h2 className="text-xl font-black text-foreground mb-4">
          ✨ {t.about.features}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feat, i) => (
            <motion.div
              key={feat.text}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              data-ocid={`about.item.${i + 1}`}
              className={`bg-gradient-to-br ${feat.bg} rounded-3xl p-5 text-white font-black text-base shadow-card`}
            >
              {feat.text}
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="text-center py-6 text-xs text-muted-foreground font-semibold">
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
  );
}
