"use client";

import React from "react";

export default function Footer() {
  return (
    <footer
      className="relative w-full h-16 paper-texture flex items-center justify-between pl-16 pr-8 select-none border-t border-neutral-300/45 z-10"
      style={{
        backgroundColor: "var(--color-paper)",
      }}
    >
      {/* Ruled Horizontal Lines */}
      <div
        className="absolute inset-0 ruled-lines opacity-65 pointer-events-none"
        style={{ backgroundSize: "100% 20px" }}
      />

      {/* Red Margin Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-red-400/70 pointer-events-none"
        style={{ left: "48px" }}
      />

      {/* Left footer note */}
      <div className="z-10 pl-5 flex flex-col pt-2 font-patrick">
        <span className="font-bold text-[14px] text-slate-800 leading-tight">
          SyntaxNote Notebook
        </span>
        <span className="text-[11px] text-slate-500 italic">
          Written with virtual graphite & clean code.
        </span>
      </div>

      {/* Right footer text */}
      <div className="z-10 flex items-center pt-2 font-patrick text-slate-600 text-[13px]">
        <span>© 2026 SyntaxNote. Stamped in the archives.</span>
      </div>
    </footer>
  );
}