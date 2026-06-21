import { NextRequest, NextResponse } from "next/server";
import { getDB, saveDB } from "@/lib/db";
import { UpdateFolderSchema } from "@/lib/validations/folder";

// Helper to recursively collect all nested subfolder IDs
function getSubfolderIds(folderId: string, folders: { id: string; parentId: string | null }[]): string[] {
  const ids: string[] = [];
  const queue = [folderId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    const children = folders.filter((f) => f.parentId === current);
    children.forEach((child) => {
      ids.push(child.id);
      queue.push(child.id);
    });
  }
  return ids;
}

// PUT: Update folder (rename or move/nest under another folder)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Validate
    const validated = UpdateFolderSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, parentId } = validated.data;
    const db = getDB();

    const folderIdx = db.folders.findIndex((f) => f.id === id);
    if (folderIdx === -1) {
      return NextResponse.json(
        { success: false, message: "Folder not found." },
        { status: 404 }
      );
    }

    const folder = db.folders[folderIdx];

    // Prevent nesting a folder inside itself or its children
    if (parentId) {
      if (parentId === id) {
        return NextResponse.json(
          { success: false, message: "A folder cannot be nested inside itself." },
          { status: 400 }
        );
      }
      const nestedIds = getSubfolderIds(id, db.folders);
      if (nestedIds.includes(parentId)) {
        return NextResponse.json(
          { success: false, message: "A folder cannot be nested inside its subfolders." },
          { status: 400 }
        );
      }
    }

    // Apply updates
    if (name !== undefined) {
      folder.name = name;
    }
    if (parentId !== undefined) {
      folder.parentId = parentId;
    }
    folder.updatedAt = new Date().toISOString();

    db.folders[folderIdx] = folder;
    saveDB(db);

    return NextResponse.json({ success: true, folder });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update folder" },
      { status: 500 }
    );
  }
}

// DELETE: Delete folder (move notes to root, and delete/reparent subfolders recursively)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDB();

    const folderExists = db.folders.some((f) => f.id === id);
    if (!folderExists) {
      return NextResponse.json(
        { success: false, message: "Folder not found." },
        { status: 404 }
      );
    }

    // Collect all subfolder IDs
    const subfolderIds = getSubfolderIds(id, db.folders);
    const allFolderIdsToDelete = [id, ...subfolderIds];

    // Delete folders
    db.folders = db.folders.filter((f) => !allFolderIdsToDelete.includes(f.id));

    // Reparent sub-items or clean notes folderIds
    db.notes = db.notes.map((note) => {
      if (note.folderId && allFolderIdsToDelete.includes(note.folderId)) {
        return { ...note, folderId: null, updatedAt: new Date().toISOString() };
      }
      return note;
    });

    saveDB(db);

    return NextResponse.json({ success: true, message: "Folder and subfolders deleted successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete folder" },
      { status: 500 }
    );
  }
}
