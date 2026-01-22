"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
};

export default function QuizPlayPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const submittedRef = useRef(false);

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    const quizRaw = sessionStorage.getItem("quizData");
    if (!quizRaw) {
      router.replace("/quiz");
      return;
    }

    const parsed = JSON.parse(quizRaw);
    const loadedQuestions: Question[] = parsed.questions || [];
    setQuestions(loadedQuestions);

    const storedAnswers = sessionStorage.getItem("quizAnswers");
    setAnswers(storedAnswers ? JSON.parse(storedAnswers) : {});

    let idx = Number(sessionStorage.getItem("quizCurrentIndex") || 0);
    if (idx < 0) idx = 0;
    if (idx >= loadedQuestions.length) idx = loadedQuestions.length - 1;
    setCurrentIndex(idx);

    const rawTimer = sessionStorage.getItem("quizTimer");
    if (!rawTimer || rawTimer === "null") return;

    const totalSeconds = Number(JSON.parse(rawTimer));
    if (!totalSeconds) return;

    let endTime = Number(sessionStorage.getItem("quizEndTime"));
    if (!endTime) {
      endTime = Date.now() + totalSeconds * 1000;
      sessionStorage.setItem("quizEndTime", String(endTime));
    }

    const tick = () => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0 && !submittedRef.current) {
        submitQuiz();
      }
    };

    tick();
    timerRef.current = setInterval(tick, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [router]);

  /* ---------------- DISABLE COPY ---------------- */
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("selectstart", prevent);

    return () => {
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("selectstart", prevent);
    };
  }, []);

  /* ---------------- HANDLERS ---------------- */
  function selectOption(optionIndex: number) {
    if (!questions) return;
    const q = questions[currentIndex];
    if (!q) return;

    const updated = { ...answers, [q.id]: optionIndex };
    setAnswers(updated);

    // ✅ SOURCE OF TRUTH
    sessionStorage.setItem("quizAnswers", JSON.stringify(updated));
  }

  function nextQuestion() {
    if (!questions) return;

    if (currentIndex + 1 < questions.length) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      sessionStorage.setItem("quizCurrentIndex", String(next));
    } else {
      submitQuiz();
    }
  }

  function prevQuestion() {
    if (currentIndex > 0) {
      const prev = currentIndex - 1;
      setCurrentIndex(prev);
      sessionStorage.setItem("quizCurrentIndex", String(prev));
    }
  }

  function submitQuiz() {
    if (submittedRef.current) return;
    submittedRef.current = true;

    // ✅ READ FINAL ANSWERS FROM STORAGE (NOT STATE)
    const finalAnswers =
      sessionStorage.getItem("quizAnswers") || "{}";
    sessionStorage.setItem("quizAnswers", finalAnswers);

    router.replace("/quiz/result");
  }

  /* ---------------- SAFE RENDER ---------------- */
  if (!questions) {
    return (
      <main className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">Loading quiz…</p>
      </main>
    );
  }

  const current = questions[currentIndex];
  if (!current) return null;

  const selected = answers[current.id];
  const progressPercent = Math.round(
    (Object.keys(answers).length / questions.length) * 100
  );

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </div>

        {timeLeft !== null && (
          <div className="font-semibold">
            {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
            {String(timeLeft % 60).padStart(2, "0")}
          </div>
        )}
      </div>

      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-cyan-500 transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="rounded-xl border p-6 space-y-4">
        <p className="font-medium text-lg">{current.question}</p>

        {current.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => selectOption(i)}
            className={`w-full text-left px-4 py-3 rounded-lg border transition ${
              selected === i
                ? "border-cyan-500 bg-cyan-500/10"
                : "hover:bg-muted"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevQuestion} disabled={currentIndex === 0}>
          Previous
        </Button>
        <Button onClick={nextQuestion}>
          {currentIndex === questions.length - 1 ? "Submit" : "Next"}
        </Button>
      </div>
    </main>
  );
}