import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

// ---- Mini Game: Memory Match ----
const CARD_EMOJIS = ["🐶", "🐱", "🐸", "🦊", "🐻", "🐯", "🦁", "🐮"];

function MemoryMatch({ onClose }: { onClose: () => void }) {
  const makeBoard = useCallback(() => {
    const pairs = [...CARD_EMOJIS, ...CARD_EMOJIS];
    return pairs
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);
  }, []);

  const [cards, setCards] = useState(() => makeBoard());
  const [selected, setSelected] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const done = cards.every((c) => c.matched);

  const restart = () => {
    setCards(makeBoard());
    setScore(0);
    setMoves(0);
    setSelected([]);
  };

  const flip = (id: number) => {
    if (selected.length === 2) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    const newSelected = [...selected, id];
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)),
    );
    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newSelected.map((sid) => cards.find((c) => c.id === sid)!);
      if (a.emoji === b.emoji) {
        setCards((prev) =>
          prev.map((c) =>
            newSelected.includes(c.id) ? { ...c, matched: true } : c,
          ),
        );
        setScore((s) => s + 10);
        setSelected([]);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newSelected.includes(c.id) ? { ...c, flipped: false } : c,
            ),
          );
          setSelected([]);
        }, 800);
      }
    } else {
      setSelected(newSelected);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-kids-purple text-white">
        <div>
          <p className="font-black text-lg">🧠 Memory Match</p>
          <p className="text-xs opacity-80">
            Score: {score} | Moves: {moves}
          </p>
        </div>
        <button
          type="button"
          onClick={restart}
          className="bg-white/20 rounded-full px-3 py-1 text-xs font-black"
        >
          ↺ Restart
        </button>
        <button type="button" onClick={onClose} className="text-2xl ml-2">
          ✕
        </button>
      </div>
      {done ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-kids-purple/10">
          <div className="text-7xl">🎉</div>
          <p className="font-black text-2xl text-kids-purple">
            शाबाश! Well Done!
          </p>
          <p className="text-muted-foreground font-semibold">
            Score: {score} in {moves} moves
          </p>
          <button
            type="button"
            onClick={restart}
            className="bg-kids-purple text-white rounded-full px-6 py-3 font-black"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="flex-1 p-4 bg-kids-purple/5">
          <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
            {cards.map((card) => (
              <button
                type="button"
                key={card.id}
                onClick={() => flip(card.id)}
                className={`aspect-square rounded-2xl text-3xl flex items-center justify-center font-bold border-4 transition-all ${
                  card.matched
                    ? "bg-green-100 border-green-400"
                    : card.flipped
                      ? "bg-white border-kids-purple"
                      : "bg-kids-purple border-kids-purple text-white"
                }`}
              >
                {card.flipped || card.matched ? card.emoji : "?"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Mini Game: Math Quiz ----
const genQ = () => {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const ops = ["+", "-"] as const;
  const op = ops[Math.floor(Math.random() * 2)];
  const answer = op === "+" ? a + b : a - b;
  const opts = [answer];
  while (opts.length < 4) {
    const wrong = answer + (Math.floor(Math.random() * 7) - 3);
    if (!opts.includes(wrong)) opts.push(wrong);
  }
  opts.sort(() => Math.random() - 0.5);
  return { a, b, op, answer, opts };
};

function MathQuiz({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState(() => genQ());
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const answer = (opt: number) => {
    if (feedback) return;
    if (opt === q.answer) {
      setScore((s) => s + 10);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
    setTimeout(() => {
      setQ(genQ());
      setRound((r) => r + 1);
      setFeedback(null);
    }, 900);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-kids-green text-white">
        <div>
          <p className="font-black text-lg">🔢 Math Quiz</p>
          <p className="text-xs opacity-80">
            Score: {score} | Q: {round}
          </p>
        </div>
        <button type="button" onClick={onClose} className="text-2xl">
          ✕
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 bg-kids-green/5">
        {feedback && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-5xl ${feedback === "correct" ? "text-green-500" : "text-red-500"}`}
          >
            {feedback === "correct" ? "✅" : "❌"}
          </motion.div>
        )}
        <div className="bg-white rounded-3xl shadow-card p-8 text-center border-4 border-kids-green w-full max-w-sm">
          <p className="text-5xl font-black text-foreground">
            {q.a} {q.op} {q.b} = ?
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {q.opts.map((opt) => (
            <button
              type="button"
              key={`opt-${opt}`}
              onClick={() => answer(opt)}
              className="py-5 rounded-2xl bg-white border-4 border-kids-green text-2xl font-black text-foreground shadow active:scale-95 transition-transform"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Mini Game: Word Puzzle ----
const WORDS = [
  { word: "CAT", hint: "A small furry pet 🐱" },
  { word: "DOG", hint: "Man's best friend 🐶" },
  { word: "SUN", hint: "It shines in the sky ☀️" },
  { word: "BUS", hint: "You ride to school 🚌" },
  { word: "CUP", hint: "You drink from it ☕" },
];

function WordPuzzle({ onClose }: { onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const w = WORDS[idx % WORDS.length];
  const scrambled = w.word
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  const check = () => {
    if (input.toUpperCase() === w.word) {
      setResult("correct");
      setScore((s) => s + 10);
    } else {
      setResult("wrong");
    }
    setTimeout(() => {
      setIdx((i) => i + 1);
      setInput("");
      setResult(null);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-kids-amber text-white">
        <div>
          <p className="font-black text-lg">📝 Word Puzzle</p>
          <p className="text-xs opacity-80">Score: {score}</p>
        </div>
        <button type="button" onClick={onClose} className="text-2xl">
          ✕
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 bg-amber-50">
        <div className="bg-white rounded-3xl shadow-card p-6 w-full max-w-sm text-center border-4 border-kids-amber">
          <p className="text-sm font-bold text-muted-foreground mb-1">
            Scrambled Word:
          </p>
          <p className="text-5xl font-black text-kids-amber tracking-widest">
            {scrambled}
          </p>
          <p className="text-sm text-muted-foreground font-semibold mt-3">
            Hint: {w.hint}
          </p>
        </div>
        {result && (
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`text-4xl ${result === "correct" ? "text-green-500" : "text-red-500"}`}
          >
            {result === "correct" ? "✅ Correct!" : `❌ It was ${w.word}`}
          </motion.p>
        )}
        <input
          data-ocid="games.word_puzzle.input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="Type the word..."
          className="w-full max-w-sm text-center text-xl font-black uppercase rounded-2xl border-4 border-kids-amber p-4 focus:outline-none"
          maxLength={6}
        />
        <button
          type="button"
          onClick={check}
          className="w-full max-w-sm py-4 bg-kids-amber text-white rounded-full font-black text-lg"
        >
          Check ✓
        </button>
      </div>
    </div>
  );
}

// ---- Mini Game: Color Match ----
const COLOR_OPTIONS = [
  { name: "Red", hindi: "लाल", bg: "bg-red-500" },
  { name: "Blue", hindi: "नीला", bg: "bg-blue-500" },
  { name: "Green", hindi: "हरा", bg: "bg-green-500" },
  { name: "Yellow", hindi: "पीला", bg: "bg-yellow-400" },
  { name: "Purple", hindi: "बैंगनी", bg: "bg-purple-500" },
  { name: "Orange", hindi: "नारंगी", bg: "bg-orange-500" },
];

function ColorMatch({ onClose }: { onClose: () => void }) {
  const getRound = useCallback(() => {
    const shuffled = [...COLOR_OPTIONS].sort(() => Math.random() - 0.5);
    const target = shuffled[0];
    return { target, options: shuffled.slice(0, 4) };
  }, []);

  const [round, setRound] = useState(() => getRound());
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const pick = (name: string) => {
    if (feedback) return;
    if (name === round.target.name) {
      setScore((s) => s + 10);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
    setTimeout(() => {
      setRound(getRound());
      setFeedback(null);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-kids-red text-white">
        <div>
          <p className="font-black text-lg">🎨 Color Match</p>
          <p className="text-xs opacity-80">Score: {score}</p>
        </div>
        <button type="button" onClick={onClose} className="text-2xl">
          ✕
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 bg-red-50">
        <p className="font-black text-xl text-foreground">
          इस रंग को ढूंढो: Find this color!
        </p>
        <div className="bg-white rounded-3xl shadow-card p-8 text-center border-4 border-kids-red w-full max-w-sm">
          <p className="text-4xl font-black text-foreground">
            {round.target.hindi}
          </p>
          <p className="text-lg text-muted-foreground font-semibold">
            ({round.target.name})
          </p>
        </div>
        {feedback && (
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`text-3xl ${feedback === "correct" ? "text-green-500" : "text-red-500"}`}
          >
            {feedback === "correct" ? "✅" : "❌"}
          </motion.p>
        )}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {round.options.map((opt) => (
            <button
              type="button"
              key={opt.name}
              onClick={() => pick(opt.name)}
              className={`${opt.bg} rounded-2xl h-20 text-white font-black text-lg shadow-lg active:scale-95 transition-transform`}
            >
              {opt.hindi}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Main GamesPage ----
const GAME_CATS = [
  { id: "all", hindi: "सभी" },
  { id: "brain", hindi: "दिमाग" },
  { id: "fun", hindi: "मज़ा" },
  { id: "learning", hindi: "सीखें" },
];

const GAMES = [
  {
    id: "memory",
    hindi: "याददाश्त",
    desc: "Flip cards and find pairs!",
    emoji: "🧠",
    cat: "brain",
    gradient: "from-purple-400 to-purple-600",
  },
  {
    id: "math",
    hindi: "गणित",
    desc: "Solve simple math questions!",
    emoji: "🔢",
    cat: "learning",
    gradient: "from-green-400 to-green-600",
  },
  {
    id: "word",
    hindi: "शब्द पहेली",
    desc: "Unscramble words with hints!",
    emoji: "📝",
    cat: "learning",
    gradient: "from-amber-400 to-amber-600",
  },
  {
    id: "color",
    hindi: "रंग मिलाओ",
    desc: "Match colors in Hindi!",
    emoji: "🎨",
    cat: "fun",
    gradient: "from-red-400 to-pink-600",
  },
];

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState("all");

  const filtered = GAMES.filter(
    (g) => activeCat === "all" || g.cat === activeCat,
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 md:px-8 pt-4 pb-2">
        <h1 className="text-2xl font-black">
          <span className="text-kids-green">गेम्स </span>
          <span className="text-kids-blue">Games</span> 🎮
        </h1>
        <p className="text-xs text-muted-foreground font-semibold">
          Fun educational mini-games!
        </p>
      </div>

      <div className="flex gap-2 px-4 md:px-8 py-2 overflow-x-auto no-scrollbar">
        {GAME_CATS.map((cat) => (
          <button
            type="button"
            key={cat.id}
            data-ocid={`games.${cat.id}.tab`}
            onClick={() => setActiveCat(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-black border-2 transition-all ${
              activeCat === cat.id
                ? "bg-kids-green text-white border-kids-green"
                : "bg-card border-border"
            }`}
          >
            {cat.hindi}
          </button>
        ))}
      </div>

      <div className="px-4 md:px-8 py-3 grid grid-cols-2 md:grid-cols-4 gap-3">
        {filtered.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            data-ocid={`games.item.${i + 1}`}
          >
            <button
              type="button"
              data-ocid={`games.play_button.${i + 1}`}
              onClick={() => setActiveGame(game.id)}
              className={`w-full bg-gradient-to-br ${game.gradient} rounded-3xl p-4 text-white text-left shadow-card border-4 border-white/30 active:scale-95 transition-transform`}
            >
              <div className="text-4xl mb-2">{game.emoji}</div>
              <p className="font-black text-sm leading-tight">{game.hindi}</p>
              <p className="text-xs opacity-80 mt-0.5">{game.desc}</p>
              <div className="mt-3 bg-white/20 rounded-full py-1 text-center text-xs font-black">
                ▶ खेलें Play
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-ocid="games.modal"
            className="fixed inset-0 z-50 bg-background flex flex-col md:items-center md:justify-center"
          >
            <div className="w-full h-full md:max-w-lg md:h-auto md:max-h-[90vh] md:rounded-3xl md:overflow-hidden md:shadow-2xl flex flex-col">
              {activeGame === "memory" && (
                <MemoryMatch onClose={() => setActiveGame(null)} />
              )}
              {activeGame === "math" && (
                <MathQuiz onClose={() => setActiveGame(null)} />
              )}
              {activeGame === "word" && (
                <WordPuzzle onClose={() => setActiveGame(null)} />
              )}
              {activeGame === "color" && (
                <ColorMatch onClose={() => setActiveGame(null)} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
