"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { History } from "lucide-react";

const HistoryCard = () => {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push("/history")}
      className="
        relative cursor-pointer
        min-h-[160px]
        transition-all duration-200
        hover:-translate-y-1
        hover:shadow-xl
        bg-white/80
        dark:bg-neutral-900/90
        border border-slate-200 dark:border-white/10
        dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04)]
      "
    >
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <CardTitle className="text-2xl font-semibold">
          History
        </CardTitle>

        <div className="rounded-lg p-2 bg-slate-100 dark:bg-white/5">
          <History className="h-6 w-6 text-slate-700 dark:text-slate-200" />
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Review your previous quizzes, answers, and scores anytime.
        </p>
      </CardContent>
    </Card>
  );
};

export default HistoryCard;