"use client";

import React, { useState, useEffect, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { cx } from "@/utils/cx";
import {
  Home,
  Search,
  MenuIcon,
  X,
  ChevronLeft,
  icons,
  Text,
  Notebook,
  WeightTildeIcon,
  CircuitBoard,
  Presentation,
  FileText,
  SquarePen,
  ScrollText,
  User,
  LogOut,
} from "lucide-react";

import CommandPalette from "./CommandPalette";
import NoteFile from "./NoteFiles";
import RecentNotes from "./RecentNotes";
// Cleaned up unused 'title' import from process to prevent build crashes
import { signOut } from "@/app/(app)/api/v1/auth/signOut/route";

interface HeadderProps {
  onNavigate?: (href: string) => void;
  activeHref?: string;
  user?: string | null;
}

// 1. Destructured 'user' right here so it's accessible inside the JSX
export default function Sidebar({ user }: HeadderProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // 2. Destructured the hook correctly into its state tuple
  const [isPending, startTransition] = useTransition();

  // 3. Moved inside the component so it has lexical scope access to 'startTransition'
  const handleSignOutInternal = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  const notes = [
    {
      id: 1,
      title: "Note",
      updatedAt: Date.now(),
    },
  ];

  const menuItems = [
    {
      id: 1,
      label: "Dashboard",
      href: "/dashboard",
      icon: <Home />,
    },
    {
      id: 2,
      label: "TextEditor",
      href: "/text-note",
      icon: <FileText />,
    },
    {
      id: 3,
      label: "MarkDown Editor",
      href: "/markdown-note",
      icon: <ScrollText />,
    },
    {
      id: 4,
      label: "WhiteBoard",
      href: "/white-board",
      icon: <SquarePen />,
    },
  ];

  // Bind Command + K for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-base-200 border-r border-base-content/10 transition-colors duration-300">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-base-content/10 shrink-0">
        <div className="flex items-center gap-2 px-3 py-2">
          <Image
            src="https://res.cloudinary.com/dxojgqsrh/image/upload/v1781777178/digi-cloudinary/images/te4ms9jzxhwq89yfjkfc.png"
            alt="icon"
            width={30}
            height={30}
          />
          <span className="font-caveat font-bold text-2xl text-slate-800 tracking-wide drop-shadow-[0_0.5px_0.5px_rgba(255,255,255,0.9)]">
            SyntaxNote
          </span>
        </div>
      </div>

      {/* Quick Search Button */}
      <div className="px-4 py-3">
        <button
          onClick={() => setIsPaletteOpen(true)}
          className="group flex items-center justify-between w-full h-10 px-3 rounded-xl border border-base-content/10 bg-base-100/50 hover:bg-base-100 hover:border-base-content/20 transition-all duration-200 cursor-pointer"
          title="Search notes & commands"
        >
          <div className="flex items-center gap-3">
            <Search
              size={16}
              className="text-base-content/50 group-hover:text-base-content/70"
            />
            <span className="text-sm text-base-content/60">
              Search notes...
            </span>
          </div>
          <kbd className="hidden sm:flex items-center justify-center h-6 px-2 rounded-md border border-base-content/10 bg-base-200 text-[11px] font-mono text-base-content/60">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="w-full h-px bg-primary/5" />

      {/* Navigation Links */}
      <nav className="flex-1 px-1 py-3 mb-2 max-h-fit">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                "group flex items-center gap-3 px-2 py-1 rounded-xl text-sm font-extralight transition-all duration-200 relative",
                isActive
                  ? "font-extrabold text-blue-700 text-primary-content "
                  : "in-hover ",
              )}
            >
              <div className="shrink-0">{item.icon}</div>
              <div className="flex flex-col">
                <span className="truncate">{item.label}</span>
                <span
                  className={cx(
                    "text-[9px] font-normal py-0.5 leading-none mt-0.5 truncate",
                    isActive
                      ? "text-primary-content/60"
                      : "text-base-content/40 text-amber-600 group-hover:text-base-content/65",
                  )}
                ></span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="w-full h-px bg-primary/5" />

      {/* Folder/Notes Section */}
      <aside className="mt-1">
        <NoteFile />
      </aside>

      <div className="w-full h-px bg-primary/5" />

      {/* User Section */}
      <div className="min-h-14 p-4 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <User size={18} className="text-base-content/70" />
          <span
            className="font-caveat font-bold text-violet-700 text-sm px-1.5 py-0.5 rounded border border-purple-300 bg-purple-50/50 -rotate-1 shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
            style={{ textShadow: "0 0.5px 0.5px rgba(255,255,255,0.9)" }}
          >
            {user || "User"}
          </span>
        </div>
        <button
          onClick={handleSignOutInternal}
          disabled={isPending}
          className="text-left font-patrick text-[13px] text-rose-700 hover:text-rose-900 cursor-pointer hover:underline disabled:opacity-50"
        >
          {isPending ? "Signing out..." : <LogOut />}
        </button>
      </div>

      {isPaletteOpen && (
        <CommandPalette onClose={() => setIsPaletteOpen(false)} />
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 inset-x-0 h-16 bg-base-200/90 backdrop-blur-md border-b border-base-content/10 z-40 flex items-center justify-between px-4 transition-colors">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow shadow-purple-500/20">
            <span className="font-extrabold text-xs text-white">C</span>
          </div>
          <span className="font-extrabold text-sm tracking-wider text-base-content">
            SyntaxNote
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaletteOpen(true)}
            className="p-2 rounded-lg border border-base-content/10 bg-base-100 text-base-content/70 hover:text-base-content cursor-pointer"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg border border-base-content/10 bg-base-100 text-base-content hover:bg-base-300 cursor-pointer"
            aria-label="Open menu"
          >
            <MenuIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileOpen(false)}
          ></div>
          <div className="relative flex flex-col w-64 max-w-[80vw] h-full animate-slide-in-left">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-base-300 border border-base-content/10 text-base-content cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar Pane */}
      <aside className="hidden md:block h-screen sticky top-0 shrink-0 transition-all duration-300 z-30 w-64">
        {sidebarContent}
      </aside>
    </>
  );
}
