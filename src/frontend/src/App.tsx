import { useCallback, useEffect, useRef, useState } from "react";

export type Tab = string;
type Section =
  | "home"
  | "learning"
  | "games"
  | "drawing"
  | "longvideos"
  | "shortvideos";
type LearnTab = "alphabet" | "numbers";
type GameView = "menu" | "memory";

const ALPHABET_WORDS: [string, string, string][] = [
  ["A", "Apple", "🍎"],
  ["B", "Ball", "⚽"],
  ["C", "Cat", "🐱"],
  ["D", "Dog", "🐶"],
  ["E", "Elephant", "🐘"],
  ["F", "Fish", "🐟"],
  ["G", "Goat", "🐐"],
  ["H", "Hat", "🎩"],
  ["I", "Ice Cream", "🍦"],
  ["J", "Juice", "🧃"],
  ["K", "Kite", "🪁"],
  ["L", "Lion", "🦁"],
  ["M", "Moon", "🌙"],
  ["N", "Nest", "🪺"],
  ["O", "Orange", "🍊"],
  ["P", "Pig", "🐷"],
  ["Q", "Queen", "👑"],
  ["R", "Rainbow", "🌈"],
  ["S", "Sun", "☀️"],
  ["T", "Tree", "🌳"],
  ["U", "Umbrella", "☂️"],
  ["V", "Violin", "🎻"],
  ["W", "Watermelon", "🍉"],
  ["X", "Xylophone", "🎵"],
  ["Y", "Yarn", "🧶"],
  ["Z", "Zebra", "🦓"],
];

const NUMBER_WORDS: [number, string, string][] = [
  [1, "One", "1️⃣"],
  [2, "Two", "2️⃣"],
  [3, "Three", "3️⃣"],
  [4, "Four", "4️⃣"],
  [5, "Five", "5️⃣"],
  [6, "Six", "6️⃣"],
  [7, "Seven", "7️⃣"],
  [8, "Eight", "8️⃣"],
  [9, "Nine", "9️⃣"],
  [10, "Ten", "🔟"],
];

const TILE_COLORS = [
  "#FF9ECC",
  "#FFCB47",
  "#7BD5F5",
  "#A78BFA",
  "#FFA07A",
  "#90EE90",
  "#FFB347",
  "#87CEEB",
  "#DDA0DD",
  "#98FB98",
  "#F08080",
  "#87CEFA",
  "#DEB887",
  "#B0E0E6",
  "#FFD700",
  "#FFA500",
  "#00CED1",
  "#FF69B4",
  "#32CD32",
  "#BA55D3",
  "#FF6347",
  "#4169E1",
  "#3CB371",
  "#DC143C",
  "#1E90FF",
  "#FF8C00",
];

const NUM_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
];

const LONG_VIDEOS = [
  { id: "hBgl3pZMBXQ", title: "Wheels on the Bus 🚌" },
  { id: "CgDEBqNpbCg", title: "Baby Shark Dance 🦈" },
  { id: "YbgnEGUCMSA", title: "Colors Song 🎨" },
  { id: "WqDvbN3BkfE", title: "ABC Song 🔤" },
  { id: "lLN5RMlbXeM", title: "Twinkle Little Star ⭐" },
  { id: "tVlcKp3bWH8", title: "Finger Family Song 👨‍👩‍👧‍👦" },
];

const SHORT_VIDEOS = [
  { id: "YbgnEGUCMSA", title: "Colors Song 🎨" },
  { id: "CgDEBqNpbCg", title: "Baby Shark 🦈" },
  { id: "hBgl3pZMBXQ", title: "Wheels on the Bus 🚌" },
  { id: "WqDvbN3BkfE", title: "ABC Song 🔤" },
  { id: "lLN5RMlbXeM", title: "Twinkle Star ⭐" },
];

