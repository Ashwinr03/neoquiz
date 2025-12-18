"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import SignInButton from "./SignInButton";
import UserAccountNav from "./UserAccountNav";
import { ThemeToggle } from "./ThemeToggle";

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const user = session?.user ?? null;

  return (
    <div className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300 py-2">
      <div className="flex items-center justify-between h-full gap-2 px-8 max-w-[100%] mx-auto">
        <Link href="/" aria-label="NeoQuiz home" className="flex items-center gap-2">
          <p className="px-4 py-1 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/20 shadow-[0_2px_6px_rgba(0,0,0,0.15)] text-xl font-semibold text-gray-900 dark:text-gray-100">
            NeoQuiz
          </p>
        </Link>

        <div className="flex items-center">
          <ThemeToggle className="mr-3" />
          <div className="flex items-center">
            {user ? (
              <UserAccountNav user={user as any} />
            ) : (
              <SignInButton text="Sign In" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;