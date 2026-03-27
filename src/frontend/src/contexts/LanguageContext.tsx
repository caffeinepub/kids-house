import { createContext, useContext, useState } from "react";

type Lang = "en" | "hi";

const translations = {
  en: {
    nav: {
      home: "Home",
      videos: "Videos",
      games: "Games",
      about: "About",
      contact: "Contact",
    },
    home: {
      search: "Search videos...",
      noVideos: "No videos found",
      demoNote: "Demo videos — Upload your own from Profile!",
      categories: {
        all: "All",
        education: "Education",
        fun: "Fun",
        coding: "Coding",
        career: "Career",
        games: "Games",
      },
    },
    games: {
      title: "Games",
      subtitle: "Fun educational mini-games!",
      cats: { all: "All", brain: "Brain", fun: "Fun", learning: "Learning" },
      play: "Play",
      memoryTitle: "Memory Match",
      mathTitle: "Math Quiz",
      wordTitle: "Word Puzzle",
      colorTitle: "Color Match",
      restart: "Restart",
      wellDone: "Well Done!",
      playAgain: "Play Again",
      findColor: "Find this color!",
    },
    about: {
      title: "About Kids House",
      desc: "Kids House is a fun, safe, and colorful learning platform for children aged 5–11. Watch videos, play games, and explore courses!",
      mission: "Our Mission",
      missionText: "To make learning fun and accessible for every child.",
      features: "Features",
      feature1: "🎥 Educational Videos",
      feature2: "🎮 Fun Games",
      feature3: "📚 Career Courses",
      feature4: "🔒 Safe Environment",
    },
    contact: {
      title: "Contact Us",
      name: "Your Name",
      email: "Your Email",
      message: "Your Message",
      send: "Send Message",
      sent: "Message sent! 🎉",
      info: "Get in touch",
      address: "Kids House, India 🇮🇳",
    },
    login: {
      title: "Kids House",
      subtitle: "Login to start learning!",
      loginBtn: "Login with Internet Identity",
    },
    header: { appName: "Kids House" },
  },
  hi: {
    nav: {
      home: "घर",
      videos: "वीडियो",
      games: "गेम्स",
      about: "हमारे बारे में",
      contact: "संपर्क",
    },
    home: {
      search: "वीडियो खोजें...",
      noVideos: "कोई वीडियो नहीं मिला",
      demoNote: "डेमो वीडियो — प्रोफाइल से अपना अपलोड करें!",
      categories: {
        all: "सभी",
        education: "शिक्षा",
        fun: "मज़ा",
        coding: "कोडिंग",
        career: "करियर",
        games: "गेम्स",
      },
    },
    games: {
      title: "गेम्स",
      subtitle: "मज़ेदार शैक्षिक मिनी-गेम्स!",
      cats: { all: "सभी", brain: "दिमाग", fun: "मज़ा", learning: "सीखें" },
      play: "खेलें",
      memoryTitle: "याददाश्त",
      mathTitle: "गणित",
      wordTitle: "शब्द पहेली",
      colorTitle: "रंग मिलाओ",
      restart: "दोबारा",
      wellDone: "शाबाश!",
      playAgain: "फिर खेलें",
      findColor: "इस रंग को ढूंढो!",
    },
    about: {
      title: "किड्स हाउस के बारे में",
      desc: "किड्स हाउस 5-11 साल के बच्चों के लिए एक मज़ेदार, सुरक्षित और रंगीन सीखने का मंच है। वीडियो देखें, गेम्स खेलें और कोर्स एक्सप्लोर करें!",
      mission: "हमारा मिशन",
      missionText: "हर बच्चे के लिए सीखना मज़ेदार और सुलभ बनाना।",
      features: "विशेषताएं",
      feature1: "🎥 शैक्षिक वीडियो",
      feature2: "🎮 मज़ेदार गेम्स",
      feature3: "📚 करियर कोर्स",
      feature4: "🔒 सुरक्षित माहौल",
    },
    contact: {
      title: "हमसे संपर्क करें",
      name: "आपका नाम",
      email: "आपका ईमेल",
      message: "आपका संदेश",
      send: "संदेश भेजें",
      sent: "संदेश भेज दिया! 🎉",
      info: "संपर्क करें",
      address: "किड्स हाउस, भारत 🇮🇳",
    },
    login: {
      title: "किड्स हाउस",
      subtitle: "सीखना शुरू करने के लिए लॉगिन करें!",
      loginBtn: "इंटरनेट आइडेंटिटी से लॉगिन करें",
    },
    header: { appName: "किड्स हाउस" },
  },
};

export type Translations = typeof translations.en;

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem("kids-lang") as Lang) ?? "en",
  );

  const toggleLang = () => {
    setLang((prev) => {
      const next: Lang = prev === "en" ? "hi" : "en";
      localStorage.setItem("kids-lang", next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider
      value={{ lang, toggleLang, t: translations[lang] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
