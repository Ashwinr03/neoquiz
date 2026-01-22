import SignInButton from "@/components/SignInButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";
import HeroLiveDemo from "@/components/HeroLiveDemo";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { Zap, Sliders, BarChart3, Sparkles } from "lucide-react";

export default async function Home() {
  const session = await getAuthSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  // ✅ FINAL FIX: non-breaking space between structured & learning
  const typewriterWords = [
    { text: "PDFs" },
    { text: " and " },
    { text: "notes" },
    { text: " into " },
    {
      text: "structured\u00A0learning",
      className: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <main className="relative min-h-screen bg-transparent">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">

          {/* LEFT SECTION */}
          <div className="w-full lg:w-1/2">
            <div className="max-w-xl">

              {/* HEADLINE */}
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
                Create quizzes in seconds
                <span className="block mt-2 text-slate-700 dark:text-slate-300 font-semibold">
                  powered by AI that turns{" "}
                  <span className="inline-block">
                    <TypewriterEffect
                      words={typewriterWords}
                      className="inline"
                      cursorClassName="bg-blue-600 dark:bg-blue-400"
                    />
                  </span>
                </span>
              </h1>

              {/* SUBTEXT */}
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
                NeoQuiz helps you convert study material into clear,
                answer-driven multiple-choice quizzes — so you learn with intent,
                not guesswork.
              </p>

              {/* FEATURES */}
              <ul className="mt-8 space-y-6">
                <li className="flex items-start gap-4">
                  <Zap className="h-5 w-5 mt-1 text-slate-500" />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      Generate instantly
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Upload a PDF or describe a topic — quizzes are ready in seconds.
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <Sliders className="h-5 w-5 mt-1 text-slate-500" />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      Full control
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Choose difficulty, number of questions, and explanations.
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <BarChart3 className="h-5 w-5 mt-1 text-slate-500" />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      Track understanding
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Review attempts and performance anytime from your dashboard.
                    </div>
                  </div>
                </li>
              </ul>

              {/* SIGN-IN CARD */}
              <div className="mt-10">
                <Card
                  className="
                    bg-white/90 dark:bg-neutral-900/90
                    border border-slate-200 dark:border-white/10
                    shadow-lg
                  "
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-slate-500" />
                      <CardTitle className="text-base font-semibold">
                        Get started with NeoQuiz
                      </CardTitle>
                    </div>

                    <CardDescription className="text-sm">
                      Sign in to generate quizzes, attempt them, and track your learning.
                    </CardDescription>

                    <div className="mt-5">
                      <SignInButton text="Continue with Google" />
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <HeroLiveDemo />
          </div>

        </div>
      </div>
    </main>
  );
}