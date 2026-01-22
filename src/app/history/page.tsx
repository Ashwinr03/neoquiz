"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HistoryItem } from "@/lib/quizHistory";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  SlidersHorizontal,
  Calendar,
  Trash2,
  CheckSquare,
  Square,
} from "lucide-react";

/* ======================================================
   TITLE
====================================================== */
function getTitle(h: HistoryItem) {
  if (typeof h.title === "string" && h.title.trim().length > 0) {
    return h.title;
  }
  return h.mode === "prompt" ? "Prompt Based Quiz" : "PDF Based Quiz";
}

/* ======================================================
   METHOD DERIVATION
====================================================== */
type MethodType = "prompt" | "pdf" | "pdf+prompt";

function deriveMethod(h: HistoryItem): MethodType {
  const hasPrompt =
    h.mode === "pdf" &&
    typeof h === "object" &&
    h !== null &&
    "promptFull" in h &&
    Boolean((h as any).promptFull);

  if (hasPrompt) return "pdf+prompt";
  return h.mode === "prompt" ? "prompt" : "pdf";
}

/* ======================================================
   PAGE
====================================================== */
export default function QuizHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  /* ---------------- SEARCH ---------------- */
  const [query, setQuery] = useState("");

  /* ---------------- FILTERS ---------------- */
  const [methodFilters, setMethodFilters] = useState<Set<MethodType>>(new Set());
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "score">("newest");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [draftMethods, setDraftMethods] = useState<Set<MethodType>>(new Set());
  const [draftSortBy, setDraftSortBy] = useState(sortBy);
  const [draftFromDate, setDraftFromDate] = useState(fromDate);
  const [draftToDate, setDraftToDate] = useState(toDate);
  const [filterOpen, setFilterOpen] = useState(false);

  /* ---------------- SELECTION ---------------- */
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  /* ---------------- DELETE DIALOG ---------------- */
  const [confirmOpen, setConfirmOpen] = useState(false);

  /* ---------------- DATE REFS ---------------- */
  const fromDateRef = useRef<HTMLInputElement>(null);
  const toDateRef = useRef<HTMLInputElement>(null);

  /* ================== 🔁 LOAD FROM DB (REPLACED) ================== */
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/quiz-attempt");
      if (!res.ok) return;
      const data: HistoryItem[] = await res.json();
      setHistory(data);
    })();
  }, []);

  /* ---------------- ACTIVE FILTER COUNT ---------------- */
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (methodFilters.size > 0) count++;
    if (sortBy !== "newest") count++;
    if (fromDate || toDate) count++;
    return count;
  }, [methodFilters, sortBy, fromDate, toDate]);

  /* ---------------- FILTERED LIST ---------------- */
  const filtered = useMemo(() => {
    let list = [...history];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((h) => getTitle(h).toLowerCase().includes(q));
    }

    if (methodFilters.size > 0) {
      list = list.filter((h) => methodFilters.has(deriveMethod(h)));
    }

    if (fromDate) {
      const from = new Date(fromDate).getTime();
      list = list.filter((h) => h.createdAt >= from);
    }
    if (toDate) {
      const to = new Date(toDate).getTime();
      list = list.filter((h) => h.createdAt <= to);
    }

    if (sortBy === "newest") {
      list.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === "oldest") {
      list.sort((a, b) => a.createdAt - b.createdAt);
    } else {
      list.sort((a, b) => b.score / b.total - a.score / a.total);
    }

    return list;
  }, [history, query, methodFilters, sortBy, fromDate, toDate]);

  /* ---------------- HELPERS ---------------- */
  function toggleMethod(value: MethodType) {
    setDraftMethods((prev) => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((h) => h.id)));
    }
  }

  /* ================== 🗑 DELETE FROM DB (REPLACED) ================== */
  async function deleteSelected() {
    await fetch("/api/quiz-attempt", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selectedIds) }),
    });

    setHistory((prev) => prev.filter((h) => !selectedIds.has(h.id)));
    setSelectedIds(new Set());
    setConfirmOpen(false);
  }

  const hasSelection = selectedIds.size > 0;



  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quiz History</h1>
          <p className="text-muted-foreground">
            Your previously completed quizzes
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quizzes..."
              className="pl-9 w-[260px]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* FILTER */}
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => setFilterOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* DELETE */}
          <Button
            variant="outline"
            size="icon"
            disabled={!hasSelection}
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2
              className={`h-4 w-4 ${
                hasSelection ? "text-red-500" : "text-muted-foreground"
              }`}
            />
          </Button>

          {/* SELECT ALL */}
          <Button variant="outline" size="sm" onClick={toggleSelectAll}>
            {selectedIds.size === filtered.length ? "Clear All" : "Select All"}
          </Button>
        </div>
      </div>

      {/* FILTER DIALOG (FULLY RESTORED) */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>

          {/* Method */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Method</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["prompt", "Prompt"],
                ["pdf", "PDF"],
                ["pdf+prompt", "PDF + Prompt"],
              ].map(([v, label]) => (
                <Button
                  key={v}
                  variant={
                    draftMethods.has(v as MethodType)
                      ? "default"
                      : "outline"
                  }
                  onClick={() => toggleMethod(v as MethodType)}
                >
                  {label}
                </Button>
              ))}
              <Button
                variant={draftMethods.size === 0 ? "default" : "outline"}
                onClick={() => setDraftMethods(new Set())}
              >
                All
              </Button>
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-2 mt-4">
            <p className="text-sm font-medium">Sort By</p>
            <div className="grid grid-cols-3 gap-2">
              {["newest", "oldest", "score"].map((v) => (
                <Button
                  key={v}
                  variant={draftSortBy === v ? "default" : "outline"}
                  onClick={() => setDraftSortBy(v as any)}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2 mt-4">
            <p className="text-sm font-medium">Date Range</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Input
                  ref={fromDateRef}
                  type="date"
                  value={draftFromDate}
                  onChange={(e) => setDraftFromDate(e.target.value)}
                  className="pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
                <button
                  type="button"
                  onClick={() => fromDateRef.current?.showPicker()}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Calendar className="h-4 w-4" />
                </button>
              </div>

              <div className="relative">
                <Input
                  ref={toDateRef}
                  type="date"
                  value={draftToDate}
                  onChange={(e) => setDraftToDate(e.target.value)}
                  className="pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
                <button
                  type="button"
                  onClick={() => toDateRef.current?.showPicker()}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Calendar className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-6">
            <button
              className="text-sm underline text-muted-foreground"
              onClick={() => {
                setDraftMethods(new Set());
                setDraftSortBy("newest");
                setDraftFromDate("");
                setDraftToDate("");
              }}
            >
              Clear Filters
            </button>

            <Button
              onClick={() => {
                setMethodFilters(new Set(draftMethods));
                setSortBy(draftSortBy);
                setFromDate(draftFromDate);
                setToDate(draftToDate);
                setFilterOpen(false);
              }}
            >
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* LIST */}
{filtered.length === 0 ? (
  <div className="mt-20 text-center text-muted-foreground">
    <p className="text-lg font-medium">
      No quiz attempts yet
    </p>
    <p className="mt-2 text-sm">
      Attempt quizzes to view your history
    </p>
    <Button
      className="mt-6"
      onClick={() => router.push("/quiz")}
    >
      Create a Quiz
    </Button>
  </div>
) : (
  <div className="space-y-4">
    {filtered.map((h) => {
      const selected = selectedIds.has(h.id);

      return (
        <div
          key={h.id}
          className={`flex gap-4 rounded-xl border p-5 ${
            selected ? "bg-muted" : "hover:bg-muted"
          }`}
        >
          <button onClick={() => toggleSelect(h.id)}>
            {selected ? (
              <CheckSquare className="h-5 w-5 text-primary" />
            ) : (
              <Square className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          <div
            className="flex-1 flex justify-between cursor-pointer"
            onClick={() => {
              if (!hasSelection) router.push(`/history/${h.id}`);
            }}
          >
            <div>
              <p className="font-medium">{getTitle(h)}</p>
              <p className="text-sm text-muted-foreground">
                {deriveMethod(h).replace("+", " + ").toUpperCase()} •{" "}
                {h.total} questions
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(h.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="font-semibold">
              {h.score}/{h.total}
            </div>
          </div>
        </div>
      );
    })}
  </div>
)}

      {/* DELETE CONFIRM */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete selected attempts?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteSelected}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
