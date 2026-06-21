import { NextRequest, NextResponse } from "next/server";
import { getDB, saveDB, Note } from "@/lib/db";
import { UpdateNoteSchema } from "@/lib/validations/note";

// GET: Retrieve a single note by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDB();
    
    const note = db.notes.find((n) => n.id === id);
    if (!note) {
      return NextResponse.json(
        { success: false, message: "Note not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, note });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to retrieve note" },
      { status: 500 }
    );
  }
}

// PUT/PATCH: Update an existing note
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Validate
    const validated = UpdateNoteSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const db = getDB();
    const noteIdx = db.notes.findIndex((n) => n.id === id);
    if (noteIdx === -1) {
      return NextResponse.json(
        { success: false, message: "Note not found." },
        { status: 404 }
      );
    }

    const note = db.notes[noteIdx];
    const updates = validated.data;

    // Apply updates
    if (updates.title !== undefined) note.title = updates.title;
    if (updates.content !== undefined) note.content = updates.content;
    if (updates.folderId !== undefined) note.folderId = updates.folderId;
    if (updates.isPinned !== undefined) note.isPinned = updates.isPinned;
    if (updates.isFavorite !== undefined) note.isFavorite = updates.isFavorite;

    if (updates.tags !== undefined) {
      // Clean tags
      const cleanTags = updates.tags
        .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
        .filter((t) => t.length > 0);
      
      note.tags = cleanTags;

      // Add newly introduced tags to tags index database
      cleanTags.forEach((tagName) => {
        if (!db.tags.some((t) => t.name === tagName)) {
          db.tags.push({
            id: `t-${crypto.randomUUID()}`,
            name: tagName,
          });
        }
      });
    }

    note.updatedAt = new Date().toISOString();
    db.notes[noteIdx] = note;
    saveDB(db);

    return NextResponse.json({ success: true, note });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update note" },
      { status: 500 }
    );
  }
}

// DELETE: Delete note
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDB();

    const noteExists = db.notes.some((n) => n.id === id);
    if (!noteExists) {
      return NextResponse.json(
        { success: false, message: "Note not found." },
        { status: 404 }
      );
    }

    db.notes = db.notes.filter((n) => n.id !== id);
    saveDB(db);

    return NextResponse.json({ success: true, message: "Note deleted successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete note" },
      { status: 500 }
    );
  }
}
export { PUT as PATCH }; // support both PUT and PATCH
