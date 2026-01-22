"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

/* ================= HELPERS ================= */

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

/* ================= PAGE ================= */

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [entry, setEntry] = useState<HistoryItem | null>(null);
  const [progress, setProgress] = useState(0);

  /* ================= LOAD FROM DB ================= */

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/quiz-attempt?id=${id}`);
        if (!res.ok) {
          router.replace("/history");
          return;
        }

        const json = await res.json();
        const row = Array.isArray(json) ? json[0] : json;
        if (!row) {
          router.replace("/history");
          return;
        }

        const data = row.data || {};

        const mapped: HistoryItem = {
          id: row.id,
          createdAt: new Date(row.createdAt).getTime(),
          mode: row.mode === "pdf" ? "pdf" : "prompt",
          title: row.title,
          score: Number(row.score),
          total: Number(row.total),
          questions: Array.isArray(data.questions) ? data.questions : [],
          answers: typeof data.answers === "object" ? data.answers : {},
          timerSeconds:
            typeof data.timerSeconds === "number"
              ? data.timerSeconds
              : null,
          timeTakenSeconds:
            typeof data.timeTakenSeconds === "number"
              ? data.timeTakenSeconds
              : null,
          promptFull:
            typeof data.promptFull === "string" ? data.promptFull : null,
          pdfFiles: Array.isArray(data.pdfFiles) ? data.pdfFiles : null,
        };

        setEntry(mapped);
      } catch {
        router.replace("/history");
      }
    }

    load();
  }, [id, router]);

  useEffect(() => {
    if (!entry) return;
    requestAnimationFrame(() => setProgress(1));
  }, [entry]);

  if (!entry) return null;

  /* ================= DERIVED ================= */

  const percentage =
    entry.total > 0 ? Math.round((entry.score / entry.total) * 100) : 0;

  const answeredCount = Object.keys(entry.answers).length;
  const correctCount = entry.score;
  const wrongCount = answeredCount - correctCount;
  const unansweredCount = entry.total - answeredCount;

  const hasTimer =
    typeof entry.timerSeconds === "number" && entry.timerSeconds > 0;

  const timeInfo = hasTimer
    ? `${formatTime(entry.timeTakenSeconds ?? 0)} / ${formatTime(
        entry.timerSeconds!
      )}`
    : "No timer set";

  const methodLabel =
    entry.mode === "pdf" && entry.promptFull
      ? "PDF + Prompt"
      : entry.mode.toUpperCase();

  /* ================= UI (UNTOUCHED) ================= */

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-semibold">{entry.title}</h1>
        <p className="text-sm text-muted-foreground">Attempt Details</p>
      </div>

      {/* Score */}
      <div className="text-center space-y-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Score
        </p>

        <p className="text-4xl font-semibold">
          {entry.score} / {entry.total} ({percentage}%)
        </p>

        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
          <div
            className="bg-green-500 transition-all duration-700 ease-out"
            style={{
              width: `${(correctCount / entry.total) * 100 * progress}%`,
            }}
          />
          <div
            className="bg-red-500 transition-all duration-700 ease-out"
            style={{
              width: `${(wrongCount / entry.total) * 100 * progress}%`,
            }}
          />
          <div
            className="bg-muted-foreground/40 transition-all duration-700 ease-out"
            style={{
              width: `${(unansweredCount / entry.total) * 100 * progress}%`,
            }}
          />
        </div>

        <div className="flex justify-center gap-6 pt-2 text-sm">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Correct: {correctCount}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Wrong: {wrongCount}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
            Unanswered: {unansweredCount}
          </span>
        </div>
      </div>

      {/* Metadata */}
      <div className="rounded-xl border bg-background p-6 space-y-4">
        <Row label="Attempt Date">
          {new Date(entry.createdAt).toLocaleString()}
        </Row>
        <Row label="Time Taken">{timeInfo}</Row>
        <Row label="Questions">{entry.total}</Row>

        <Row label="Method">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary">{methodLabel}</Badge>

            {entry.promptFull && (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-xs underline text-muted-foreground hover:text-foreground">
                    View Prompt
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Prompt Used</DialogTitle>
                  </DialogHeader>
                  <div className="mt-2 max-h-[300px] overflow-auto rounded-md border p-3 text-sm whitespace-pre-wrap">
                    {entry.promptFull}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(entry.promptFull!);
                        toast.success("Prompt copied");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {Array.isArray(entry.pdfFiles) && entry.pdfFiles.length > 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-xs underline text-muted-foreground hover:text-foreground">
                    View PDFs
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>PDF Files</DialogTitle>
                  </DialogHeader>
                  <ul className="mt-2 space-y-1 text-sm">
                    {entry.pdfFiles.map((f, i) => (
                      <li key={i}>{f.name}</li>
                    ))}
                  </ul>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </Row>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => {
            sessionStorage.setItem(
              "quizData",
              JSON.stringify({
                questions: entry.questions,
                mode: entry.mode,
                title: entry.title,
                __fromHistory: true,
              })
            );
            sessionStorage.setItem(
              "quizAnswers",
              JSON.stringify(entry.answers)
            );
            router.push("/quiz/result");
          }}
        >
          View Answers
        </Button>

        <Button variant="outline" onClick={() => router.push("/history")}>
          Back to History
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Attempt ID: {entry.id}
      </p>
    </main>
  );
}

/* ================= ROW ================= */

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  );
}