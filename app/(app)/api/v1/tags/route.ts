import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

// GET: Retrieve all unique tags
export async function GET() {
  try {
    const db = getDB();
    
    // Aggregate unique tags from the database index and all notes
    const tagSet = new Set<string>();
    
    // Add indexed tags
    db.tags.forEach((t) => tagSet.add(t.name.toLowerCase()));
    
    // Add note tags
    db.notes.forEach((n) => {
      n.tags.forEach((t) => tagSet.add(t.toLowerCase()));
    });

    const tags = Array.from(tagSet).map((tagName) => ({
      name: tagName,
    }));

    return NextResponse.json({ success: true, tags });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load tags" },
      { status: 500 }
    );
  }
}
