"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface CommandPaletteProps {
  onClose: () => void;
}

export default function CommandPalette({ onClose }: CommandPaletteProps) {
  const [search, setSearch] = React.useState("");

  const folders: any = []

  

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="rounded-lg border border-white/10 bg-black/80 shadow-2xl backdrop-blur-md">
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Folder..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none placeholder-gray-500"
              autoFocus
            />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Commands List */}
          
        </div>
      </div>
    </div>
  );
}
