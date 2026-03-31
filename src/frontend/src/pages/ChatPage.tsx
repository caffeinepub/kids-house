import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const ROOMS = [
  { id: "general", name: "General", hindi: "सामान्य", emoji: "🌟", unread: 2 },
  {
    id: "study",
    name: "Study Group",
    hindi: "पड़ाई ग्रुप",
    emoji: "📚",
    unread: 0,
  },
  { id: "gamers", name: "Gamers", hindi: "गेमर्स", emoji: "🎮", unread: 5 },
  {
    id: "creative",
    name: "Creative Kids",
    hindi: "क्रिएटिव",
    emoji: "🎨",
    unread: 1,
  },
];

type Message = {
  id: number;
  name: string;
  avatar: string;
  text: string;
  time: string;
  self?: boolean;
};

const SEED_MSGS: Record<string, Message[]> = {
  general: [
    {
      id: 1,
      name: "Rahul",
      avatar: "😊",
      text: "नमस्ते दोस्तों! Hello everyone!",
      time: "10:00",
    },
    {
      id: 2,
      name: "Priya",
      avatar: "🌸",
      text: "Hello Rahul! How are you?",
      time: "10:01",
    },
    {
      id: 3,
      name: "Aryan",
      avatar: "🚀",
      text: "I just finished the Coding course 🎉",
      time: "10:05",
    },
  ],
  study: [
    {
      id: 1,
      name: "Neha",
      avatar: "📖",
      text: "Can someone help with Math?",
      time: "09:30",
    },
    {
      id: 2,
      name: "Rohan",
      avatar: "🧠",
      text: "Sure! What problem?",
      time: "09:31",
    },
  ],
  gamers: [
    {
      id: 1,
      name: "Dev",
      avatar: "🎮",
      text: "Who wants to play Memory Match?",
      time: "11:00",
    },
    {
      id: 2,
      name: "Ananya",
      avatar: "⭐",
      text: "Me! I got 200 points yesterday!",
      time: "11:02",
    },
    {
      id: 3,
      name: "Karan",
      avatar: "🏆",
      text: "I beat the Word Puzzle 🎉",
      time: "11:05",
    },
  ],
  creative: [
    {
      id: 1,
      name: "Riya",
      avatar: "🎨",
      text: "I drew a butterfly today 🦋",
      time: "14:00",
    },
    {
      id: 2,
      name: "Sam",
      avatar: "✏️",
      text: "Wow share it please!",
      time: "14:02",
    },
  ],
};

export default function ChatPage() {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(SEED_MSGS);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMsgs = activeRoom ? (messages[activeRoom] ?? []) : [];
  const msgCount = currentMsgs.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new message count
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgCount]);

  const sendMessage = () => {
    if (!input.trim() || !activeRoom) return;
    const newMsg: Message = {
      id: Date.now(),
      name: "You",
      avatar: "👤",
      text: input.trim(),
      time: new Date().toLocaleTimeString("en", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      self: true,
    };
    setMessages((prev) => ({
      ...prev,
      [activeRoom]: [...(prev[activeRoom] ?? []), newMsg],
    }));
    setInput("");
  };

  if (activeRoom) {
    const room = ROOMS.find((r) => r.id === activeRoom)!;
    return (
      <div className="flex flex-col" style={{ height: "calc(100vh - 130px)" }}>
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b-2 border-border">
          <button
            type="button"
            data-ocid="chat.back.button"
            onClick={() => setActiveRoom(null)}
            className="text-2xl text-kids-blue"
          >
            ←
          </button>
          <span className="text-3xl">{room.emoji}</span>
          <div>
            <p className="font-black text-foreground">{room.hindi}</p>
            <p className="text-xs text-muted-foreground font-semibold">
              {room.name}
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-3 space-y-3 bg-blue-50/30">
          {currentMsgs.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.self ? "flex-row-reverse" : ""}`}
            >
              <div className="w-9 h-9 rounded-full bg-white border-2 border-border flex items-center justify-center text-lg flex-shrink-0">
                {msg.avatar}
              </div>
              <div
                className={`max-w-[70%] ${msg.self ? "items-end" : "items-start"} flex flex-col gap-0.5`}
              >
                {!msg.self && (
                  <span className="text-xs font-black text-muted-foreground px-1">
                    {msg.name}
                  </span>
                )}
                <div
                  className={`px-3 py-2 rounded-2xl text-sm font-semibold ${msg.self ? "bg-kids-blue text-white rounded-tr-sm" : "bg-white border border-border rounded-tl-sm"}`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-muted-foreground px-1">
                  {msg.time}
                </span>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2 px-4 md:px-8 py-3 bg-white border-t-2 border-border">
          <input
            data-ocid="chat.input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Message लिखें..."
            className="flex-1 px-4 py-3 rounded-full border-2 border-border bg-blue-50/50 font-semibold text-sm focus:outline-none focus:border-kids-blue"
          />
          <button
            type="button"
            data-ocid="chat.submit_button"
            onClick={sendMessage}
            className="w-12 h-12 rounded-full bg-kids-blue text-white flex items-center justify-center text-xl shadow-btn active:scale-95"
          >
            📤
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 md:px-8 pt-4 pb-2">
        <h1 className="text-2xl font-black">
          <span className="text-kids-purple">चैट </span>
          <span className="text-kids-blue">Chat</span> 💬
        </h1>
        <p className="text-xs text-muted-foreground font-semibold">
          Safe group chats for kids!
        </p>
      </div>
      <div className="px-4 md:px-8 py-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        {ROOMS.map((room, i) => (
          <motion.button
            type="button"
            key={room.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            data-ocid={`chat.room.${i + 1}`}
            onClick={() => setActiveRoom(room.id)}
            className="w-full bg-card rounded-3xl p-4 flex items-center gap-4 border-4 border-border shadow-card text-left"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-kids-blue/20 to-kids-purple/20 flex items-center justify-center text-3xl flex-shrink-0">
              {room.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-foreground">{room.hindi}</p>
              <p className="text-xs text-muted-foreground font-semibold truncate">
                {(messages[room.id] ?? []).slice(-1)[0]?.text ??
                  "Start chatting!"}
              </p>
            </div>
            {room.unread > 0 && (
              <span className="w-6 h-6 bg-kids-red rounded-full text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                {room.unread}
              </span>
            )}
          </motion.button>
        ))}
      </div>
      <div className="mx-4 md:mx-8 mt-4 bg-kids-green/10 border-2 border-kids-green rounded-2xl p-4">
        <p className="font-black text-sm text-kids-green">
          🛡️ Safe Chat Environment
        </p>
        <p className="text-xs text-muted-foreground font-semibold mt-1">
          All messages are moderated for child safety. माता-पिता द्वारा निगरानी।
        </p>
      </div>
    </div>
  );
}
