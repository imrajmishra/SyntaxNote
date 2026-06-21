"use client";

import React from "react";
import PencilLoader from "@/components/Loader/PencilLoader";

export default function Loading() {
  return (
    <PencilLoader
      text="SyntaxNote is loading..."
      subtitle="Preparing notebook parchment..."
    />
  );
}
