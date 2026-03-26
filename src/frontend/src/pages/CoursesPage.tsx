import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const COURSES = [
  {
    id: "coding",
    emoji: "💻",
    title: "Coding",
    hindi: "कोडिंग",
    gradient: "from-blue-400 to-blue-600",
    border: "border-blue-400",
    lessons: [
      {
        id: 1,
        title: "What is a Computer?",
        hindi: "कंप्यूटर क्या है?",
        emoji: "🖥️",
        duration: "5 min",
      },
      {
        id: 2,
        title: "What is Code?",
        hindi: "कोड क्या है?",
        emoji: "📝",
        duration: "7 min",
      },
      {
        id: 3,
        title: "Variables & Values",
        hindi: "वेरिएबल",
        emoji: "📦",
        duration: "8 min",
      },
      {
        id: 4,
        title: "If-Else Logic",
        hindi: "अगर-नहीं तो",
        emoji: "🔀",
        duration: "10 min",
      },
      {
        id: 5,
        title: "Loops & Repetition",
        hindi: "दोहराना",
        emoji: "🔁",
        duration: "10 min",
      },
    ],
  },
  {
    id: "doctor",
    emoji: "🏥",
    title: "Doctor",
    hindi: "डॉक्टर",
    gradient: "from-red-400 to-rose-600",
    border: "border-red-400",
    lessons: [
      {
        id: 1,
        title: "Why do we get sick?",
        hindi: "बीमारी क्यों होती है?",
        emoji: "🤒",
        duration: "5 min",
      },
      {
        id: 2,
        title: "Body Parts",
        hindi: "शरीर के अंग",
        emoji: "🫀",
        duration: "8 min",
      },
      {
        id: 3,
        title: "Medicines & Safety",
        hindi: "दवाइयां",
        emoji: "💊",
        duration: "6 min",
      },
      {
        id: 4,
        title: "Healthy Eating",
        hindi: "स्वस्थ खाना",
        emoji: "🥦",
        duration: "7 min",
      },
    ],
  },
  {
    id: "teacher",
    emoji: "📖",
    title: "Teacher",
    hindi: "अध्यापक",
    gradient: "from-green-400 to-emerald-600",
    border: "border-green-400",
    lessons: [
      {
        id: 1,
        title: "How to Explain Well",
        hindi: "समझाना सीखें",
        emoji: "🗣️",
        duration: "6 min",
      },
      {
        id: 2,
        title: "Making Lessons Fun",
        hindi: "पढ़ाई मज़ेदार",
        emoji: "🎨",
        duration: "8 min",
      },
      {
        id: 3,
        title: "Helping Students",
        hindi: "छात्रों की मदद",
        emoji: "🤝",
        duration: "7 min",
      },
    ],
  },
  {
    id: "police",
    emoji: "👮",
    title: "Police",
    hindi: "पुलिस",
    gradient: "from-indigo-400 to-indigo-700",
    border: "border-indigo-400",
    lessons: [
      {
        id: 1,
        title: "Keeping People Safe",
        hindi: "सुरक्षा",
        emoji: "🛡️",
        duration: "5 min",
      },
      {
        id: 2,
        title: "Rules & Laws",
        hindi: "कानून",
        emoji: "⚖️",
        duration: "7 min",
      },
      {
        id: 3,
        title: "Emergency Response",
        hindi: "आपातकाल",
        emoji: "🚨",
        duration: "8 min",
      },
    ],
  },
  {
    id: "business",
    emoji: "💼",
    title: "Business",
    hindi: "बिज़नेस",
    gradient: "from-amber-400 to-orange-600",
    border: "border-amber-400",
    lessons: [
      {
        id: 1,
        title: "What is Business?",
        hindi: "व्यापार क्या है?",
        emoji: "🏪",
        duration: "5 min",
      },
      {
        id: 2,
        title: "Buying & Selling",
        hindi: "खरीदना-बेचना",
        emoji: "🛒",
        duration: "6 min",
      },
      {
        id: 3,
        title: "Making Money",
        hindi: "पैसे कमाना",
        emoji: "💰",
        duration: "7 min",
      },
      {
        id: 4,
        title: "Saving & Investing",
        hindi: "बचत",
        emoji: "🏦",
        duration: "8 min",
      },
    ],
  },
];

export default function CoursesPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Record<string, Set<number>>>({});

  const toggleLesson = (courseId: string, lessonId: number) => {
    setCompleted((prev) => {
      const set = new Set(prev[courseId] ?? []);
      if (set.has(lessonId)) set.delete(lessonId);
      else set.add(lessonId);
      return { ...prev, [courseId]: set };
    });
  };

  const getProgress = (courseId: string, total: number) => {
    const done = completed[courseId]?.size ?? 0;
    return Math.round((done / total) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-black">
          <span className="text-kids-amber">कोर्स </span>
          <span className="text-kids-blue">Courses</span> 📚
        </h1>
        <p className="text-xs text-muted-foreground font-semibold">
          Choose your dream career path!
        </p>
      </div>

      <div className="px-4 py-3 space-y-3">
        {COURSES.map((course, i) => {
          const prog = getProgress(course.id, course.lessons.length);
          const isOpen = expanded === course.id;

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              data-ocid={`courses.item.${i + 1}`}
              className={`bg-card rounded-3xl overflow-hidden border-4 ${course.border} shadow-card`}
            >
              <button
                type="button"
                data-ocid={`courses.open_modal_button.${i + 1}`}
                onClick={() => setExpanded(isOpen ? null : course.id)}
                className="w-full text-left"
              >
                <div
                  className={`bg-gradient-to-r ${course.gradient} p-4 flex items-center gap-3`}
                >
                  <span className="text-4xl">{course.emoji}</span>
                  <div className="flex-1">
                    <p className="font-black text-white text-lg">
                      {course.hindi}
                    </p>
                    <p className="text-white/80 text-xs font-semibold">
                      {course.title} · {course.lessons.length} Lessons
                    </p>
                  </div>
                  <div className="text-white text-xl">{isOpen ? "▲" : "▼"}</div>
                </div>
                <div className="px-4 py-2">
                  <div className="flex justify-between text-xs font-bold text-muted-foreground mb-1">
                    <span>Progress / प्रगति</span>
                    <span>{prog}%</span>
                  </div>
                  <Progress value={prog} className="h-2 rounded-full" />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-2">
                      {course.lessons.map((lesson, j) => {
                        const done =
                          completed[course.id]?.has(lesson.id) ?? false;
                        return (
                          <button
                            type="button"
                            key={lesson.id}
                            data-ocid={`courses.lesson.${j + 1}`}
                            onClick={() => toggleLesson(course.id, lesson.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
                              done
                                ? "bg-green-50 border-green-300"
                                : "bg-white border-border hover:border-kids-blue"
                            }`}
                          >
                            <span className="text-2xl">
                              {done ? "✅" : lesson.emoji}
                            </span>
                            <div className="flex-1 text-left">
                              <p
                                className={`text-sm font-black ${done ? "line-through text-muted-foreground" : "text-foreground"}`}
                              >
                                {lesson.hindi}
                              </p>
                              <p className="text-xs text-muted-foreground font-semibold">
                                {lesson.title} · {lesson.duration}
                              </p>
                            </div>
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                done
                                  ? "bg-green-400 border-green-400"
                                  : "border-muted-foreground"
                              }`}
                            >
                              {done && (
                                <span className="text-white text-xs">✓</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <footer className="text-center py-6 text-xs text-muted-foreground font-semibold px-4">
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
