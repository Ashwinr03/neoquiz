import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen px-8 py-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Welcome, {session.user.name ?? session.user.email}
      </p>
    </main>
  );
}