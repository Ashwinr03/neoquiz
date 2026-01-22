"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const MAX_TITLE_LENGTH = 60;

export default function QuizPage() {
  const [mode, setMode] = useState<"pdf" | "prompt">("pdf");
  const [files, setFiles] = useState<File[]>([]);
  const [prompt, setPrompt] = useState("");
  const [focusPrompt, setFocusPrompt] = useState("");
  const [questions, setQuestions] = useState<number | "">(5);
  const [timer, setTimer] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const MAX_QUESTIONS = 15;
  const MIN_PROMPT_CHARS = 10;
  const MAX_FILE_SIZE_MB = 5;

  function handleFiles(selected: FileList | null) {
    if (!selected) return;

    const incoming = Array.from(selected);
    const merged = [...files, ...incoming];

    const totalSizeMB =
      merged.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024);

    if (totalSizeMB > MAX_FILE_SIZE_MB) {
      toast.error("Total PDF size must be under 5 MB");
      return;
    }

    setFiles(merged);
  }

  async function generateQuiz() {
    if (questions === "" || questions < 1) {
      toast.error("Minimum 1 question is required");
      return;
    }

    if (questions > MAX_QUESTIONS) {
      toast.error(`Maximum ${MAX_QUESTIONS} questions allowed`);
      return;
    }

    if (mode === "prompt" && prompt.trim().length < MIN_PROMPT_CHARS) {
      toast.error(`Prompt must be at least ${MIN_PROMPT_CHARS} characters`);
      return;
    }

    if (mode === "pdf" && files.length === 0) {
      toast.error("Please upload at least one PDF");
      return;
    }

    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append("mode", mode);
      formData.append("questionsCount", String(questions));
      formData.append("prompt", prompt);
      formData.append("focusPrompt", focusPrompt);

      if (mode === "pdf") {
        files.forEach((file) => {
          formData.append("files", file);
        });
      }

      const res = await fetch("/api/quiz", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate quiz");
      }

      // 🔒 CLEAR OLD QUIZ STATE
      sessionStorage.removeItem("quizAnswers");
      sessionStorage.removeItem("quizCurrentIndex");
      sessionStorage.removeItem("quizEndTime");

      // ✅ NORMALIZE MANUAL TITLE
      const normalizedManualTitle =
        quizTitle.trim().length > 0
          ? quizTitle
              .replace(/\s+/g, " ")
              .replace(/[\r\n]+/g, " ")
              .trim()
              .slice(0, MAX_TITLE_LENGTH)
          : undefined;

      /**
       * ✅ FINAL TITLE RESOLUTION
       *
       * PROMPT:
       *   manual > AI
       *
       * PDF:
       *   manual > PDF filenames (AI NEVER USED)
       */
      const finalTitle =
        normalizedManualTitle ||
        (mode === "prompt" &&
        typeof data.aiTitle === "string" &&
        data.aiTitle.trim().length > 0
          ? data.aiTitle.trim().slice(0, MAX_TITLE_LENGTH)
          : undefined);

      // ✅ CRITICAL FIX:
      // Store prompt for BOTH modes
      const resolvedPromptFull =
        mode === "prompt"
          ? prompt.trim()
          : focusPrompt.trim() || null;

      // ✅ STORE QUIZ DATA
      sessionStorage.setItem(
        "quizData",
        JSON.stringify({
          ...data,
          mode,
          title: finalTitle,
          questionCount: questions,
          timerSeconds:
            timer.trim() !== ""
              ? Math.min(Number(timer) * 60, 3600)
              : null,
          promptFull: resolvedPromptFull,
          pdfFiles:
            mode === "pdf"
              ? files.map((f) => ({ name: f.name }))
              : [],
          focusPrompt: focusPrompt.trim() || null,
        })
      );

      sessionStorage.setItem(
        "quizTimer",
        JSON.stringify(
          timer.trim() !== ""
            ? Math.min(Number(timer) * 60, 3600)
            : null
        )
      );

      window.location.href = "/quiz/play";
    } catch (err: any) {
      toast.error(
        err.message || "Something went wrong while generating the quiz"
      );
      setIsGenerating(false);
    }
  }

  return (
    <>
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-2xl bg-background px-10 py-8 shadow-2xl text-center w-[320px]">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-cyan-400" />
            <h2 className="text-lg font-semibold">Generating quiz</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This may take a few seconds
            </p>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto p-8 space-y-8">
        <h1 className="text-3xl font-bold text-center">Create Quiz</h1>

        <div className="flex justify-center gap-4">
          <Button
            variant={mode === "pdf" ? "default" : "outline"}
            onClick={() => setMode("pdf")}
          >
            Use PDF
          </Button>
          <Button
            variant={mode === "prompt" ? "default" : "outline"}
            onClick={() => setMode("prompt")}
          >
            Use Prompt
          </Button>
        </div>

        {mode === "pdf" && (
          <div className="space-y-4">
            <label
              htmlFor="pdf"
              className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 cursor-pointer"
            >
              <input
                id="pdf"
                type="file"
                accept=".pdf"
                multiple
                hidden
                onChange={(e) => handleFiles(e.target.files)}
              />
              <p className="text-sm">Drag & drop PDFs or click to upload</p>
              <p className="text-xs text-muted-foreground">
                Multiple PDFs allowed • Total size ≤ 5 MB
              </p>
              {files.length > 0 && (
                <p className="text-xs font-medium">
                  {files.length} file(s) selected
                </p>
              )}
            </label>

            {files.length > 0 && (
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                {files.map((file, i) => (
                  <li key={i}>{file.name}</li>
                ))}
              </ul>
            )}

            <Textarea
              placeholder="Optional focus instructions (from PDF)"
              value={focusPrompt}
              onChange={(e) => setFocusPrompt(e.target.value)}
            />
          </div>
        )}

        {mode === "prompt" && (
          <div className="space-y-2">
            <Textarea
              placeholder="Enter a detailed prompt for quiz generation"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            {prompt.length < MIN_PROMPT_CHARS && (
              <p className="text-xs text-muted-foreground">
                {prompt.length}/{MIN_PROMPT_CHARS} characters minimum
              </p>
            )}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Number of questions (1–15)
            </label>
            <Input
              type="number"
              min={1}
              max={MAX_QUESTIONS}
              value={questions}
              onChange={(e) =>
                setQuestions(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              Timer (minutes, optional)
            </label>
            <Input
              type="number"
              min={0}
              max={60}
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">
            Quiz title (optional)
          </label>
          <Input
            placeholder="e.g. Marvel Movies Quiz"
            maxLength={MAX_TITLE_LENGTH}
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {quizTitle.length}/{MAX_TITLE_LENGTH} characters maximum
          </p>
        </div>

        <Button
          className="w-full"
          onClick={generateQuiz}
          disabled={isGenerating}
        >
          Generate Quiz
        </Button>
      </main>
    </>
  );
}