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
        <DropdownMenuContent className="bg-white dark:bg-gray-900" align="end">
          <div className="flex items-center gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user.name && <p className="font-medium">{user.name}</p>}
              {user.email && (
                <p className="w-[200px] truncate text-sm text-zinc-700 dark:text-zinc-300">
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

              // 1) Sign out but don't let next-auth redirect automatically
              //    (redirect: false) ensures we stay on this client to show toast.
              await signOut({ redirect: false }).catch(console.error);

              // 2) Show a toast so the user sees feedback
              toast({
                title: "Signed out",
                description: "You have been logged out successfully.",
              });

              // 3) Wait a short moment so the toast is visible (300-800ms is usual).
              //    Adjust delay if you want the toast to appear longer before navigation.
              setTimeout(() => {
                // client-side navigate to homepage
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