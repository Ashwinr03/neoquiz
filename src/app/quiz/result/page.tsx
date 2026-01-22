"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ================= TYPES ================= */

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

type HistoryItem = {
  id: string;
  createdAt: number;
  mode: "pdf" | "prompt";
  title: string;
  score: number;
  total: number;
  questions: Question[];
  answers: Record<number, number>;
  timerSeconds?: number | null;
  timeTakenSeconds?: number | null;
  promptFull?: string | null;
  pdfFiles?: { name: string }[] | null;
};

/* ================= TITLE HELPERS (RESTORED) ================= */

function generatePromptTitle(prompt: string): string {
  const cleaned = prompt
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z0-9,. ]/g, "")
    .trim();

  if (!cleaned) return "Prompt Based Quiz";

  const filler =
    /\b(explain|describe|discuss|write|about|based on|in detail|the following)\b/gi;

  const meaningful = cleaned.replace(filler, "").trim();

  let slice = meaningful.slice(0, 60);
  const lastStop = Math.max(
    slice.lastIndexOf("."),
    slice.lastIndexOf(",")
  );

  if (lastStop > 30) slice = slice.slice(0, lastStop);

  return slice.charAt(0).toUpperCase() + slice.slice(1);
}

function generatePdfTitle(files: any[] | undefined): string {
  if (!Array.isArray(files) || files.length === 0) return "PDF Based Quiz";

  const names = files.map((f) =>
    String(f.name || "")
      .replace(/\.pdf$/i, "")
      .trim()
  );

  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]}, ${names[1]}`;
  return `${names[0]} + ${names.length - 1} more`;
}

/* ================= PAGE ================= */

export default function QuizResultPage() {
  const router = useRouter();
  const savedRef = useRef(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);

  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [animatedScore, setAnimatedScore] = useState(0);
  const [filter, setFilter] = useState<
    "all" | "correct" | "wrong" | "unanswered"
  >("all");

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const quizRaw = sessionStorage.getItem("quizData");
    const answersRaw = sessionStorage.getItem("quizAnswers");

    if (!quizRaw || !answersRaw) {
      router.replace("/quiz");
      return;
    }

    const quizData = JSON.parse(quizRaw);
    const quizQuestions: Question[] = quizData.questions;
    const userAnswers: Record<number, number> = JSON.parse(answersRaw);

    let s = 0;
    quizQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) s++;
    });

    setQuestions(quizQuestions);
    setAnswers(userAnswers);
    setScore(s);

    // 🚫 DO NOT resave when viewing from history
    if (quizData.__fromHistory === true) return;
    if (savedRef.current) return;
    savedRef.current = true;

    /* ================= ⏱ TIME LOGIC ================= */

    let timerSeconds: number | null = null;
    let timeTakenSeconds: number | null = null;

    const rawTimer = sessionStorage.getItem("quizTimer");
    const rawEndTime = sessionStorage.getItem("quizEndTime");

    if (rawTimer && rawTimer !== "null") {
      const total = Number(JSON.parse(rawTimer));
      if (total > 0) {
        timerSeconds = total;

        if (rawEndTime) {
          const endTime = Number(rawEndTime);
          const remaining = Math.max(
            0,
            Math.floor((endTime - Date.now()) / 1000)
          );
          timeTakenSeconds = Math.max(0, total - remaining);
        }
      }
    }

    /* ================= TITLE RESOLUTION ================= */

    const resolvedMode: "pdf" | "prompt" =
      quizData.mode === "prompt" ? "prompt" : "pdf";

    let title: string;

    if (typeof quizData.title === "string" && quizData.title.trim().length > 0) {
      title = quizData.title.trim();
    } else if (resolvedMode === "pdf") {
      title = generatePdfTitle(quizData.pdfFiles);
    } else {
      title = generatePromptTitle(quizData.promptFull || "");
    }

    /* ================= SAVE ATTEMPT (DB ONLY) ================= */

    fetch("/api/quiz-attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        mode: resolvedMode,
        score: s,
        total: quizQuestions.length,
        data: {
          questions: quizQuestions,
          answers: userAnswers,
          timerSeconds,
          timeTakenSeconds,
          promptFull: quizData.promptFull ?? null,
          pdfFiles: quizData.pdfFiles ?? null,
        },
      }),
    }).catch(() => {
      // intentional no-op: UX must never break
    });
  }, [router]);

  /* ================= SCORE ANIMATION ================= */

  useEffect(() => {
    let raf: number;
    let current = 0;

    function animate() {
      current += Math.max(1, Math.ceil(score / 20));
      if (current >= score) {
        setAnimatedScore(score);
        return;
      }
      setAnimatedScore(current);
      raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  /* ================= FILTERED QUESTIONS ================= */

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const selected = answers[q.id];
      if (filter === "correct") return selected === q.correctAnswer;
      if (filter === "wrong")
        return selected !== undefined && selected !== q.correctAnswer;
      if (filter === "unanswered") return selected === undefined;
      return true;
    });
  }, [questions, answers, filter]);

  if (!questions.length) return null;


  /* ================= UI ================= */

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      {/* SCORE BLOCK */}
      <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Your Score
        </p>

        <p className="text-5xl font-semibold">
          {animatedScore} / {questions.length}
        </p>

        {/* Filters */}
        <div className="flex justify-center gap-2 pt-2">
          {[
            ["all", "All"],
            ["correct", "Correct"],
            ["wrong", "Wrong"],
            ["unanswered", "Unanswered"],
          ].map(([v, label]) => (
            <button
              key={v}
              onClick={() => setFilter(v as any)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                filter === v
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* QUESTIONS */}
      <div className="space-y-8">
        {filteredQuestions.map((q, idx) => {
          const selected = answers[q.id];

          return (
            <div key={q.id} className="rounded-xl border p-6 bg-background">
              <p className="font-medium mb-4">
                {idx + 1}. {q.question}
              </p>

              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const isCorrect = i === q.correctAnswer;
                  const isSelected = selected === i;

                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between rounded-lg px-4 py-2 border
                        ${
                          isCorrect
                            ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                            : isSelected && !isCorrect
                            ? "border-red-500 bg-red-50 dark:bg-red-900/30"
                            : ""
                        }`}
                    >
                      <span>{opt}</span>
                      {isCorrect && (
                        <CheckCircle size={18} className="text-green-500" />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle size={18} className="text-red-500" />
                      )}
                    </div>
                  );
                })}
              </div>

              {selected === undefined && (
                <p className="mt-3 text-sm text-yellow-500">
                  You did not answer this question
                </p>
              )}

              <button
                onClick={() =>
                  setOpen((p) => ({ ...p, [q.id]: !p[q.id] }))
                }
                className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {open[q.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {open[q.id] ? "Hide explanation" : "Show explanation"}
              </button>

              {open[q.id] && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* ACTION */}
      <div className="flex justify-center">
        <button
          onClick={() => router.push("/history")}
          className="px-6 py-2 rounded-lg border hover:bg-muted transition"
        >
          View History
        </button>
      </div>
    </main>
  );
}