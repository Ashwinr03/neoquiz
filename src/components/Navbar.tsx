"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import SignInButton from "./SignInButton";
import UserAccountNav from "./UserAccountNav";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user ?? null;

  return (
    <div className="fixed inset-x-0 top-0 z-20 border-b border-zinc-300 dark:border-white/10 bg-white/80 dark:bg-black/70 backdrop-blur">
      <div className="flex items-center justify-between px-8 py-2">
        <Link href="/" aria-label="NeoQuiz home" className="flex items-center gap-2">
          <p className="px-4 py-1 rounded-xl bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/20 shadow text-xl font-semibold text-gray-900 dark:text-gray-100">
            NeoQuiz
          </p>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? <UserAccountNav user={user as any} /> : <SignInButton text="Sign In" />}
        </div>
      </div>
    </div>
  );
}