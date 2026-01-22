// src/lib/quizHistory.ts

export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export type HistoryItem = {
  id: string;
  createdAt: number;
  mode: "pdf" | "prompt";
  score: number;
  total: number;
  questions: Question[];
  answers: Record<number, number>;

  /**
   * ✅ OPTIONAL (BACKWARD COMPATIBLE)
   */
  title?: string;

  /**
   * ✅ OPTIONAL METADATA (USED BY DETAIL PAGE)
   */
  timerSeconds?: number | null;
  timeTakenSeconds?: number | null;
  promptFull?: string | null;
  pdfFiles?: { name: string }[] | null;
};

const STORAGE_KEY = "quizHistory";

/* ----------------------------------
   INTERNAL: MAP DB → UI SHAPE
---------------------------------- */
function mapDbAttemptToHistoryItem(db: any): HistoryItem {
  const data = db.data ?? {};

  return {
    id: db.id,
    createdAt: new Date(db.createdAt).getTime(),
    mode: db.mode === "prompt" ? "prompt" : "pdf",
    title: typeof db.title === "string" ? db.title : undefined,
    score: Number(db.score) || 0,
    total: Number(db.total) || 0,

    // 🔑 unpack JSON payload
    questions: Array.isArray(data.questions) ? data.questions : [],
    answers:
      typeof data.answers === "object" && data.answers !== null
        ? data.answers
        : {},

    timerSeconds:
      typeof data.timerSeconds === "number" ? data.timerSeconds : null,

    timeTakenSeconds:
      typeof data.timeTakenSeconds === "number"
        ? data.timeTakenSeconds
        : null,

    promptFull:
      typeof data.promptFull === "string" ? data.promptFull : null,

    pdfFiles: Array.isArray(data.pdfFiles) ? data.pdfFiles : null,
  };
}

/* ----------------------------------
   READ + CLEAN HISTORY (DB → CACHE)
---------------------------------- */
export function getCleanHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];

  // ⚡ fast path: cached
  const cached = sessionStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached) as HistoryItem[];
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  // ⏳ async fetch, sync-safe fallback
  fetch("/api/quiz-attempt")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch quiz history");
      return res.json();
    })
    .then((rows) => {
      if (!Array.isArray(rows)) return;

      const mapped = rows.map(mapDbAttemptToHistoryItem);

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
    })
    .catch(() => {
      // silent fail → UI already handles empty state
    });

  return [];
}

/* ----------------------------------
   ADD HISTORY ENTRY (NO-OP NOW)
   DB IS SOURCE OF TRUTH
---------------------------------- */
export function addHistoryEntry(_: HistoryItem) {
  // intentionally empty
}

/* ----------------------------------
   GET SINGLE ATTEMPT
---------------------------------- */
export function getAttemptById(id: string): HistoryItem | null {
  const history = getCleanHistory();
  return history.find((h) => h.id === id) || null;
}

/* ----------------------------------
   CLEAR HISTORY (LOCAL CACHE ONLY)
---------------------------------- */
export function clearHistory() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}