const DRAW_COLORS = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#FF6600",
  "#FFCC00",
  "#00AA00",
  "#0066FF",
  "#6600CC",
  "#FF00CC",
  "#FF9999",
  "#99CCFF",
  "#99FF99",
  "#FFCC99",
  "#CC9966",
  "#666666",
  "#CCCCCC",
];

/* ─── Memory Match ─── */
const EMOJIS = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];

function createMemoryDeck() {
  const pairs = [...EMOJIS, ...EMOJIS];
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));
}

/* ─── Back Button ─── */
function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      data-ocid="nav.button"
      onClick={onBack}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: "var(--color-navy)",
        color: "white",
        border: "none",
        borderRadius: "50px",
        padding: "12px 24px",
        fontSize: "1rem",
        fontWeight: 800,
        fontFamily: "'Nunito', sans-serif",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(27,47,102,0.3)",
        transition: "transform 0.15s, box-shadow 0.15s",
        minHeight: "48px",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
    >
      ← Back
    </button>
  );
}

/* ─── Section Header ─── */
function SectionHeader({
  title,
  onBack,
}: { title: string; onBack: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "24px",
        flexWrap: "wrap",
      }}
    >
      <BackButton onBack={onBack} />
      <h1
        style={{
          fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
          fontWeight: 900,
          color: "var(--color-navy)",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {title}
      </h1>
    </div>
  );
}

