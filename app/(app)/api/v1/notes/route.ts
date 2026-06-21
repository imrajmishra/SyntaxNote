import { NextRequest, NextResponse } from "next/server";
import { getDB, saveDB, Note, Tag } from "@/lib/db";
import { CreateNoteSchema } from "@/lib/validations/note";

// GET: Retrieve all notes (supports search query q, folderId, tag, isPinned, isFavorite filters)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim().toLowerCase();
    const folderId = searchParams.get("folderId");
    const tag = searchParams.get("tag");
    const isPinned = searchParams.get("isPinned");
    const isFavorite = searchParams.get("isFavorite");

    const db = getDB();
    let filteredNotes = db.notes;

    // 1. Search filter
    if (q) {
      filteredNotes = filteredNotes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // 2. Folder filter
    if (folderId !== null) {
      if (folderId === "null") {
        filteredNotes = filteredNotes.filter((n) => n.folderId === null);
      } else {
        filteredNotes = filteredNotes.filter((n) => n.folderId === folderId);
      }
    }

    // 3. Tag filter
    if (tag) {
      filteredNotes = filteredNotes.filter((n) =>
        n.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
      );
    }

    // 4. Pin status filter
    if (isPinned !== null) {
      const pinVal = isPinned === "true";
      filteredNotes = filteredNotes.filter((n) => n.isPinned === pinVal);
    }

    // 5. Favorite status filter
    if (isFavorite !== null) {
      const favVal = isFavorite === "true";
      filteredNotes = filteredNotes.filter((n) => n.isFavorite === favVal);
    }

    // Sort pinned notes to the top, then newest first
    filteredNotes.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return NextResponse.json({ success: true, notes: filteredNotes });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load notes" },
      { status: 500 }
    );
  }
}

// POST: Create a new note
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate
    const validated = CreateNoteSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, content, folderId, tags, isPinned, isFavorite } = validated.data;
    const db = getDB();

    // Clean and validate tags
    const cleanTags = (tags || [])
      .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
      .filter((t) => t.length > 0);

    // Create note object
    const newNote: Note = {
      id: crypto.randomUUID(),
      title,
      content: content || "",
      folderId: folderId || null,
      tags: cleanTags,
      isPinned: isPinned || false,
      isFavorite: isFavorite || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add tags to unique tags database index if not already present
    cleanTags.forEach((tagName) => {
      if (!db.tags.some((t) => t.name === tagName)) {
        db.tags.push({
          id: `t-${crypto.randomUUID()}`,
          name: tagName,
        });
      }
    });

    db.notes.push(newNote);
    saveDB(db);

    return NextResponse.json({ success: true, note: newNote }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create note" },
      { status: 500 }
    );
  }
}