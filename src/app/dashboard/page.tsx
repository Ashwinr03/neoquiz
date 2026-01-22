import CreateQuizCard from "@/components/dashboard/CreateQuizCard";
import HistoryCard from "@/components/dashboard/HistoryCard";

export const metadata = {
  title: "Dashboard | NeoQuiz",
  description: "Create and review AI-generated quizzes",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Dashboard
        </h2>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Create new quizzes or revisit your previous attempts.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        <CreateQuizCard />
        <HistoryCard />
      </div>
    </main>
  );
}