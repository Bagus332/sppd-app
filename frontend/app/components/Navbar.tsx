"use client";

import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PersonIcon, ExitIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
      <div className="flex h-16 items-center px-6 justify-between">
        
        {/* Mobile Menu Trigger (Visible only on mobile) */}
        <div className="md:hidden">
            <Button variant="ghost" size="icon">
                <HamburgerMenuIcon className="h-5 w-5" />
            </Button>
        </div>

        {/* Title / Breadcrumb Area */}
        <div className="hidden md:flex items-center">
            <h2 className="text-lg font-semibold text-neutral-800">
                Selamat Datang, <span className="text-[#5c7a54]">{user?.username || 'Admin'}</span>
            </h2>
        </div>

        {/* Right Side: User Menu */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-neutral-100 rounded-full">
                <div className="w-8 h-8 rounded-full bg-[#5c7a54]/10 flex items-center justify-center text-[#5c7a54]">
                    <PersonIcon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-neutral-700 hidden sm:block">
                    {user?.username || "Account"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.username || "Administrator"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "admin@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <PersonIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                <ExitIcon className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
