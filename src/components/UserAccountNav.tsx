"use client";

import { User } from "next-auth";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type Props = {
  user: Pick<User, "name" | "image" | "email">;
};

const UserAccountNav = ({ user }: Props) => {
  const router = useRouter();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <UserAvatar
          className="w-10 h-10"
          user={{
            name: user.name || null,
            image: user.image || null,
          }}
        />
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
          align="end"
          className="
            bg-white dark:bg-black
            border border-slate-200 dark:border-white/10
            shadow-lg
          "
        >
          <div className="flex items-center gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user.name && (
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {user.name}
                </p>
              )}
              {user.email && (
                <p className="w-[200px] truncate text-sm text-slate-600 dark:text-slate-400">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/">Profile</Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={async (event) => {
              event.preventDefault();

              await signOut({ redirect: false }).catch(console.error);

              toast({
                title: "Signed out",
                description: "You have been logged out successfully.",
              });

              setTimeout(() => {
                router.push("/");
              }, 600);
            }}
            className="text-red-600 cursor-pointer"
          >
            Sign out
            <LogOut className="w-4 h-4 ml-2" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

export default UserAccountNav;