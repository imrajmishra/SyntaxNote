"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import WelcomePage from "@/components/WelcomePage/WelcomePage";

interface StickyNote {
  id: number;
  text: string;
  color: string;
  x: number;
  y: number;
  rotate: string;
  page: "front" | "back";
}

export default function EntryPage() {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const scale = 1;

  // Sticky Notes states for front cover
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([
    {
      id: 101,
      text: "3D Page-Flip: Physical curl-and-reveal animation on load or click.",
      color: "bg-yellow-100 border-yellow-300 text-yellow-800",
      x: 10,
      y: 80,
      rotate: "-4deg",
      page: "front",
    },
    {
      id: 102,
      text: "Doodle Canvas: Interactive sketches directly on the paper with colored pens.",
      color: "bg-pink-100 border-pink-300 text-pink-800",
      x: 600,
      y: 100,
      rotate: "3.5deg",
      page: "front",
    },
    {
      id: 103,
      text: "Draggable Post-its: Drag, place, and arrange custom color sticky notes anywhere.",
      color: "bg-blue-100 border-blue-300 text-blue-800",
      x: 30,
      y: 420,
      rotate: "2deg",
      page: "front",
    },
  ]);

  const [draggingNoteId, setDraggingNoteId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const bookContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Lock body scroll for the welcome page
    document.body.classList.add("overflow-hidden", "h-screen");

    const savedUser = localStorage.getItem("syntaxnote_user");
    if (savedUser) {
      setUser(savedUser);
    }
    // Adjust note position on client-side mount
    setStickyNotes((prev) =>
      prev.map((n) =>
        n.id === 102
          ? { ...n, x: window.innerWidth > 900 ? window.innerWidth - 240 : 600 }
          : n
      )
    );

    return () => {
      // Re-enable body scroll when leaving welcome page
      document.body.classList.remove("overflow-hidden", "h-screen");
    };
  }, []);

  // Toast trigger
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Flip page handler
  const handleFlip = () => {
    setIsFlipped(true);
    // After flip animation completes (1.2s), redirect to desk workspace
    setTimeout(() => {
      router.push("/home");
    }, 1300);
  };

  // Coordinates helper
  const getCoordinates = (
    e: React.MouseEvent | React.TouchEvent | TouchEvent | MouseEvent
  ) => {
    if ("touches" in e && e.touches.length > 0) {
      return {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
      };
    }
    const mouseEvent = e as MouseEvent | React.MouseEvent;
    return {
      clientX: mouseEvent.clientX,
      clientY: mouseEvent.clientY,
    };
  };

  const handleNoteStartDrag = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    noteId: number
  ) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    const note = stickyNotes.find((n) => n.id === noteId);
    if (!note) return;

    setDraggingNoteId(noteId);
    setDragOffset({
      x: coords.clientX - note.x * scale,
      y: coords.clientY - note.y * scale,
    });
  };

  const handleNoteDrag = (
    e: React.MouseEvent | React.TouchEvent | TouchEvent | MouseEvent
  ) => {
    if (draggingNoteId === null) return;
    const coords = getCoordinates(e);

    const updatedX = (coords.clientX - dragOffset.x) / scale;
    const updatedY = (coords.clientY - dragOffset.y) / scale;

    const note = stickyNotes.find((n) => n.id === draggingNoteId);
    if (!note) return;

    const rect = bookContainerRef.current
      ? bookContainerRef.current.getBoundingClientRect()
      : { width: window.innerWidth, height: window.innerHeight };

    const constrainedX = Math.max(10, Math.min(rect.width - 150, updatedX));
    const constrainedY = Math.max(60, Math.min(rect.height - 120, updatedY));

    setStickyNotes((prev) =>
      prev.map((n) =>
        n.id === draggingNoteId
          ? { ...n, x: constrainedX, y: constrainedY }
          : n
      )
    );
  };

  const handleNoteEndDrag = () => {
    setDraggingNoteId(null);
  };

  const deleteStickyNote = (id: number) => {
    setStickyNotes(stickyNotes.filter((note) => note.id !== id));
  };

  return (
    <div
      className="h-full w-full overflow-hidden flex flex-col justify-center select-none relative bg-slate-900 text-slate-100"
      onMouseMove={handleNoteDrag}
      onTouchMove={handleNoteDrag}
      onMouseUp={handleNoteEndDrag}
      onTouchEnd={handleNoteEndDrag}
    >
      {/* Decorative background stamps/books */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 opacity-15">
        <div className="absolute -left-16 -top-16 w-100 h-100 filter blur-[15px] opacity-25 transform -rotate-12">
          <svg viewBox="0 0 200 200" className="w-full h-full fill-slate-700 text-slate-800">
            <rect x="20" y="20" width="140" height="160" rx="8" />
            <rect x="35" y="30" width="110" height="140" rx="2" fill="#1e293b" />
          </svg>
        </div>
      </div>

      {/* 3D Workspace */}
      <main className="w-full h-full relative overflow-hidden pt-0">
        <div
          ref={bookContainerRef}
          className="relative w-full h-full"
        >
          {/* 3D Viewport */}
          <div
            className="relative w-full h-full perspective-container"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* 3D Card Wrapper */}
            <div
              className="card-3d-wrapper"
              style={{
                transform: isFlipped ? "rotateY(-180deg)" : "rotateY(0deg)",
                boxShadow: isFlipped
                  ? "-15px 25px 50px -10px rgba(0, 0, 0, 0.6)"
                  : "15px 25px 50px -10px rgba(0, 0, 0, 0.6)",
              }}
            >
              {/* FRONT FACE (Welcome cover) */}
              <div
                className="page-face z-20"
                style={{ backfaceVisibility: "hidden" }}
              >
                <WelcomePage
                  handleFlip={handleFlip}
                  stickyNotes={stickyNotes}
                  handleNoteStartDrag={handleNoteStartDrag}
                  deleteStickyNote={deleteStickyNote}
                />
              </div>

              {/* BACK FACE (Flipped transitional placeholder) */}
              <div
                className="page-face z-10"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="w-full h-full bg-slate-950 flex items-center justify-center">
                  <div className="text-center font-caveat text-4xl text-slate-400">
                    Opening library desk... 📖
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 shadow-xl text-xs font-sans text-slate-200 animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
