"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NotebookPage from "@/components/background/NoteBookBg";
import PencilLoader from "@/components/Loader/PencilLoader";
import {
  FileText,
  Pin,
  Heart,
  Trash2,
  Folder,
  Tag,
  Plus,
  RefreshCw,
  Lock,
  Unlock,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Cpu,
  Layers,
  BookOpen,
  FileCode,
  Sliders,
  Shield,
} from "lucide-react";

// Types
interface DraftNote {
  id: number;
  title: string;
  category: string;
  isPinned: boolean;
  isFavorite: boolean;
}

interface GraphNode {
  id: number;
  label: string;
  x: number;
  y: number;
  color: string;
}

interface GraphLink {
  source: number;
  target: number;
}

export default function RecreatedHomePage() {
  const router = useRouter();

  // App Loader state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loaderText, setLoaderText] = useState<string>("Tearing paper sheets...");

  // Active Playroom Tab state
  const [activePlayTab, setActivePlayTab] = useState<
    "drafts" | "cheatsheet" | "folders" | "graph" | "ai" | "vault" | "stamps"
  >("drafts");

  // Load timer simulation
  useEffect(() => {
    const texts = [
      "Inking notebook lines...",
      "Binding margins...",
      "Sharpening graphite pencil...",
      "Stamping catalog card...",
    ];

    let textIdx = 0;
    const interval = setInterval(() => {
      if (textIdx < texts.length) {
        setLoaderText(texts[textIdx]);
        textIdx++;
      }
    }, 350);

    const timer = setTimeout(() => {
      setIsLoading(false);
      clearInterval(interval);
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // --- INTERACTIVE PLAYROOM STATES ---

  // 1. Drafts
  const [draftNotes, setDraftNotes] = useState<DraftNote[]>([
    { id: 1, title: "Chemistry Lab Log", category: "University", isPinned: true, isFavorite: true },
    { id: 2, title: "Side Project Draft", category: "Work", isPinned: false, isFavorite: false },
    { id: 3, title: "Lemon Pie Recipe", category: "Personal", isPinned: false, isFavorite: true },
  ]);
  const [newDraftTitle, setNewDraftTitle] = useState<string>("");

  const addDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDraftTitle.trim()) return;
    const categories = ["University", "Work", "Personal"];
    const newNote: DraftNote = {
      id: Date.now(),
      title: newDraftTitle,
      category: categories[Math.floor(Math.random() * categories.length)],
      isPinned: false,
      isFavorite: false,
    };
    setDraftNotes([newNote, ...draftNotes]);
    setNewDraftTitle("");
  };

  const togglePinDraft = (id: number) => {
    setDraftNotes(draftNotes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n)));
  };

  const toggleFavDraft = (id: number) => {
    setDraftNotes(draftNotes.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n)));
  };

  const deleteDraft = (id: number) => {
    setDraftNotes(draftNotes.filter((n) => n.id !== id));
  };

  // 2. Editor cheatsheet
  const [activeFormat, setActiveFormat] = useState<string>("headings");
  const formatCodeMap: Record<string, { raw: string; preview: React.ReactNode }> = {
    headings: {
      raw: "# Inked Heading 1\n## Subheading 2",
      preview: (
        <div className="space-y-1">
          <h3 className="font-patrick text-xl font-bold border-b border-dashed border-slate-300 pb-0.5 m-0 text-slate-800">
            Inked Heading 1
          </h3>
          <h4 className="font-patrick text-base font-bold m-0 text-slate-700">Subheading 2</h4>
        </div>
      ),
    },
    code: {
      raw: "inline `code` blocks\n```js\nconsole.log('Notebook compiler success!');\n```",
      preview: (
        <div className="space-y-1.5 font-patrick text-slate-700 text-xs">
          <div>
            inline{" "}
            <code className="px-1 py-0.5 bg-neutral-200 text-neutral-800 font-mono text-[10px] rounded">
              code
            </code>{" "}
            blocks
          </div>
          <pre className="p-2 bg-slate-100 border border-slate-300 rounded font-mono text-[9px] text-slate-800 overflow-x-auto">
            {`// compiled script\nconsole.log('Notebook compiler success!');`}
          </pre>
        </div>
      ),
    },
    math: {
      raw: "$$ E = mc^2 $$\n$$ x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a} $$",
      preview: (
        <div className="space-y-2.5 py-1 text-center font-serif text-slate-850 text-xs">
          <div className="p-1.5 rounded bg-amber-50 border border-amber-200 shadow-sm rotate-[-0.5deg]">
            E = mc²
          </div>
          <div className="p-1.5 rounded bg-amber-50 border border-amber-200 shadow-sm rotate-[0.5deg]">
            x = (-b ± √(b² - 4ac)) / 2a
          </div>
        </div>
      ),
    },
  };

  // 3. Folders
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    root: true,
    uni: true,
    work: false,
  });
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const simulatedNotes = [
    { title: "Quantum Physics", folder: "uni", tags: ["#academic", "#notes"] },
    { title: "Organic Chemistry", folder: "uni", tags: ["#academic", "#chemistry"] },
    { title: "Refactoring Checklist", folder: "work", tags: ["#todo", "#dev"] },
    { title: "Weekly Tasks", folder: "root", tags: ["#todo", "#personal"] },
  ];

  const filteredSimNotes = simulatedNotes.filter((note) => {
    if (selectedTag !== "All" && !note.tags.includes(selectedTag)) return false;
    return true;
  });

  // 4. Graph
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([
   
  ]);
  const [graphLinks] = useState<GraphLink[]>([
    
  ]);
  const [draggingNodeId, setDraggingNodeId] = useState<number | null>(null);

  const handleGraphNodeDown = (e: React.PointerEvent<SVGGElement>, id: number) => {
    e.stopPropagation();
    setDraggingNodeId(id);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleGraphNodeMove = (e: React.PointerEvent<SVGGElement>, id: number) => {
    if (draggingNodeId !== id) return;
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();

    const localX = Math.max(20, Math.min(rect.width - 20, e.clientX - rect.left));
    const localY = Math.max(20, Math.min(rect.height - 20, e.clientY - rect.top));

    setGraphNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, x: localX, y: localY } : n))
    );
  };

  const handleGraphNodeUp = (e: React.PointerEvent<SVGGElement>, id: number) => {
    setDraggingNodeId(null);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // 5. AI Chat
  const [aiChat, setAiChat] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Welcome! Click one of the study macro options below to simulate inking action items." },
  ]);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);

  const triggerAiResponse = (prompt: string, response: string) => {
    if (isAiTyping) return;
    setAiChat((prev) => [...prev, { sender: "user", text: prompt }]);
    setIsAiTyping(true);

    let typedText = "";
    let i = 0;

    const interval = setInterval(() => {
      if (i < response.length) {
        typedText += response.charAt(i);
        setAiChat((prev) => {
          const list = [...prev];
          if (list[list.length - 1]?.sender === "ai" && list.length > 1) {
            list[list.length - 1] = { sender: "ai", text: typedText };
            return list;
          } else {
            return [...list, { sender: "ai", text: typedText }];
          }
        });
        i++;
      } else {
        clearInterval(interval);
        setIsAiTyping(false);
      }
    }, 20);
  };

  // 6. Security Private Cabinet Vault
  const [passcode, setPasscode] = useState<string>("");
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [vaultError, setVaultError] = useState<string | null>(null);

  const handleKeypadPress = (val: string) => {
    setVaultError(null);
    if (passcode.length < 4) {
      const newPass = passcode + val;
      setPasscode(newPass);

      if (newPass === "1234") {
        setTimeout(() => {
          setIsUnlocked(true);
          setPasscode("");
        }, 300);
      } else if (newPass.length === 4) {
        setTimeout(() => {
          setVaultError("⚠️ Invalid passcode code!");
          setPasscode("");
        }, 300);
      }
    }
  };

  // 7. Visitor stamps card
  const [guestStamps, setGuestStamps] = useState<string[]>([]);
  const stampQuotes = [
    "APPROVED INK ✏️",
    "VISITED CATALOG 🎟️",
    "NO FINES CHARGED 💸",
    "SCHOLAR CHECK-IN 📖",
    "RAW CSS STAMPED 🎨",
    "DRAFT APPROVED ✍️",
  ];

  useEffect(() => {
    const saved = localStorage.getItem("syntaxnote_guest_stamps");
    if (saved) {
      setGuestStamps(JSON.parse(saved));
    }
  }, []);

  const addStamp = () => {
    if (guestStamps.length >= 6) {
      alert("🎟️ Your check-in card is full! Double-click to erase.");
      return;
    }
    const randQuote = stampQuotes[Math.floor(Math.random() * stampQuotes.length)];
    const dateStr = new Date().toLocaleDateString([], { month: "short", day: "numeric" });
    const fullStamp = `${randQuote} • ${dateStr}`;
    const updated = [...guestStamps, fullStamp];
    setGuestStamps(updated);
    localStorage.setItem("syntaxnote_guest_stamps", JSON.stringify(updated));
  };

  const clearStamps = () => {
    setGuestStamps([]);
    localStorage.removeItem("syntaxnote_guest_stamps");
  };

  if (isLoading) {
    return <PencilLoader text={loaderText} />;
  }

  return (
    <div className="w-full bg-[#fcfaf2] text-slate-800 flex flex-col font-patrick relative min-h-screen">
      {/* 1. Ruled Double Page catalog sheet */}
      <NotebookPage
        showTornEdge={false}
        className="border border-slate-300 overflow-hidden shrink-0"
      >
        {/* Navigation Header */}
        <div className="w-full flex justify-between items-center border-b border-dashed border-slate-300/60 pb-3 select-none">
          <div className="flex items-center gap-1.5">
            <span className="font-caveat font-bold text-2xl text-slate-850 tracking-wide">
              SyntaxNote
            </span>
          </div>
          <a
            href="/dashboard"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-violet-50 hover:bg-violet-100 border border-violet-300 text-violet-750 text-xs font-bold rounded-lg cursor-pointer transition-all shadow-sm"
          >
            <span>Launch Notebook</span>
            <ArrowRight size={12} />
          </a>
        </div>

        {/* HERO SECTION */}
        <div className="text-center mt-12 mb-14 select-none">
          <div className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded border border-amber-300 shadow-sm animate-pulse mb-3">
            Digital Ruled Binder ✏️
          </div>
          <h1 className="font-caveat text-5xl md:text-6xl font-bold text-slate-850 m-0 tracking-wide leading-tight">
            Authentic Notebook Feel,
            <br />
            Fully Connected Sandbox.
          </h1>
          <p className="font-patrick text-[15px] text-slate-500 max-w-xl mx-auto mt-3.5 leading-relaxed">
            Write on organic, ruled parchment sheets styled with classic
            margins. Keep your notes organized with nested trees, linked
            backlinks, and an embedded AI study companion.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a
              href="/dashboard"
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
            >
              <span>Create Note</span>
              <ArrowRight size={14} />
            </a>
            <a
              href="#playground"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("playground")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-1.5 px-5 py-2 border border-slate-350 bg-slate-100 hover:bg-slate-200 text-slate-650 text-sm font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
            >
              <span>Try Playground</span>
            </a>
          </div>
        </div>

        {/* FEATURES OVERVIEW GRID */}
        <div className="mb-14 select-none">
          <div className="text-center mb-6">
            <h2 className="font-caveat text-3xl font-bold text-slate-800 m-0">
              Notebook Capabilities
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Explore how SyntaxNote connects your workflows
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <div className="p-4 bg-white/70 border border-slate-300 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center mb-3">
                <FileText size={16} />
              </div>
              <h3 className="text-sm font-bold text-slate-800 font-patrick m-0">
                Modular WYSIWYG Editor
              </h3>
              <p className="text-xs text-slate-500 font-patrick mt-1 leading-relaxed">
                Ruled parchment writing canvas powered by TipTap, featuring
                automatic local background saves.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-4 bg-white/70 border border-slate-300 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <Layers size={16} />
              </div>
              <h3 className="text-sm font-bold text-slate-800 font-patrick m-0">
                Nested Directories
              </h3>
              <p className="text-xs text-slate-500 font-patrick mt-1 leading-relaxed">
                Manage catalogs with subfolder hierarchies and tag badges for
                multi-dimensional filters.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-4 bg-white/70 border border-slate-300 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
                <Shield size={16} />
              </div>
              <h3 className="text-sm font-bold text-slate-800 font-patrick m-0">
                Scholar Registry Profile
              </h3>
              <p className="text-xs text-slate-500 font-patrick mt-1 leading-relaxed">
                Configure unique credentials, preferences (compact list views,
                split layout defaults), and password locks.
              </p>
            </div>
          </div>
        </div>

        {/* INTERACTIVE PLAYGROUND DESK */}
        <div
          id="playground"
          className="border-t border-dashed border-slate-350/60 pt-10 mb-8"
        >
          <div className="text-center mb-6 select-none">
            <h2 className="font-caveat text-4xl font-bold text-slate-850 m-0">
              Interactive Playroom Desk
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Click a tab to test the simulated catalog modules
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Tab controls */}
            <div className="md:col-span-4 flex flex-col gap-1.5 select-none">
              {[
                {
                  id: "drafts",
                  label: "1. Drafts Pad",
                  desc: "Toggle favorite & pin details",
                },
                {
                  id: "cheatsheet",
                  label: "2. Text Compiler",
                  desc: "Teaser lists, math & diagrams",
                },
                {
                  id: "folders",
                  label: "3. Directory Explorer",
                  desc: "Fold subfolders & tag filter",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePlayTab(tab.id as any)}
                  className={`p-3 text-left border rounded-xl transition-all cursor-pointer ${
                    activePlayTab === tab.id
                      ? "bg-violet-50 border-violet-400 text-violet-900 shadow-sm"
                      : "bg-white/60 border-slate-300 text-slate-600 hover:bg-white hover:text-slate-800"
                  }`}
                >
                  <span className="font-patrick text-sm font-bold block leading-tight">
                    {tab.label}
                  </span>
                  <span className="text-[10px] font-sans text-slate-400 block mt-0.5">
                    {tab.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Sandbox Render Window */}
            <div className="md:col-span-8 bg-white border border-slate-300 rounded-2xl p-5 shadow-sm min-h-70 flex flex-col justify-between">
              {/* Tab 1: Drafts */}
              {activePlayTab === "drafts" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-inter block">
                      Foundations note Index Pad
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans italic">
                      Double-click list items to view
                    </span>
                  </div>

                  <form onSubmit={addDraft} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Create a new draft title..."
                      value={newDraftTitle}
                      onChange={(e) => setNewDraftTitle(e.target.value)}
                      className="grow px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-violet-500 text-slate-700 font-sans"
                      maxLength={25}
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-violet-650 hover:bg-violet-700 text-black hover:text-white font-patrick text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      <Plus size={13} />
                    </button>
                  </form>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {draftNotes.length === 0 ? (
                      <div className="text-center text-slate-400 text-xs py-6 font-sans">
                        No drafts remain. Click add!
                      </div>
                    ) : (
                      draftNotes.map((note) => (
                        <div
                          key={note.id}
                          className="flex justify-between items-center px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs hover:border-slate-300 transition-colors shadow-sm"
                        >
                          <span className="font-patrick font-bold text-slate-750 flex items-center gap-2">
                            <FileText
                              size={12}
                              className="text-slate-450 shrink-0"
                            />
                            <span>{note.title}</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-slate-200/70 text-slate-500 rounded font-semibold shrink-0 font-sans">
                              {note.category}
                            </span>
                          </span>

                          <div className="flex gap-2.5 text-slate-400 select-none">
                            <button
                              onClick={() => togglePinDraft(note.id)}
                              className={`hover:text-rose-500 cursor-pointer transition-colors ${
                                note.isPinned ? "text-rose-600" : ""
                              }`}
                              title={note.isPinned ? "Unpin Note" : "Pin Note"}
                            >
                              <Pin
                                size={12}
                                className={note.isPinned ? "fill-rose-600" : ""}
                              />
                            </button>
                            <button
                              onClick={() => toggleFavDraft(note.id)}
                              className={`hover:text-red-500 cursor-pointer transition-colors ${
                                note.isFavorite ? "text-red-500" : ""
                              }`}
                              title={
                                note.isFavorite
                                  ? "Remove from Favorites"
                                  : "Add to Favorites"
                              }
                            >
                              <Heart
                                size={12}
                                className={
                                  note.isFavorite ? "fill-red-500" : ""
                                }
                              />
                            </button>
                            <button
                              onClick={() => deleteDraft(note.id)}
                              className="hover:text-slate-700 cursor-pointer transition-colors"
                              title="Delete Note"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Cheatsheet */}
              {activePlayTab === "cheatsheet" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-inter block">
                      Text Compiler cheatsheet
                    </span>
                    <div className="flex gap-1">
                      {["headings", "code", "math"].map((t) => (
                        <button
                          key={t}
                          onClick={() => setActiveFormat(t)}
                          className={`px-2 py-0.5 rounded cursor-pointer capitalize text-[9px] font-semibold font-sans transition-colors ${
                            activeFormat === t
                              ? "bg-slate-800 text-white"
                              : "text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center min-h-40">
                    <div className="bg-slate-50 p-2.5 border border-slate-200 rounded-lg text-[10px] font-mono text-slate-700 whitespace-pre-wrap select-text leading-relaxed">
                      {formatCodeMap[activeFormat].raw}
                    </div>
                    <div className="border border-slate-200 p-3 rounded-lg bg-[#fdfbf7] shadow-inner">
                      {formatCodeMap[activeFormat].preview}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Folders */}
              {activePlayTab === "folders" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-inter block">
                      Directory tree Organizer
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {["All", "#academic", "#todo", "#personal"].map((t) => (
                        <button
                          key={t}
                          onClick={() => setSelectedTag(t)}
                          className={`px-2 py-0.5 rounded-full border text-[9px] cursor-pointer transition-colors ${
                            selectedTag === t
                              ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                              : "bg-slate-50 border-slate-300 text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 min-h-40 text-xs">
                    {/* tree folder */}
                    <div className="sm:col-span-5 border-r border-slate-200 pr-2 space-y-1.5 select-none">
                      <button
                        onClick={() =>
                          setExpandedFolders((prev) => ({
                            ...prev,
                            root: !prev.root,
                          }))
                        }
                        className="flex items-center gap-1.5 cursor-pointer font-patrick text-slate-800"
                      >
                        {expandedFolders.root ? (
                          <ChevronDown size={11} />
                        ) : (
                          <ChevronRight size={11} />
                        )}
                        <Folder
                          size={12}
                          className="text-amber-500 fill-amber-500/20 shrink-0"
                        />
                        <span className="font-bold">Workspace Root</span>
                      </button>

                      {expandedFolders.root && (
                        <div className="pl-4 space-y-1.5">
                          <button
                            onClick={() =>
                              setExpandedFolders((prev) => ({
                                ...prev,
                                uni: !prev.uni,
                              }))
                            }
                            className="flex items-center gap-1.5 cursor-pointer font-patrick text-slate-700"
                          >
                            {expandedFolders.uni ? (
                              <ChevronDown size={11} />
                            ) : (
                              <ChevronRight size={11} />
                            )}
                            <Folder
                              size={12}
                              className="text-amber-500 fill-amber-500/20 shrink-0"
                            />
                            <span>University/</span>
                          </button>

                          <button
                            onClick={() =>
                              setExpandedFolders((prev) => ({
                                ...prev,
                                work: !prev.work,
                              }))
                            }
                            className="flex items-center gap-1.5 cursor-pointer font-patrick text-slate-700"
                          >
                            {expandedFolders.work ? (
                              <ChevronDown size={11} />
                            ) : (
                              <ChevronRight size={11} />
                            )}
                            <Folder
                              size={12}
                              className="text-amber-500 fill-amber-500/20 shrink-0"
                            />
                            <span>Work Projects/</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* notes list */}
                    <div className="sm:col-span-7 space-y-1.5 grow overflow-y-auto max-h-40 pr-1">
                      {filteredSimNotes.length === 0 ? (
                        <div className="text-center text-slate-400 italic py-6">
                          No matching notes in catalog.
                        </div>
                      ) : (
                        filteredSimNotes.map((note, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg shadow-sm"
                          >
                            <span className="font-patrick font-medium text-slate-750">
                              {note.title}
                            </span>
                            <span className="text-[9px] text-slate-400 font-sans font-semibold">
                              {note.tags.join(" ")}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* General tab instructions footer */}
              <div className="text-center font-patrick text-[11px] text-slate-400 border-t border-slate-200 pt-2 select-none">
                Interactive catalog sandbox. All states persist instantly during
                play.
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic footer branding */}
        <div className="border-t border-dashed border-slate-350/60 pt-6 mt-12 text-center select-none font-patrick text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>
            SyntaxNote catalog Chronicles. Built with React, TipTap, and SQLite.
          </span>
          <div className="flex gap-4">
            <a
              href="/service"
              className="hover:text-slate-700 cursor-pointer transition-colors"
            >
              Services
            </a>
          </div>
        </div>
      </NotebookPage>
    </div>
  );
}
