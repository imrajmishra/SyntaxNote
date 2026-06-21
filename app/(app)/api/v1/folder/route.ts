import { NextRequest, NextResponse } from "next/server";
import { getDB, saveDB, Folder } from "@/lib/db";
import { CreateFolderSchema } from "@/lib/validations/folder";

// GET: Retrieve all folders
export async function GET() {
  try {
    const db = getDB();
    return NextResponse.json({ success: true, folders: db.folders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load folders" },
      { status: 500 }
    );
  }
}

// POST: Create a new folder
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate
    const validated = CreateFolderSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, parentID } = validated.data;
    const db = getDB();

    // Check if folder name already exists in the same nesting level
    const exists = db.folders.some(
      (f) =>
        f.name.toLowerCase() === name.toLowerCase() &&
        f.parentId === (parentID || null)
    );
    if (exists) {
      return NextResponse.json(
        { success: false, message: "A folder with this name already exists at this level." },
        { status: 400 }
      );
    }

    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      parentId: parentID || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.folders.push(newFolder);
    saveDB(db);

    return NextResponse.json({ success: true, folder: newFolder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create folder" },
      { status: 500 }
    );
  }
}