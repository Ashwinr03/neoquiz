"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

const CreateQuizCard = () => {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push("/quiz")}
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
          Create Quiz
        </CardTitle>

        <div className="rounded-lg p-2 bg-slate-100 dark:bg-white/5">
          <Sparkles className="h-6 w-6 text-slate-700 dark:text-slate-200" />
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Generate a quiz instantly from any topic or document using AI.
        </p>
      </CardContent>
    </Card>
  );
};

export default CreateQuizCard;