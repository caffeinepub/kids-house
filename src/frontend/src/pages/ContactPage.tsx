import { motion } from "motion/react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div
      className="min-h-screen bg-background px-4 md:px-8 py-6"
      data-ocid="contact.page"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-6xl mb-2">📞</div>
        <h1 className="text-3xl font-black">
          <span className="text-kids-blue">
            {t.contact.title.split(" ")[0]}{" "}
          </span>
          <span className="text-kids-red">
            {t.contact.title.split(" ").slice(1).join(" ")}
          </span>
        </h1>
      </motion.div>

      {/* Contact info card */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-kids-green/10 to-kids-blue/10 rounded-3xl p-5 mb-6 border-2 border-kids-green/30"
      >
        <h2 className="font-black text-kids-green text-lg mb-2">
          📍 {t.contact.info}
        </h2>
        <p className="font-semibold text-foreground">{t.contact.address}</p>
        <p className="font-semibold text-muted-foreground text-sm mt-1">
          hello@kidshouse.app
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        onSubmit={handleSubmit}
        className="bg-card rounded-3xl shadow-card p-6 space-y-4 border-2 border-border"
        data-ocid="contact.panel"
      >
        <div>
          <label
            htmlFor="contact-name"
            className="block font-black text-sm text-foreground mb-1"
          >
            {t.contact.name}
          </label>
          <input
            id="contact-name"
            data-ocid="contact.input"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.contact.name}
            className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-semibold text-sm focus:outline-none focus:border-kids-blue"
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="block font-black text-sm text-foreground mb-1"
          >
            {t.contact.email}
          </label>
          <input
            id="contact-email"
            data-ocid="contact.input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.contact.email}
            className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-semibold text-sm focus:outline-none focus:border-kids-blue"
          />
        </div>
        <div>
          <label
            htmlFor="contact-message"
            className="block font-black text-sm text-foreground mb-1"
          >
            {t.contact.message}
          </label>
          <textarea
            id="contact-message"
            data-ocid="contact.textarea"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.contact.message}
            rows={4}
            className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-semibold text-sm focus:outline-none focus:border-kids-blue resize-none"
          />
        </div>

        {sent ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            data-ocid="contact.success_state"
            className="bg-kids-green/10 border-2 border-kids-green rounded-2xl p-4 text-center font-black text-kids-green"
          >
            {t.contact.sent}
          </motion.div>
        ) : (
          <button
            type="submit"
            data-ocid="contact.submit_button"
            className="w-full py-4 rounded-full bg-gradient-to-r from-kids-blue to-kids-purple text-white font-black text-base shadow-btn active:scale-95 transition-transform"
          >
            {t.contact.send} 🚀
          </button>
        )}
      </motion.form>

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
