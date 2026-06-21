"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Folder, Note } from "@/lib/db";

import { GrammarSuggestion } from "@/components/text-note/types";
import { localGrammarChecker } from "@/components/text-note/grammar";
import { EditorHeader } from "@/components/text-note/EditorHeader";
import { EditorPanel } from "@/components/text-note/EditorPanel";
import { ReviewPanel } from "@/components/text-note/ReviewPanel";
import PencilLoader from "@/components/Loader/PencilLoader";

function TextNoteStudioInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeNoteId = searchParams.get("id");

  const [noteId, setNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("Welcome Note");
  const [content, setContent] = useState<string>("");
  const [folderId, setFolderId] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const [allFolders, setAllFolders] = useState<Folder[]>([]);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  
  const [grammarSuggestions, setGrammarSuggestions] = useState<GrammarSuggestion[]>([]);

  // Right-hand pane tab state: 'preview' | 'organization' | 'files'
  const [activeRightTab, setActiveRightTab] = useState<"preview" | "organization" | "files">("preview");

  // Loading states
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [checkingGrammar, setCheckingGrammar] = useState<boolean>(false);
  const [savingNote, setSavingNote] = useState<boolean>(false);
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [isAutoSaved, setIsAutoSaved] = useState<boolean>(true);
  const [newTagName, setNewTagName] = useState("");
  const [newDraftTitle, setNewDraftTitle] = useState<string>("");
  const [viewMode, setViewMode] = useState<"split" | "full">("split");

  // Initialize TipTap Rich Editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      setIsAutoSaved(false);
    },
    editorProps: {
      attributes: {
        class:
          "w-full h-full p-4 focus:outline-none overflow-y-auto font-patrick text-slate-800 text-[15px] leading-[28px] select-text min-h-[350px] outline-none",
      },
    },
  });

  // 1. Fetch directories on load or note transition
  const fetchFoldersAndNotes = async (silent = false) => {
    if (!silent) setLoadingList(true);
    try {
      const [foldersRes, notesRes] = await Promise.all([
        fetch("/api/v1/folder").then((res) => res.json()),
        fetch("/api/v1/notes").then((res) => res.json()),
      ]);
      if (foldersRes.success) setAllFolders(foldersRes.folders);
      if (notesRes.success) setAllNotes(notesRes.notes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingList(false);
    }
  };

  // 2. Fetch specific note detail on mount or ID change
  useEffect(() => {
    fetchFoldersAndNotes(true);

    const loadNoteDetail = async () => {
      setIsInitialLoading(true);
      if (activeNoteId) {
        try {
          const res = await fetch(`/api/v1/notes/${activeNoteId}`).then((r) => r.json());
          if (res.success && res.note) {
            setNoteId(res.note.id);
            setTitle(res.note.title);
            setContent(res.note.content);
            setFolderId(res.note.folderId);
            setTags(res.note.tags);
            setIsPinned(res.note.isPinned);
            setIsFavorite(res.note.isFavorite);
            setGrammarSuggestions([]);
            if (editor) {
              editor.commands.setContent(res.note.content);
            }
            // Sync auto-save states
            setIsAutoSaved(true);
          }
        } catch (e) {
          console.error("Failed to load note data", e);
        } finally {
          setIsInitialLoading(false);
        }
      } else {
        // Automatically fetch all notes, load first or create welcome note
        try {
          const notesRes = await fetch("/api/v1/notes").then((r) => r.json());
          if (notesRes.success && notesRes.notes.length > 0) {
            router.push(`/text-note?id=${notesRes.notes[0].id}`);
          } else {
            await createDefaultWelcomeNote();
            setIsInitialLoading(false);
          }
        } catch (e) {
          console.error(e);
          setIsInitialLoading(false);
        }
      }
    };

    loadNoteDetail();
  }, [activeNoteId, editor]);

  // Seeding default Welcome Note
  const createDefaultWelcomeNote = async () => {
    try {
      const res = await fetch("/api/v1/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Welcome Note",
          content: `<h1>Welcome to SyntaxNote TipTap Studio!</h1><p>This is an advanced <strong>WYSIWYG rich text environment</strong> styled in a premium <strong>dark mode theme</strong>. Type directly on the dark ruled lines and test out rich editing controls!</p><h2>Editor Features</h2><ul><li><strong>Interactive TipTap Engine</strong>: A robust rich text editor replacing standard textareas.</li><li><strong>Dark Mode Aesthetics</strong>: Charcoal ruled backgrounds built to protect eyes and make text stand out.</li><li><strong>Live Markdown Preview</strong>: Dynamic compiler logs view on matching dark document sheets.</li><li><strong>One-Click Formatting Ribbon</strong>: Easily toggle bold, italics, headings, code, and lists.</li></ul><p>Write some teh typos to test the grammar check!</p>`,
          folderId: null,
          tags: ["tutorial"],
        }),
      }).then((r) => r.json());

      if (res.success) {
        router.push(`/text-note?id=${res.note.id}`);
        // Notify sidebar
        window.dispatchEvent(new Event("refresh-sidebar"));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 3. Debounced Auto-save
  useEffect(() => {
    if (!noteId || isAutoSaved) return;

    const saveTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/notes/${noteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            content,
            folderId,
            tags,
            isPinned,
            isFavorite,
          }),
        }).then((r) => r.json());

        if (res.success) {
          setIsAutoSaved(true);
          // Notify sidebar to refresh note lists
          window.dispatchEvent(new Event("refresh-sidebar"));
        }
      } catch (e) {
        console.error("Auto save failed", e);
      }
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [title, content, folderId, tags, isPinned, isFavorite, noteId, isAutoSaved]);

  // API Call: Save Note (Force Manual Save)
  const triggerSaveNote = async () => {
    if (!noteId) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/v1/notes/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content,
          folderId,
          tags,
          isPinned,
          isFavorite,
        }),
      }).then((r) => r.json());

      if (res.success) {
        setIsAutoSaved(true);
        window.dispatchEvent(new Event("refresh-sidebar"));
        alert(`💾 Note "${title}" saved successfully!`);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save note.");
    } finally {
      setSavingNote(false);
    }
  };
  
  // Mutation helper: Toggle pin status of any note in the list
  const handleTogglePinNote = async (targetNote: Note) => {
    const newPinned = !targetNote.isPinned;
    if (targetNote.id === noteId) {
      setIsPinned(newPinned);
      setIsAutoSaved(false);
    }
    try {
      const res = await fetch(`/api/v1/notes/${targetNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: newPinned }),
      }).then((r) => r.json());
      if (res.success) {
        await fetchFoldersAndNotes(true);
        window.dispatchEvent(new Event("refresh-sidebar"));
      }
    } catch (e) {
      console.error("Failed to toggle pin status", e);
    }
  };

  // Mutation helper: Toggle favorite status of any note in the list
  const handleToggleFavoriteNote = async (targetNote: Note) => {
    const newFav = !targetNote.isFavorite;
    if (targetNote.id === noteId) {
      setIsFavorite(newFav);
      setIsAutoSaved(false);
    }
    try {
      const res = await fetch(`/api/v1/notes/${targetNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: newFav }),
      }).then((r) => r.json());
      if (res.success) {
        await fetchFoldersAndNotes(true);
        window.dispatchEvent(new Event("refresh-sidebar"));
      }
    } catch (e) {
      console.error("Failed to toggle favorite status", e);
    }
  };

  // Mutation helper: Delete any note from the index list
  const handleDeleteNoteFromList = async (targetNote: Note) => {
    if (!confirm(`Are you sure you want to delete note "${targetNote.title}"?`)) return;
    try {
      const res = await fetch(`/api/v1/notes/${targetNote.id}`, {
        method: "DELETE",
      }).then((r) => r.json());

      if (res.success) {
        if (targetNote.id === noteId) {
          setNoteId(null);
          setTitle("");
          setContent("");
          setFolderId(null);
          setTags([]);
          setIsPinned(false);
          setIsFavorite(false);
          editor?.commands.setContent("");
          router.push("/text-note");
        }
        await fetchFoldersAndNotes(true);
        window.dispatchEvent(new Event("refresh-sidebar"));
      } else {
        alert(res.message || "Failed to delete note");
      }
    } catch (e) {
      console.error("Failed to delete note", e);
      alert("Failed to delete note");
    }
  };

  // API Call: Grammar Check
  const triggerGrammarCheck = async () => {
    if (!editor) return;
    setCheckingGrammar(true);
    const plainText = editor.getText();
    try {
      const suggestions = await localGrammarChecker.checkGrammar(plainText);
      setGrammarSuggestions(suggestions);
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingGrammar(false);
    }
  };

  // Apply grammar auto-fix — uses TipTap character positions to preserve HTML formatting
  const fixGrammar = (suggestion: GrammarSuggestion) => {
    if (!editor) return;

    // TipTap document positions are 1-indexed and start after the root node.
    // Plain text offset maps 1:1 to TipTap char positions with a +1 shift.
    const from = suggestion.offset + 1;
    const to = from + suggestion.length;

    editor
      .chain()
      .focus()
      .deleteRange({ from, to })
      .insertContentAt(from, suggestion.suggestion)
      .run();

    setContent(editor.getHTML());
    setIsAutoSaved(false);

    // Re-run grammar check so remaining offsets are recalculated cleanly
    const updated = editor.getText();
    localGrammarChecker.checkGrammar(updated).then(setGrammarSuggestions);
  };

  // Delete current Note
  const triggerDeleteNote = async () => {
    if (!noteId) return;
    if (!confirm(`Are you sure you want to delete note "${title}"?`)) return;

    try {
      const res = await fetch(`/api/v1/notes/${noteId}`, {
        method: "DELETE",
      }).then((r) => r.json());

      if (res.success) {
        window.dispatchEvent(new Event("refresh-sidebar"));
        router.push("/text-note");
      } else {
        alert(res.message || "Failed to delete note");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Tag list helpers
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newTagName.trim().toLowerCase().replace(/^#/, "");
    if (!tag) return;
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
      setIsAutoSaved(false);
    }
    setNewTagName("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    setIsAutoSaved(false);
  };

  // Copy compiled HTML
  const copyHtml = () => {
    navigator.clipboard.writeText(content);
    alert("📋 HTML copied to clipboard successfully!");
  };

  // Download raw markdown/HTML file
  const downloadMarkdownFile = () => {
    const blob = new Blob([content], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title.replace(/\s+/g, "_")}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Folder helper for display name formatting
  const getFolderLabel = (f: Folder) => {
    if (f.parentId) {
      const parent = allFolders.find((p) => p.id === f.parentId);
      return `${parent ? parent.name + " / " : ""}${f.name}`;
    }
    return f.name;
  };

  // Note creation helper
  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDraftTitle.trim()) return;
    try {
      const res = await fetch("/api/v1/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newDraftTitle.trim(),
          content: "<h1>" + newDraftTitle.trim() + "</h1><p>Start writing here...</p>",
          folderId: folderId || null,
          tags: [],
          isPinned: false,
          isFavorite: false,
        }),
      }).then((r) => r.json());

      if (res.success) {
        setNewDraftTitle("");
        await fetchFoldersAndNotes(true);
        router.push(`/text-note?id=${res.note.id}`);
        window.dispatchEvent(new Event("refresh-sidebar"));
      } else {
        alert(res.message || "Failed to create note");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create note");
    }
  };

  const handleSelectNote = (id: string) => {
    router.push(`/text-note?id=${id}`);
  };

  const handleDeleteFolder = async (folderIdToDelete: string) => {
    const folder = allFolders.find((f) => f.id === folderIdToDelete);
    const name = folder ? folder.name : "this folder";
    if (
      !confirm(
        `Are you sure you want to delete folder "${name}"? Subfolders will also be deleted, and notes inside will move to root.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/folder/${folderIdToDelete}`, {
        method: "DELETE",
      }).then((r) => r.json());

      if (res.success) {
        setFolderId(null);
        setIsAutoSaved(false);
        await fetchFoldersAndNotes(true);
        window.dispatchEvent(new Event("refresh-sidebar"));
        alert(`Folder "${name}" was deleted successfully.`);
      } else {
        alert(res.message || "Failed to delete folder");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to delete folder");
    }
  };

  if (isInitialLoading) {
    return (
      <PencilLoader
        text="Loading editor workspace..."
        subtitle="Unfolding catalog drawers..."
        className="w-full h-[60vh] flex flex-col items-center justify-center bg-transparent"
      />
    );
  }

  return (
    <div className="min-h-full flex flex-col gap-6 relative select-none pb-8 text-slate-800 paper-theme">
      <EditorHeader
        title={title}
        setTitle={setTitle}
        setIsAutoSaved={setIsAutoSaved}
        checkingGrammar={checkingGrammar}
        triggerGrammarCheck={triggerGrammarCheck}
        copyHtml={copyHtml}
        downloadMarkdownFile={downloadMarkdownFile}
        triggerDeleteNote={triggerDeleteNote}
        viewMode={viewMode}
        setViewMode={setViewMode}
        savingNote={savingNote}
        triggerSaveNote={triggerSaveNote}
        hasNoteId={!!noteId}
      />

      {/* Main split screen */}
      <div className="grow flex flex-col md:flex-row gap-6 min-h-120">
        <EditorPanel
          editor={editor}
          isAutoSaved={isAutoSaved}
          grammarSuggestions={grammarSuggestions}
          fixGrammar={fixGrammar}
          viewMode={viewMode}
        />

        {viewMode === "split" && (
          <ReviewPanel
            activeRightTab={activeRightTab}
            setActiveRightTab={setActiveRightTab}
            content={content}
            isPinned={isPinned}
            setIsPinned={setIsPinned}
            isFavorite={isFavorite}
            setIsFavorite={setIsFavorite}
            folderId={folderId}
            setFolderId={setFolderId}
            allFolders={allFolders}
            getFolderLabel={getFolderLabel}
            tags={tags}
            newTagName={newTagName}
            setNewTagName={setNewTagName}
            handleAddTag={handleAddTag}
            handleRemoveTag={handleRemoveTag}
            allNotes={allNotes}
            noteId={noteId}
            loadingList={loadingList}
            newDraftTitle={newDraftTitle}
            setNewDraftTitle={setNewDraftTitle}
            handleCreateDraft={handleCreateDraft}
            handleTogglePinNote={handleTogglePinNote}
            handleToggleFavoriteNote={handleToggleFavoriteNote}
            handleDeleteNoteFromList={handleDeleteNoteFromList}
            handleSelectNote={handleSelectNote}
            handleDeleteFolder={handleDeleteFolder}
            setIsAutoSaved={setIsAutoSaved}
          />
        )}
      </div>
    </div>
  );
}

export default function TextNoteStudio() {
  return (
    <React.Suspense fallback={<PencilLoader text="Opening studio workspace..." subtitle="Binding parchment wood..." />}>
      <TextNoteStudioInner />
    </React.Suspense>
  );
}
