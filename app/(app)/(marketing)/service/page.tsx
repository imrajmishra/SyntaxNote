"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import NotebookPage from "@/components/background/NoteBookBg";
import {
  FileText,
  CheckSquare,
  PenTool,
  Plus,
  Layers,
  Heart,
  ArrowRight,
} from "lucide-react";

interface MiniNote {
  id: number;
  text: string;
  color: string;
  x: number;
  y: number;
}

export default function ServicesPage() {
  const router = useRouter();

  // 1. Markdown Studio Sandbox States
  const [mdText, setMdText] = useState<string>("**Bold Ink** & *Italic pencil*");
  const [isCompiled, setIsCompiled] = useState<boolean>(false);

  // 2. Grammar Checker Sandbox States
  const [grammarText, setGrammarText] = useState<string>("I recived the the notebook.");
  const [grammarFixed, setGrammarFixed] = useState<boolean>(false);

  // 3. Margin Doodle Canvas Sandbox States/Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawColor, setDrawColor] = useState<string>("#4b5563"); // graphite gray

  // 4. Draggable Mini Sticky Notes Sandbox States
  const [miniNotes, setMiniNotes] = useState<MiniNote[]>([
    { id: 1, text: "Draft ideas", color: "bg-yellow-100 border-yellow-300 text-yellow-850", x: 10, y: 12 },
    { id: 2, text: "Auto-save", color: "bg-pink-100 border-pink-300 text-pink-800", x: 140, y: 8 },
    { id: 3, text: "Sync logs", color: "bg-blue-100 border-blue-300 text-blue-800", x: 70, y: 52 },
  ]);
  const [draggingNoteId, setDraggingNoteId] = useState<number | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 5. Checklist Task Log Sandbox States
  const [tasks, setTasks] = useState([
    { id: 1, text: "Sharpen graphite pencil ✏️", checked: false },
    { id: 2, text: "Ink blue ruled page lines ✒️", checked: true },
    { id: 3, text: "Review library archive logs 🎟️", checked: false },
  ]);

  // Mini canvas drawing logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = drawColor;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Mini Sticky Note Drag & Drop handlers
  const handleNoteDown = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDraggingNoteId(id);
    const note = miniNotes.find(n => n.id === id);
    if (note) {
      setDragStart({
        x: e.clientX - note.x,
        y: e.clientY - note.y
      });
    }
  };

  const handleNoteMove = (e: React.MouseEvent) => {
    if (draggingNoteId === null) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Bounded area box (approx w-full inside container card, h-22 is 88px, note is 72px wide, 32px high)
    const boundedX = Math.max(5, Math.min(170, newX));
    const boundedY = Math.max(5, Math.min(55, newY));

    setMiniNotes(prev =>
      prev.map(n => (n.id === draggingNoteId ? { ...n, x: boundedX, y: boundedY } : n))
    );
  };

  const handleNoteUp = () => {
    setDraggingNoteId(null);
  };

  const services = [
    {
      id: "markdown",
      title: "Markdown Studio",
      description: "A full-featured Markdown editor with a simulated backend API. You can write, save, list, and compile your notes into clean HTML with real-time logger outputs.",
      icon: <FileText className="text-sky-600 w-8 h-8" />,
      cta: "Launch Editor 🎟️",
      href: "/mdNote",
      color: "bg-sky-50/60 border-sky-200 hover:border-sky-400 text-sky-900",
      tapeColor: "bg-sky-100/50",
      sandbox: (
        <div className="mt-3 mb-4 space-y-2">
          <div className="flex gap-1.5 justify-between">
            <input
              type="text"
              value={mdText}
              onChange={(e) => {
                setMdText(e.target.value);
                setIsCompiled(false);
              }}
              className="grow px-2.5 py-1 bg-slate-50 border border-slate-250 rounded text-xs font-mono text-slate-700 focus:outline-none"
            />
            <button
              onClick={() => setIsCompiled(true)}
              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-sm"
            >
              Compile
            </button>
          </div>
          
          <div className="h-11 border border-dashed border-slate-200 rounded p-2 bg-[#fdfbf7] flex items-center text-xs text-slate-750 font-patrick overflow-hidden">
            {isCompiled ? (
              <span dangerouslySetInnerHTML={{
                __html: mdText
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\*(.*?)\*/g, "<em>$1</em>")
              }} />
            ) : (
              <span className="italic text-slate-400">Click compile to preview markdown HTML...</span>
            )}
          </div>
        </div>
      )
    },
    {
      id: "grammar",
      title: "Rule-Based Grammar Engine",
      description: "Built-in real-time grammar checks that spot common spelling typos, capitalization errors, or repeated words. Features one-click auto-fixes directly in the editor.",
      icon: <CheckSquare className="text-emerald-600 w-8 h-8" />,
      cta: "Check Grammar ✏️",
      href: "/mdNote",
      color: "bg-emerald-50/60 border-emerald-200 hover:border-emerald-400 text-emerald-900",
      tapeColor: "bg-emerald-100/50",
      sandbox: (
        <div className="mt-3 mb-4 space-y-2">
          <div className="h-11 border border-dashed border-slate-200 rounded p-2 bg-[#fdfbf7] flex items-center text-xs text-slate-750 font-patrick overflow-hidden">
            {grammarFixed ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span>I received the notebook.</span>
                <span>✨</span>
              </span>
            ) : (
              <span className="relative decoration-red-400 decoration-wavy underline font-medium">
                I recived the the notebook.
              </span>
            )}
          </div>
          <button
            onClick={() => setGrammarFixed(true)}
            disabled={grammarFixed}
            className="w-full px-2 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-sm"
          >
            {grammarFixed ? "Checks Passed ✓" : "Fix Spelling & Duplicates"}
          </button>
        </div>
      )
    },
    {
      id: "doodle",
      title: "Creative Margin Canvas",
      description: "Feeling bored? Doodle, draw, or sketch directly on the margins of your ruled paper. Touch-friendly canvas supporting graphite gray, blue ink, and red markers.",
      icon: <PenTool className="text-violet-600 w-8 h-8" />,
      cta: "Sketch Doodles 🎨",
      href: "/mdNote",
      color: "bg-violet-50/60 border-violet-200 hover:border-violet-400 text-violet-900",
      tapeColor: "bg-violet-100/50",
      sandbox: (
        <div className="mt-3 mb-4 space-y-2">
          <div className="relative border border-slate-250 rounded bg-[#fdfbf7] overflow-hidden h-22">
            <canvas
              ref={canvasRef}
              width={260}
              height={88}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-full cursor-crosshair"
            />
            
            {/* Clear canvas & color dots overlay */}
            <div className="absolute top-1.5 right-1.5 flex gap-1.5 items-center select-none">
              {["#4b5563", "#2563eb", "#ef4444"].map((c) => (
                <button
                  key={c}
                  onClick={() => setDrawColor(c)}
                  className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                    drawColor === c ? "scale-115 border-slate-700 ring-1 ring-slate-400" : "border-slate-300"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <button
                onClick={clearCanvas}
                className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[9px] font-sans text-slate-655 rounded cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="text-[10px] text-center text-slate-400 italic">
            💡 Scratch a margin doodle directly on the index card!
          </div>
        </div>
      )
    },
    {
      id: "sticky",
      title: "Draggable Sticky Notes",
      description: "Pin custom-colored post-it notes anywhere on the desk. You can drag them around, customize colors (yellow, pink, blue), and double-click to toss them away.",
      icon: <Plus className="text-rose-600 w-8 h-8" />,
      cta: "Pin A Note 📌",
      href: "/mdNote",
      color: "bg-rose-50/60 border-rose-200 hover:border-rose-400 text-rose-900",
      tapeColor: "bg-rose-100/50",
      sandbox: (
        <div
          onMouseMove={handleNoteMove}
          onMouseUp={handleNoteUp}
          onMouseLeave={handleNoteUp}
          className="mt-3 mb-4 h-22 border border-dashed border-slate-250 bg-slate-50/50 rounded-lg relative overflow-hidden select-none"
        >
          {miniNotes.map(n => (
            <div
              key={n.id}
              onMouseDown={(e) => handleNoteDown(e, n.id)}
              className={`absolute p-1 px-1.5 w-18 text-[9px] leading-tight font-gochi border shadow-sm cursor-grab active:cursor-grabbing rounded select-none z-10 ${n.color}`}
              style={{
                left: `${n.x}px`,
                top: `${n.y}px`,
              }}
            >
              {n.text}
            </div>
          ))}
          {draggingNoteId && (
            <div className="absolute bottom-1 right-1 text-[8px] text-slate-400 bg-white/60 px-1 rounded font-sans">
              Dragging...
            </div>
          )}
        </div>
      )
    },
    {
      id: "checklist",
      title: "Interactive Task Log",
      description: "Manage your daily workflows with interactive checkboxes. Checking off a task triggers a handwritten strike-through line animation.",
      icon: <Layers className="text-amber-600 w-8 h-8" />,
      cta: "Manage Checklist 📝",
      href: "/mdNote",
      color: "bg-amber-50/60 border-amber-200 hover:border-amber-400 text-amber-900",
      tapeColor: "bg-amber-100/50",
      sandbox: (
        <div className="mt-3 mb-4 space-y-1">
          {tasks.map(t => (
            <label
              key={t.id}
              className="flex items-center gap-2 px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs text-slate-750 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={t.checked}
                onChange={() => setTasks(tasks.map(x => x.id === t.id ? { ...x, checked: !x.checked } : x))}
                className="rounded text-amber-600 focus:ring-amber-500 w-3 h-3 cursor-pointer"
              />
              <span className={`font-patrick font-medium ${
                t.checked ? "line-through text-slate-400 font-normal" : "text-slate-700"
              }`}>
                {t.text}
              </span>
            </label>
          ))}
        </div>
      )
    },
  ];

  return (
    <div className="w-full bg-[#fcfaf2] text-slate-800 flex flex-col font-patrick relative grow">
      {/* Centered open catalog binder */}
      <div className=" w-full flex flex-col grow items-stretch">
        <NotebookPage
          showTornEdge={false}
          className="border border-slate-300 overflow-hidden grow flex flex-col justify-between"
        >
          {/* Header branding */}
          <div className="text-center mt-25 border-b border-dashed border-slate-300/60 pb-8">
            <h1 className="font-caveat text-5xl font-bold text-slate-850 m-0 tracking-wide">
              📚 Library Services Catalog
            </h1>
            <p className="font-patrick text-lg text-slate-500 mt-6 max-w-lg mx-auto leading-snug">
              Welcome to the SyntaxNote archives! Experiment with the interactive sandbox cards below to test our notebook capabilities.
            </p>
          </div>

          {/* Grid Layout of Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10 pr-2">
            {services.map((svc, idx) => {
              // Slight rotation for handwritten/taped index card feel
              const rotation =
                idx % 3 === 0
                  ? "-rotate-[1deg]"
                  : idx % 3 === 1
                    ? "rotate-[1.5deg]"
                    : "rotate-[-0.8deg]";
              return (
                <div
                  key={svc.id}
                  className={`
                    relative p-5 rounded-xl border border-slate-350 bg-white/85 shadow-sm
                    flex flex-col justify-between transform transition-all duration-300 hover:scale-[1.03] hover:shadow-md
                    ${rotation} hover:rotate-0 ${svc.color}
                  `}
                >
                  {/* Taped Edge Decal */}
                  <div
                    className={`absolute -top-2.5 left-1/2 -ml-8 w-16 h-5 border-x border-dashed border-slate-300/30 opacity-70 pointer-events-none transform rotate-1 ${svc.tapeColor}`}
                  />

                  <div>
                    {/* Icon & Title */}
                    <div className="flex items-center gap-2.5 mb-3 border-b border-slate-200/50 pb-2.5">
                      {svc.icon}
                      <h3 className="font-caveat text-2xl font-bold tracking-wide">
                        {svc.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="font-patrick text-sm text-slate-600 leading-relaxed mb-3">
                      {svc.description}
                    </p>

                    {/* Interactive Sandbox Widget */}
                    {svc.sandbox}
                  </div>

                  {/* Call to Action Button */}
                  <button
                    onClick={() => router.push(svc.href)}
                    className="
                      mt-4 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg
                      font-patrick text-sm font-bold shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer
                    "
                  >
                    <span>{svc.cta}</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Funny Footnote */}
          <div className="relative border-t border-slate-300/60 mt-10 pt-4 text-center select-none font-sans text-xs text-slate-450 flex items-center justify-center gap-1">
            <Heart size={10} className="text-rose-500 fill-rose-500" />
            <span>
              All catalog services are fully functional. No library fines will be
              charged for doodles.
            </span>
          </div>
        </NotebookPage>
      </div>
    </div>
  );
}
