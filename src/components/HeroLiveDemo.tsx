"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

type Step =
  | "idle"
  | "drag"
  | "parsing"
  | "question"
  | "calculating"
  | "result";

export default function HeroLiveDemo() {
  const [step, setStep] = useState<Step>("idle");
  const [hasPlayed, setHasPlayed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const startDemo = () => {
    if (hasPlayed) return;
    setHasPlayed(true);
    setStep("drag");
    setTimeout(() => setStep("parsing"), 2200);
    setTimeout(() => setStep("question"), 4200);
  };

  const answer = (value: string) => {
    if (selected) return;
    setSelected(value);

    setTimeout(() => {
      setStep("calculating");

      setTimeout(() => {
        const finalScore = value === "Stack" ? 1 : 0;
        setScore(finalScore);
        setStep("result");

        if (finalScore === 1) {
          confetti({
            particleCount: 40,
            spread: 50,
            ticks: 90,
            scalar: 0.9,
            gravity: 0.6,
            origin: { y: 0.6 },
          });
        }
      }, 1400);
    }, 500);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={startDemo}
      suppressHydrationWarning
      className="
        relative w-full max-w-[520px] mx-auto
        rounded-2xl p-6 md:p-8
        bg-white/90 dark:bg-neutral-900/90
        border border-slate-200 dark:border-white/10
        shadow-lg
        dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_16px_40px_rgba(0,0,0,0.7)]
      "
    >
      <AnimatePresence mode="wait">
        {step === "idle" && (
          <motion.div
            key="idle"
            className="h-32 flex items-center justify-center"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Hover to see how it works
            </p>
          </motion.div>
        )}

        {step === "drag" && (
          <motion.div
            key="drag"
            className="relative h-44 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: 180 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="absolute left-4 flex flex-col items-center gap-1"
            >
              <div className="w-14 h-16 rounded-md bg-red-600 text-white flex items-center justify-center font-bold text-sm shadow">
                PDF
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                dsa.pdf
              </span>
            </motion.div>

            <motion.img
              src="/cursor.png"
              alt="cursor"
              initial={{ x: -8, y: 8 }}
              animate={{ x: 172, y: 24 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="absolute left-4 w-8 pointer-events-none"
            />

            <div className="ml-28 w-full h-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex items-center justify-center">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Drop your pdf here
              </span>
            </div>
          </motion.div>
        )}

        {step === "parsing" && (
          <motion.div
            key="parsing"
            className="h-32 flex flex-col items-center justify-center gap-4"
          >
            <div className="h-6 w-6 rounded-full border-2 border-slate-300 border-t-slate-700 dark:border-t-white animate-spin" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Parsing through your document…
            </p>
          </motion.div>
        )}

        {step === "question" && (
          <motion.div
            key="question"
            className="space-y-4"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Which data structure works on a LIFO principle?
            </p>

            {["Queue", "Stack", "Array", "Linked List"].map((opt) => {
              const isCorrect = opt === "Stack";
              const isSelected = selected === opt;

              return (
                <button
                  key={opt}
                  onClick={() => answer(opt)}
                  className={`w-full text-left px-4 py-2 rounded-lg border transition ${
                    selected
                      ? isCorrect
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                        : isSelected
                        ? "border-red-400 bg-red-50 dark:bg-red-900/30"
                        : "border-slate-200 dark:border-white/10"
                      : "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </motion.div>
        )}

        {step === "calculating" && (
          <motion.div
            key="calculating"
            className="h-32 flex flex-col items-center justify-center gap-4"
          >
            <div className="h-6 w-6 rounded-full border-2 border-slate-300 border-t-slate-700 dark:border-t-white animate-spin" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Calculating your score…
            </p>
          </motion.div>
        )}

        {step === "result" && (
          <motion.div
            key="result"
            className="h-32 flex flex-col items-center justify-center gap-3 text-center"
          >
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              Score: {score} / 1
            </p>

            {score === 1 ? (
              <p className="text-sm text-emerald-600">
                Perfect score. Strong fundamentals.
              </p>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                A quick revision will help sharpen this.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}