/* ─── Learning Section ─── */
function LearningSection({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<LearnTab>("alphabet");
  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <SectionHeader title="Learning Time! 📚" onBack={onBack} />
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        {(["alphabet", "numbers"] as LearnTab[]).map((t) => (
          <button
            type="button"
            key={t}
            data-ocid={`learning.${t}.tab`}
            onClick={() => setTab(t)}
            style={{
              padding: "12px 28px",
              borderRadius: "50px",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: "1rem",
              background: tab === t ? "var(--color-learning)" : "#e0f0ff",
              color: tab === t ? "white" : "var(--color-navy)",
              transition: "all 0.2s",
              minHeight: "48px",
            }}
          >
            {t === "alphabet" ? "🔤 A-Z Alphabet" : "🔢 1-10 Numbers"}
          </button>
        ))}
      </div>

      {tab === "alphabet" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
            gap: "12px",
          }}
        >
          {ALPHABET_WORDS.map(([letter, word, emoji], i) => (
            <div
              key={letter}
              style={{
                background: TILE_COLORS[i],
                borderRadius: "16px",
                padding: "16px 8px",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                cursor: "default",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  color: "white",
                  fontFamily: "'Fredoka One', cursive",
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {letter}
              </div>
              <div style={{ fontSize: "1.4rem" }}>{emoji}</div>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "white",
                  marginTop: "4px",
                  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                {word}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "numbers" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "16px",
          }}
        >
          {NUMBER_WORDS.map(([num, word, emoji], i) => (
            <div
              key={num}
              style={{
                background: NUM_COLORS[i],
                borderRadius: "20px",
                padding: "24px 16px",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              }}
            >
              <div
                style={{
                  fontSize: "3.5rem",
                  fontWeight: 900,
                  color: "white",
                  fontFamily: "'Fredoka One', cursive",
                  textShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              >
                {num}
              </div>
              <div style={{ fontSize: "2rem" }}>{emoji}</div>
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "white",
                  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                {word}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Memory Match Game ─── */
function MemoryGame() {
  const [deck, setDeck] = useState(createMemoryDeck());
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const won = deck.every((c) => c.matched);

  const flipCard = useCallback(
    (id: number) => {
      if (locked) return;
      const card = deck.find((c) => c.id === id);
      if (!card || card.flipped || card.matched) return;

      const newSelected = [...selected, id];
      setDeck((prev) =>
        prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)),
      );
      setSelected(newSelected);

      if (newSelected.length === 2) {
        setMoves((m) => m + 1);
        setLocked(true);
        const [a, b] = newSelected.map(
          (sid) => deck.find((c) => c.id === sid)!,
        );
        if (a.emoji === b.emoji) {
          setDeck((prev) =>
            prev.map((c) =>
              newSelected.includes(c.id) ? { ...c, matched: true } : c,
            ),
          );
          setSelected([]);
          setLocked(false);
        } else {
          setTimeout(() => {
            setDeck((prev) =>
              prev.map((c) =>
                newSelected.includes(c.id) ? { ...c, flipped: false } : c,
              ),
            );
            setSelected([]);
            setLocked(false);
          }, 1000);
        }
      }
    },
    [deck, selected, locked],
  );

  const reset = () => {
    setDeck(createMemoryDeck());
    setSelected([]);
    setMoves(0);
    setLocked(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: "1.1rem",
            fontWeight: 800,
            color: "var(--color-navy)",
          }}
        >
          Moves: {moves}
        </span>
        <button
          type="button"
          data-ocid="games.memory.button"
          onClick={reset}
          style={{
            background: "#F28A1F",
            color: "white",
            border: "none",
            borderRadius: "50px",
            padding: "10px 24px",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            fontSize: "0.95rem",
            cursor: "pointer",
            minHeight: "44px",
          }}
        >
          🔄 New Game
        </button>
      </div>
      {won && (
        <div
          style={{
            background: "linear-gradient(135deg, #a8edea, #fed6e3)",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "20px",
            fontSize: "1.5rem",
            fontWeight: 900,
            color: "var(--color-navy)",
          }}
          data-ocid="games.memory.success_state"
        >
          🎉 You Win! {moves} moves! 🎊
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        {deck.map((card) => (
          <button
            type="button"
            key={card.id}
            className={`memory-card ${card.flipped || card.matched ? "flipped" : ""} ${card.matched ? "matched" : ""}`}
            style={{
              width: "100%",
              aspectRatio: "1",
              position: "relative",
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
            onClick={() => flipCard(card.id)}
            data-ocid={`games.memory.item.${card.id + 1}`}
          >
            <div
              className="memory-card-inner"
              style={{ width: "100%", height: "100%" }}
            >
              <div className="memory-card-front">?</div>
              <div className="memory-card-back">{card.emoji}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Games Section ─── */
function GamesSection({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<GameView>("menu");

  if (view === "memory") {
    return (
      <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            data-ocid="games.back.button"
            onClick={() => setView("menu")}
            style={{
              background: "var(--color-navy)",
              color: "white",
              border: "none",
              borderRadius: "50px",
              padding: "12px 24px",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: "1rem",
              cursor: "pointer",
              minHeight: "48px",
            }}
          >
            ← Game Menu
          </button>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              fontWeight: 900,
              color: "var(--color-navy)",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Memory Match 🃏
          </h1>
        </div>
        <MemoryGame />
      </div>
    );
  }

  const games = [
    {
      id: "memory",
      emoji: "🃏",
      title: "Memory Match",
      desc: "Flip cards and find matching pairs!",
      color: "#8C5AD8",
      onClick: () => setView("memory"),
    },
    {
      id: "math",
      emoji: "➕",
      title: "Math Quiz",
      desc: "Solve fun math problems!",
      color: "#F28A1F",
      onClick: () => {},
    },
    {
      id: "color",
      emoji: "🎨",
      title: "Color Match",
      desc: "Match the colors!",
      color: "#63B63E",
      onClick: () => {},
    },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <SectionHeader title="Games 🎮" onBack={onBack} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "20px",
        }}
      >
        {games.map((g) => (
          <button
            type="button"
            key={g.id}
            className="tile-btn"
            style={{
              background: g.color,
              borderRadius: "24px",
              padding: "32px 24px",
              textAlign: "center",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              cursor: "pointer",
              border: "none",
              width: "100%",
              fontFamily: "'Nunito', sans-serif",
            }}
            onClick={g.onClick}
            data-ocid={`games.${g.id}.card`}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>
              {g.emoji}
            </div>
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: 900,
                color: "white",
                fontFamily: "'Nunito', sans-serif",
                marginBottom: "8px",
              }}
            >
              {g.title}
            </div>
            <div
              style={{
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.85)",
                marginBottom: "20px",
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              {g.desc}
            </div>
            <button
              type="button"
              data-ocid={`games.${g.id}.button`}
              style={{
                background: "white",
                color: g.color,
                border: "none",
                borderRadius: "50px",
                padding: "10px 28px",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 900,
                fontSize: "1rem",
                cursor: "pointer",
                minHeight: "44px",
              }}
            >
              ▶ Play!
            </button>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Drawing Section ─── */
function DrawingSection({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<"draw" | "eraser">("draw");
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getPos = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement,
  ) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const t = e.touches[0];
      return {
        x: (t.clientX - rect.left) * scaleX,
        y: (t.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawing.current = true;
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
    ctx.lineWidth = tool === "eraser" ? brushSize * 4 : brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (lastPos.current) {
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    lastPos.current = pos;
  };

  const stopDraw = () => {
    drawing.current = false;
    lastPos.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const sizes = [
    { label: "Small", size: 3 },
    { label: "Medium", size: 8 },
    { label: "Large", size: 18 },
  ];

  return (
    <div style={{ padding: "16px", maxWidth: "900px", margin: "0 auto" }}>
      <SectionHeader title="Drawing Time! 🎨" onBack={onBack} />

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
          marginBottom: "16px",
          background: "white",
          borderRadius: "16px",
          padding: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        {/* Color palette */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {DRAW_COLORS.map((c) => (
            <button
              type="button"
              key={c}
              data-ocid="drawing.select"
              title={c}
              onClick={() => {
                setColor(c);
                setTool("draw");
              }}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: c,
                border:
                  color === c && tool === "draw"
                    ? "3px solid #1B2F66"
                    : "2px solid rgba(0,0,0,0.15)",
                cursor: "pointer",
                transition: "transform 0.1s",
                boxShadow:
                  color === c && tool === "draw"
                    ? "0 0 0 3px rgba(27,47,102,0.3)"
                    : "none",
                transform:
                  color === c && tool === "draw" ? "scale(1.2)" : "scale(1)",
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {/* Brush sizes */}
          {sizes.map((s) => (
            <button
              type="button"
              key={s.label}
              data-ocid="drawing.toggle"
              onClick={() => setBrushSize(s.size)}
              style={{
                padding: "8px 14px",
                borderRadius: "50px",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                fontSize: "0.85rem",
                background: brushSize === s.size ? "#2FA9FF" : "#e8f4ff",
                color: brushSize === s.size ? "white" : "#1B2F66",
                minHeight: "36px",
              }}
            >
              {s.label}
            </button>
          ))}

          {/* Eraser */}
          <button
            type="button"
            data-ocid="drawing.eraser.toggle"
            onClick={() => setTool(tool === "eraser" ? "draw" : "eraser")}
            style={{
              padding: "8px 14px",
              borderRadius: "50px",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              background: tool === "eraser" ? "#F28A1F" : "#fff3e8",
              color: tool === "eraser" ? "white" : "#1B2F66",
              minHeight: "36px",
            }}
          >
            🧹 Eraser
          </button>

          {/* Clear */}
          <button
            type="button"
            data-ocid="drawing.clear.button"
            onClick={clearCanvas}
            style={{
              padding: "8px 14px",
              borderRadius: "50px",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              background: "#FF6B6B",
              color: "white",
              minHeight: "36px",
            }}
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
          border: "3px solid #e0e7ff",
        }}
      >
        <canvas
          ref={canvasRef}
          className="drawing-canvas"
          width={1200}
          height={700}
          data-ocid="drawing.canvas_target"
          style={{ width: "100%", display: "block", background: "white" }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>
    </div>
  );
}

/* ─── Long Videos Section ─── */
function LongVideosSection({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ padding: "24px" }}>
      <SectionHeader title="Long Videos 📺" onBack={onBack} />
      <div
        className="long-videos-scroll"
        style={{ display: "flex", gap: "20px", paddingBottom: "16px" }}
      >
        {LONG_VIDEOS.map((v) => (
          <div
            key={v.id}
            style={{
              minWidth: "320px",
              maxWidth: "380px",
              background: "white",
              borderRadius: "20px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
              overflow: "hidden",
              flexShrink: 0,
            }}
            data-ocid={`longvideos.item.${LONG_VIDEOS.indexOf(v) + 1}`}
          >
            <div
              style={{
                position: "relative",
                paddingTop: "56.25%",
                background: "#111",
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </div>
            <div
              style={{
                padding: "14px 16px",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 800,
                fontSize: "1rem",
                color: "var(--color-navy)",
              }}
            >
              {v.title}
            </div>
          </div>
        ))}
      </div>
      <p
        style={{
          color: "#888",
          fontSize: "0.85rem",
          marginTop: "8px",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        ← Scroll to see more videos
      </p>
    </div>
  );
}

/* ─── Short Videos Section ─── */
function ShortVideosSection({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = (idx: number) => {
    const next = Math.max(0, Math.min(SHORT_VIDEOS.length - 1, idx));
    setCurrent(next);
    const container = containerRef.current;
    if (container) {
      const slides = container.querySelectorAll(".shorts-slide");
      slides[next]?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Fixed top bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "12px 20px",
          background: "rgba(27,47,102,0.92)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <BackButton onBack={onBack} />
        <h1
          style={{
            fontSize: "1.4rem",
            fontWeight: 900,
            color: "white",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          Short Videos 📱
        </h1>
        <span
          style={{
            marginLeft: "auto",
            color: "rgba(255,255,255,0.8)",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
          }}
        >
          {current + 1} / {SHORT_VIDEOS.length}
        </span>
      </div>

      {/* Nav arrows */}
      {current > 0 && (
        <button
          type="button"
          data-ocid="shortvideos.pagination_prev"
          onClick={() => goTo(current - 1)}
          style={{
            position: "fixed",
            bottom: "120px",
            right: "20px",
            zIndex: 100,
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.9)",
            fontSize: "1.3rem",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          ⬆️
        </button>
      )}
      {current < SHORT_VIDEOS.length - 1 && (
        <button
          type="button"
          data-ocid="shortvideos.pagination_next"
          onClick={() => goTo(current + 1)}
          style={{
            position: "fixed",
            bottom: "60px",
            right: "20px",
            zIndex: 100,
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.9)",
            fontSize: "1.3rem",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          ⬇️
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="shorts-container"
        style={{ marginTop: "64px" }}
      >
        {SHORT_VIDEOS.map((v, i) => (
          <div
            key={v.id}
            className="shorts-slide"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#0a0a0a",
              position: "relative",
            }}
            data-ocid={`shortvideos.item.${i + 1}`}
          >
            {/* Vertical video player */}
            <div
              style={{
                height: "calc(100vh - 64px)",
                aspectRatio: "9/16",
                maxWidth: "100%",
                position: "relative",
                background: "#000",
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1${i === current ? "&autoplay=1" : ""}`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </div>
            {/* Title overlay */}
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: 0,
                right: 0,
                textAlign: "center",
                padding: "0 20px",
              }}
            >
              <span
                style={{
                  background: "rgba(0,0,0,0.6)",
                  color: "white",
                  padding: "8px 20px",
                  borderRadius: "50px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 800,
                  fontSize: "1rem",
                }}
              >
                {v.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Home Screen ─── */
const HOME_TILES = [
  {
    id: "learning" as Section,
    num: 1,
    emoji: "📚",
    title: "Learning",
    subtitle: "A-Z & 1-10",
    color: "#2FA9FF",
    textColor: "white",
  },
  {
    id: "games" as Section,
    num: 2,
    emoji: "🎮",
    title: "Games",
    subtitle: "Play & Have Fun",
    color: "#F28A1F",
    textColor: "white",
  },
  {
    id: "drawing" as Section,
    num: 3,
    emoji: "🎨",
    title: "Drawing",
    subtitle: "Create & Color",
    color: "#63B63E",
    textColor: "white",
  },
  {
    id: "longvideos" as Section,
    num: 4,
    emoji: "📺",
    title: "Long Videos",
    subtitle: "YouTube Videos",
    color: "#8C5AD8",
    textColor: "white",
  },
  {
    id: "shortvideos" as Section,
    num: 5,
    emoji: "📱",
    title: "Short Videos",
    subtitle: "Reels & Clips",
    color: "#F4C21A",
    textColor: "#1B2F66",
  },
];

function HomePage({ onNavigate }: { onNavigate: (s: Section) => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F8FC",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "white",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            fontWeight: 900,
            fontFamily: "'Fredoka One', cursive",
            background: "linear-gradient(135deg, #2FA9FF, #8C5AD8, #F28A1F)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "1px",
          }}
          data-ocid="home.section"
        >
          🏠 Kids House
        </h1>
      </header>

      {/* Hero Banner */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #BFEFFF 0%, #7FD9FF 50%, #B5C6FF 100%)",
          padding: "48px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative stars/doodles */}
        {["⭐1", "🌟2", "✨3", "💫4", "⭐5", "🌟6", "✨7"].map((s, i) => (
          <span
            key={s}
            style={{
              position: "absolute",
              fontSize: `${1 + (i % 3) * 0.5}rem`,
              top: `${10 + ((i * 12) % 70)}%`,
              left: `${5 + ((i * 13) % 90)}%`,
              opacity: 0.5,
              animation: `pulse ${2 + i * 0.3}s ease-in-out infinite alternate`,
              pointerEvents: "none",
            }}
          >
            {s}
          </span>
        ))}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              fontWeight: 900,
              color: "var(--color-navy)",
              fontFamily: "'Fredoka One', cursive",
              marginBottom: "16px",
              lineHeight: 1.2,
            }}
          >
            Welcome to Kids House! 🏠
          </h2>
          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
              color: "#2F4A90",
              fontWeight: 700,
              marginBottom: "28px",
            }}
          >
            Learn, Play, Draw & Watch your favorite videos!
          </p>
          <button
            type="button"
            data-ocid="home.primary_button"
            onClick={() => onNavigate("learning")}
            style={{
              background: "var(--color-navy)",
              color: "white",
              border: "none",
              borderRadius: "50px",
              padding: "16px 48px",
              fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
              fontWeight: 900,
              fontFamily: "'Nunito', sans-serif",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(27,47,102,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
              letterSpacing: "1px",
              minHeight: "56px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            🚀 LET'S PLAY!
          </button>
        </div>
      </div>

      {/* Tiles Grid */}
      <main
        style={{ padding: "32px 24px", maxWidth: "1000px", margin: "0 auto" }}
      >
        <h3
          style={{
            textAlign: "center",
            fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
            fontWeight: 900,
            color: "var(--color-navy)",
            marginBottom: "24px",
            letterSpacing: "0.5px",
          }}
        >
          What do you want to do? 🎉
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}
        >
          {/* First 2 tiles — Learning & Games */}
          {HOME_TILES.slice(0, 2).map((tile) => (
            <ActionTile key={tile.id} tile={tile} onNavigate={onNavigate} />
          ))}
          {/* Drawing — full width */}
          <div style={{ gridColumn: "1 / -1" }}>
            <ActionTile tile={HOME_TILES[2]} onNavigate={onNavigate} wide />
          </div>
          {/* Long Videos & Short Videos */}
          {HOME_TILES.slice(3).map((tile) => (
            <ActionTile key={tile.id} tile={tile} onNavigate={onNavigate} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "24px",
          color: "#888",
          fontSize: "0.85rem",
          fontFamily: "'Nunito', sans-serif",
          borderTop: "1px solid #e8ecf4",
          marginTop: "24px",
        }}
      >
        © {new Date().getFullYear()} Kids House.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#2FA9FF", textDecoration: "none", fontWeight: 700 }}
        >
          Built with ❤️ using caffeine.ai
        </a>
      </footer>
    </div>
  );
}

function ActionTile({
  tile,
  onNavigate,
  wide = false,
}: {
  tile: (typeof HOME_TILES)[0];
  onNavigate: (s: Section) => void;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      className="tile-btn"
      onClick={() => onNavigate(tile.id)}
      data-ocid={`home.${tile.id}.button`}
      style={{
        background: tile.color,
        borderRadius: "28px",
        padding: wide ? "28px 40px" : "28px 20px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
        cursor: "pointer",
        position: "relative",
        display: "flex",
        alignItems: wide ? "center" : "flex-start",
        flexDirection: wide ? "row" : "column",
        gap: "16px",
        minHeight: "140px",
      }}
    >
      {/* Number badge */}
      <div
        style={{
          position: wide ? "static" : "absolute",
          top: "14px",
          left: "14px",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Fredoka One', cursive",
          fontWeight: 900,
          fontSize: "1rem",
          color: tile.textColor,
          flexShrink: 0,
        }}
      >
        {tile.num}
      </div>

      {/* Content */}
      <div style={{ marginTop: wide ? 0 : "24px", flex: 1 }}>
        <div style={{ fontSize: wide ? "3.5rem" : "2.5rem", lineHeight: 1 }}>
          {tile.emoji}
        </div>
        <div
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: wide
              ? "clamp(1.5rem, 3vw, 2.2rem)"
              : "clamp(1.2rem, 2.5vw, 1.6rem)",
            color: tile.textColor,
            marginTop: "8px",
            lineHeight: 1,
          }}
        >
          {tile.title}
        </div>
        <div
          style={{
            fontSize: "0.9rem",
            fontWeight: 700,
            color:
              tile.textColor === "white"
                ? "rgba(255,255,255,0.8)"
                : "rgba(27,47,102,0.65)",
            marginTop: "6px",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          {tile.subtitle}
        </div>
      </div>

      {/* Arrow */}
      <div
        style={{
          marginLeft: wide ? "auto" : 0,
          marginTop: wide ? 0 : "auto",
          alignSelf: wide ? "center" : "flex-end",
          fontSize: "1.5rem",
          opacity: 0.7,
        }}
      >
        →
      </div>
    </button>
  );
}

/* ─── Root App ─── */
export default function App() {
  const [section, setSection] = useState<Section>("home");

  const goHome = () => setSection("home");

  // Short videos need full-screen treatment
  if (section === "shortvideos") {
    return <ShortVideosSection onBack={goHome} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FC" }}>
      <style>{`
        @keyframes pulse {
          from { transform: scale(1) rotate(-5deg); opacity: 0.4; }
          to { transform: scale(1.2) rotate(5deg); opacity: 0.7; }
        }
        @media (max-width: 480px) {
          .tile-btn { min-height: 120px !important; }
        }
        @media (min-width: 768px) {
          .home-tiles-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {section === "home" && <HomePage onNavigate={setSection} />}
      {section === "learning" && <LearningSection onBack={goHome} />}
      {section === "games" && <GamesSection onBack={goHome} />}
      {section === "drawing" && <DrawingSection onBack={goHome} />}
      {section === "longvideos" && <LongVideosSection onBack={goHome} />}
    </div>
  );
}
