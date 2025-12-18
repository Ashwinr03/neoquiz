import SignInButton from "@/components/SignInButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";

export default async function Home() {
  const session = await getAuthSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-white via-sky-50 to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">

          {/* LEFT SECTION */}
          <div className="w-full lg:w-1/2">
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight drop-shadow-sm">
                Create quizzes in seconds — powered by AI ⚡
              </h1>

              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                NeoQuiz turns any topic into multiple-choice quizzes with answers,
                explanations and customization — all in one click.
              </p>

              {/* Feature bullets */}
              <ul className="mt-6 grid gap-3">

                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1 inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700">
                    ✓
                  </span>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      Instant quiz generation
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Convert text or topics into complete quizzes instantly.
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1 inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700">
                    ⚡
                  </span>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      Custom difficulty & options
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Change number of questions, explanation depth & more.
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1 inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700">
                    📦
                  </span>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      Save quizzes for later
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Access your quiz history anytime in your dashboard.
                    </div>
                  </div>
                </li>

              </ul>

              {/* Card CTA */}
              <div className="mt-8">
                <Card className="bg-white/70 backdrop-blur-sm border border-slate-200 dark:bg-white/5 dark:border-slate-700 shadow-md w-full max-w-sm">
                  <CardContent className="p-6">
                    <div className="mb-2">
                      <CardTitle className="text-base">Welcome to NeoQuiz 🔥</CardTitle>
                      <CardDescription className="text-sm">
                        Sign in to start generating quizzes instantly.
                      </CardDescription>
                    </div>

                    <div className="mt-4">
                      <SignInButton text="Sign in with Google" />
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
  <div className="w-[380px] h-[260px] md:w-[480px] md:h-[320px] relative">
    {/* decorative gradient blob — stronger in light, subtle in dark */}
    <div className="absolute inset-0 rounded-xl
      bg-gradient-to-tr from-purple-300/40 via-cyan-200/30 to-rose-200/30
      dark:from-purple-900/30 dark:via-cyan-800/20 dark:to-slate-800/30
      blur-3xl opacity-80 pointer-events-none"></div>

    {/* actual card — stronger light background & border for visibility */}
    <div className="relative rounded-xl p-6
      bg-white/85 border border-slate-200 shadow-md
      dark:bg-white/6 dark:border-white/20 dark:shadow-[0_8px_30px_rgba(2,6,23,0.7)]">
      <p className="text-center text-slate-900 dark:text-slate-100 text-xl font-semibold">
        AI Quiz Engine
      </p>
      <p className="mt-3 text-slate-700 dark:text-slate-300 text-sm text-center">
        Your smart assistant for creating beautifully structured quizzes.
      </p>

      <div className="mt-4 h-2 bg-slate-200 rounded-full dark:bg-slate-700/40"></div>
      <div className="mt-2 h-2 bg-slate-200 rounded-full w-2/3 dark:bg-slate-700/30"></div>
      <div className="mt-2 h-2 bg-slate-200 rounded-full w-1/2 dark:bg-slate-700/20"></div>
    </div>
  </div>
</div>

        </div>
      </div>
    </main>
  );
}